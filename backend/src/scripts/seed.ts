/**
 * Seeds a fresh database: owner account, store settings, the five main categories and demo products.
 * Safe to run more than once — existing records (by phone / slug) are left untouched.
 * Usage: npm run seed -w backend
 */
import { normalizeEgyptPhone, type ProductInput } from "@nosa/contracts";
import { connectDatabase, disconnectDatabase } from "@/config/db";
import { logger } from "@/config/logger";
import { CategoryModel } from "@/modules/categories/categories.model";
import { ProductModel } from "@/modules/products/products.model";
import { getSettings } from "@/modules/settings/settings.service";
import { seedGovernorates } from "@/modules/shipping/shipping.service";
import { UserModel } from "@/modules/users/users.model";
import { hashPassword } from "@/shared/services/password.service";

const CATEGORIES = [
  { slug: "baby-sets", name: { ar: "أطقم بيبي وبناتي", en: "Baby & girls sets" } },
  { slug: "kids-cardigans", name: { ar: "جواكت وكارديجان أطفال", en: "Kids cardigans" } },
  { slug: "bags", name: { ar: "شنط كروشيه", en: "Crochet bags" } },
  { slug: "accessories", name: { ar: "إكسسوارات", en: "Accessories" } },
  { slug: "embroidery-gifts", name: { ar: "تطريز وهدايا بالاسم", en: "Embroidery & personalised gifts" } },
];

const AGE_SIZES = [
  { value: "0-3m", label: { ar: "٠-٣ شهور", en: "0-3 months" } },
  { value: "3-6m", label: { ar: "٣-٦ شهور", en: "3-6 months" } },
  { value: "6-12m", label: { ar: "٦-١٢ شهر", en: "6-12 months" } },
  { value: "1-2y", label: { ar: "سنة لسنتين", en: "1-2 years" } },
];

type DemoProduct = Omit<ProductInput, "category"> & { slug: string; categorySlug: string };

const PRODUCTS: DemoProduct[] = [
  {
    slug: "red-white-dress-set",
    categorySlug: "baby-sets",
    name: { ar: "طقم فستان أحمر وأبيض", en: "Red & white dress set" },
    description: {
      ar: "فستان كروشيه أحمر وأبيض بنقط، ومعاه طاقية بفيونكة. شغل إيد بالكامل بخيط قطن ناعم.",
      en: "Red and white polka-dot crochet dress with a matching bow hat. Fully handmade with soft cotton yarn.",
    },
    careInstructions: { ar: "غسيل يدوي بمية باردة، ويتنشر مفرود.", en: "Hand wash cold, dry flat." },
    price: 1100,
    salePrice: 850,
    options: [{ key: "size", name: { ar: "المقاس", en: "Size" }, values: AGE_SIZES }],
    variants: AGE_SIZES.map((size) => ({ sku: `RWD-${size.value}`, optionValues: { size: size.value }, stock: 2, isMadeToOrder: true })),
    setItems: [{ ar: "فستان", en: "Dress" }, { ar: "طاقية", en: "Hat" }],
    customization: {
      enabled: true,
      extraPrice: 50,
      fields: [{ key: "baby_name", label: { ar: "اسم البيبي", en: "Baby name" }, type: "text", required: false, maxLength: 20 }],
    },
    productionDays: 5,
    status: "published",
    isFeatured: true,
    tags: ["dress", "set", "baby"],
    images: [],
    stock: 0,
    isMadeToOrder: false,
  },
  {
    slug: "bow-cardigan",
    categorySlug: "kids-cardigans",
    name: { ar: "كارديجان أوف وايت بفيونكات", en: "Off-white bow cardigan" },
    description: {
      ar: "كارديجان كروشيه أوف وايت عليه فيونكات نبيتي، وبزراير ورد صغيرة.",
      en: "Off-white crochet cardigan covered with burgundy bows and tiny flower buttons.",
    },
    price: 1350,
    options: [
      {
        key: "size",
        name: { ar: "المقاس", en: "Size" },
        values: [
          { value: "2-3y", label: { ar: "٢-٣ سنين", en: "2-3 years" } },
          { value: "3-4y", label: { ar: "٣-٤ سنين", en: "3-4 years" } },
        ],
      },
    ],
    variants: [
      { sku: "BOW-2-3y", optionValues: { size: "2-3y" }, stock: 1, isMadeToOrder: true },
      { sku: "BOW-3-4y", optionValues: { size: "3-4y" }, stock: 0, isMadeToOrder: true },
    ],
    setItems: [],
    customization: { enabled: false, fields: [], extraPrice: 0 },
    productionDays: 7,
    status: "published",
    isFeatured: true,
    tags: ["cardigan", "bows"],
    images: [],
    stock: 0,
    isMadeToOrder: false,
  },
  {
    slug: "dusty-pink-shoulder-bag",
    categorySlug: "bags",
    name: { ar: "شنطة كروشيه روز", en: "Dusty pink shoulder bag" },
    description: {
      ar: "شنطة كتف كروشيه بلون روز هادي، بيدين ومسكة طويلة. تنفع مع اللبس الكاجوال والمحتشم.",
      en: "Dusty pink crochet shoulder bag with handles and a long strap. Pairs with casual and modest outfits.",
    },
    price: 950,
    options: [
      {
        key: "color",
        name: { ar: "اللون", en: "Color" },
        values: [
          { value: "dusty-pink", label: { ar: "روز", en: "Dusty pink" }, hex: "#c99a9e" },
          { value: "cream", label: { ar: "كريمي", en: "Cream" }, hex: "#efe6d8" },
        ],
      },
    ],
    variants: [
      { sku: "BAG-PINK", optionValues: { color: "dusty-pink" }, stock: 3, isMadeToOrder: false },
      { sku: "BAG-CREAM", optionValues: { color: "cream" }, stock: 0, isMadeToOrder: true },
    ],
    setItems: [],
    customization: { enabled: false, fields: [], extraPrice: 0 },
    productionDays: 4,
    status: "published",
    isFeatured: false,
    tags: ["bag", "shoulder"],
    images: [],
    stock: 0,
    isMadeToOrder: false,
  },
  {
    slug: "paw-fingerless-gloves",
    categorySlug: "accessories",
    name: { ar: "جوانتي رجل قطة", en: "Paw fingerless gloves" },
    description: {
      ar: "جوانتي كروشيه من غير صوابع على شكل رجل قطة، دافي وخفيف.",
      en: "Cat-paw crochet fingerless gloves, warm and light.",
    },
    price: 280,
    options: [],
    variants: [],
    setItems: [],
    customization: { enabled: false, fields: [], extraPrice: 0 },
    productionDays: 2,
    status: "published",
    isFeatured: false,
    tags: ["gloves", "winter"],
    images: [],
    stock: 6,
    isMadeToOrder: false,
  },
  {
    slug: "embroidered-names-keepsake",
    categorySlug: "embroidery-gifts",
    name: { ar: "تطريز بالأسامي والتاريخ", en: "Embroidered names keepsake" },
    description: {
      ar: "قطعة تطريز يدوي بأسامي الاتنين وتاريخ مميز، هدية للخطوبة أو الجواز.",
      en: "Hand-embroidered keepsake with two names and a special date — an engagement or wedding gift.",
    },
    price: 650,
    options: [],
    variants: [],
    setItems: [],
    customization: {
      enabled: true,
      extraPrice: 0,
      fields: [
        { key: "names", label: { ar: "الأسامي", en: "Names" }, type: "text", required: true, maxLength: 40 },
        { key: "date", label: { ar: "التاريخ", en: "Date" }, type: "date", required: false },
      ],
    },
    productionDays: 6,
    status: "published",
    isFeatured: true,
    tags: ["embroidery", "gift", "wedding"],
    images: [],
    stock: 0,
    isMadeToOrder: true,
  },
];

async function seedOwner() {
  const phone = normalizeEgyptPhone(process.env.SEED_OWNER_PHONE ?? "");
  const password = process.env.SEED_OWNER_PASSWORD;
  if (!phone || !password) throw new Error("Set SEED_OWNER_PHONE and SEED_OWNER_PASSWORD in backend/.env");

  if (await UserModel.exists({ phone })) return logger.info(`Owner ${phone} already exists`);
  await UserModel.create({
    name: process.env.SEED_OWNER_NAME ?? "Nosa Owner",
    phone,
    passwordHash: await hashPassword(password),
    role: "owner",
    providers: ["phone"],
  });
  logger.info(`Owner created: ${phone}`);
}

async function seedCategories() {
  for (const [order, category] of CATEGORIES.entries()) {
    await CategoryModel.updateOne({ slug: category.slug }, { $setOnInsert: { ...category, order } }, { upsert: true });
  }
  logger.info(`${CATEGORIES.length} categories ready`);
}

async function seedProducts() {
  const categories = new Map((await CategoryModel.find().select("slug")).map((c) => [c.slug, c._id]));
  for (const { categorySlug, ...product } of PRODUCTS) {
    if (await ProductModel.exists({ slug: product.slug })) continue;
    await ProductModel.create({ ...product, category: categories.get(categorySlug) });
  }
  logger.info(`${PRODUCTS.length} demo products ready`);
}

async function main() {
  await connectDatabase();
  await seedOwner();
  await getSettings();
  await seedGovernorates();
  logger.info("27 governorates ready");
  await seedCategories();
  await seedProducts();
  await disconnectDatabase();
}

main().catch(async (error) => {
  logger.fatal(error, "Seed failed");
  await disconnectDatabase();
  process.exit(1);
});
