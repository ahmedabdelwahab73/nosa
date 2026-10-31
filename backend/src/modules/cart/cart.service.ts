import { MAX_LINE_QUANTITY, type CartDto } from "@nosa/contracts";
import { ApiError } from "@/shared/http/api-error";
import { evaluateCoupon } from "@/modules/coupons/coupons.service";
import { loadProductsForLines, resolveLine, validateCustomization, type ResolvedLine } from "@/modules/products/products.pricing";
import { CART_TTL_MS, CartModel, type CartDocument } from "./cart.model";

/** Who owns the cart: the signed-in user, otherwise the guest id from the x-cart-id header. */
export type CartOwner = { userId?: string; guestId?: string };

const ownerFilter = ({ userId, guestId }: CartOwner) => {
  if (userId) return { user: userId };
  if (guestId) return { guestId };
  throw new ApiError("VALIDATION_ERROR", "Missing cart id");
};

const round = (value: number) => Math.round(value * 100) / 100;
const customizationKey = (values: Record<string, string>) => JSON.stringify(Object.entries(values).sort());

async function findCart(owner: CartOwner) {
  if (!owner.userId && !owner.guestId) return null;
  return CartModel.findOne(ownerFilter(owner));
}

async function findOrCreateCart(owner: CartOwner) {
  return CartModel.findOneAndUpdate(
    ownerFilter(owner),
    { $setOnInsert: { ...ownerFilter(owner), items: [] }, $set: { expiresAt: new Date(Date.now() + CART_TTL_MS) } },
    { upsert: true, new: true },
  );
}

/** Prices every line from current product data (one query), drops products that disappeared. */
export async function resolveCartLines(cart: CartDocument) {
  const products = await loadProductsForLines(cart.items.map((item) => String(item.product)));
  const lines: (ResolvedLine & { id: string })[] = [];
  for (const item of cart.items) {
    const product = products.get(String(item.product));
    if (!product) continue;
    try {
      const line = resolveLine(product, {
        sku: item.sku ?? undefined,
        quantity: item.quantity,
        customization: Object.fromEntries(item.customization ?? new Map()),
      });
      lines.push({ ...line, id: item.id });
    } catch {
      // The variant was removed by the admin: the line is no longer purchasable.
    }
  }
  return lines;
}

export async function toCartDto(cart: CartDocument | null, phone?: string): Promise<CartDto> {
  const empty: CartDto = { id: "", items: [], itemCount: 0, subtotal: 0, discount: 0, coupon: null, couponError: null };
  if (!cart) return empty;

  const lines = await resolveCartLines(cart);
  const subtotal = round(lines.filter((l) => l.available).reduce((sum, line) => sum + line.lineTotal, 0));

  let coupon: CartDto["coupon"] = null;
  let couponError: string | null = null;
  let discount = 0;
  if (cart.couponCode) {
    try {
      const result = await evaluateCoupon(cart.couponCode, { subtotal, phone });
      coupon = { code: result.code, type: result.type, freeShipping: result.freeShipping };
      discount = result.discount;
    } catch (error) {
      couponError = error instanceof ApiError ? (error.details?.["body.code"]?.[0] ?? error.code) : "COUPON_INVALID";
    }
  }

  return {
    id: cart.id,
    items: lines,
    itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
    subtotal,
    discount,
    coupon,
    couponError,
  };
}

export async function getCart(owner: CartOwner) {
  return toCartDto(await findCart(owner));
}

export async function addItem(owner: CartOwner, input: { productId: string; sku?: string; quantity: number; customization: Record<string, string> }) {
  const products = await loadProductsForLines([input.productId]);
  const product = products.get(input.productId);
  if (!product) throw ApiError.notFound("Product");

  const customization = validateCustomization(product, input.customization);
  const cart = await findOrCreateCart(owner);

  // Same product + variant + personalisation → increase quantity instead of a new line.
  const existing = cart.items.find(
    (item) =>
      String(item.product) === input.productId &&
      (item.sku ?? undefined) === input.sku &&
      customizationKey(Object.fromEntries(item.customization ?? new Map())) === customizationKey(customization),
  );
  const quantity = Math.min((existing?.quantity ?? 0) + input.quantity, MAX_LINE_QUANTITY);

  const line = resolveLine(product, { sku: input.sku, quantity, customization });
  if (!line.available) {
    throw new ApiError("CONFLICT", "Not enough stock", { "body.quantity": [`MAX_${line.maxQuantity}`] });
  }

  if (existing) existing.quantity = quantity;
  else cart.items.push({ product: input.productId, sku: input.sku, quantity, customization });
  await cart.save();
  return toCartDto(cart);
}

export async function updateItem(owner: CartOwner, itemId: string, quantity: number) {
  const cart = await findCart(owner);
  const item = cart?.items.id(itemId);
  if (!cart || !item) throw ApiError.notFound("Cart item");

  const product = (await loadProductsForLines([String(item.product)])).get(String(item.product));
  if (!product) throw ApiError.notFound("Product");
  const line = resolveLine(product, { sku: item.sku ?? undefined, quantity, customization: Object.fromEntries(item.customization ?? new Map()) });
  if (!line.available) throw new ApiError("CONFLICT", "Not enough stock", { "body.quantity": [`MAX_${line.maxQuantity}`] });

  item.quantity = quantity;
  await cart.save();
  return toCartDto(cart);
}

export async function removeItem(owner: CartOwner, itemId: string) {
  const cart = await findCart(owner);
  if (!cart) throw ApiError.notFound("Cart");
  cart.items.pull({ _id: itemId });
  await cart.save();
  return toCartDto(cart);
}

export async function applyCoupon(owner: CartOwner, code: string) {
  const cart = await findCart(owner);
  if (!cart || !cart.items.length) throw new ApiError("VALIDATION_ERROR", "Your cart is empty", { "body.code": ["CART_EMPTY"] });

  const { subtotal } = await toCartDto(cart);
  const coupon = await evaluateCoupon(code, { subtotal }); // throws with the reason
  cart.couponCode = coupon.code;
  await cart.save();
  return toCartDto(cart);
}

export async function removeCoupon(owner: CartOwner) {
  const cart = await findCart(owner);
  if (!cart) return toCartDto(null);
  cart.couponCode = null;
  await cart.save();
  return toCartDto(cart);
}

/** After login: moves the guest cart into the user's cart and deletes the guest cart. */
export async function mergeGuestCart(userId: string, guestId: string) {
  const guest = await CartModel.findOne({ guestId });
  if (!guest) return getCart({ userId });

  const cart = await findOrCreateCart({ userId });
  for (const item of guest.items) {
    const same = cart.items.find(
      (existing) =>
        String(existing.product) === String(item.product) &&
        existing.sku === item.sku &&
        customizationKey(Object.fromEntries(existing.customization ?? new Map())) ===
          customizationKey(Object.fromEntries(item.customization ?? new Map())),
    );
    if (same) same.quantity = Math.min(same.quantity + item.quantity, MAX_LINE_QUANTITY);
    else cart.items.push({ product: item.product, sku: item.sku, quantity: item.quantity, customization: item.customization });
  }
  cart.couponCode ??= guest.couponCode;
  await cart.save();
  await guest.deleteOne();
  return toCartDto(cart);
}

/** Used by checkout: the raw cart document. */
export async function getCartDocument(owner: CartOwner) {
  return findCart(owner);
}

export async function clearCart(cartId: string) {
  await CartModel.deleteOne({ _id: cartId });
}
