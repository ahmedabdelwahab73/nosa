# برومبتات ChatGPT لديزاين الموقع

## إزاي تستخدمها
1. **كل برومبت في شات جديد.** كل برومبت هنا كامل لوحده، وفيه وصف البراند جواه، فمش محتاج تبعت حاجة قبله.
2. في كل شات، ارفع الأول:
   - اللوجو: `frontend/public/brand/logo.png`
   - 2 أو 3 من صور منتجاتكم: `docs/references/products/ref-2.png` و `ref-6.png` و `ref-7.png`
3. انسخ البرومبت كله من أوله لآخره والزقه.
4. لو الصورة طلعت مش عاجباك، اكتب في نفس الشات: *"Keep everything, but change X"*.
5. احفظ كل صورة في `docs/designs/` باسم البرومبت (`01-home-desktop.png` ...) وابعتهالي.

> الصور هتطلع بالاتجاه العربي (RTL)، بس الكلام فيها إنجليزي مؤقت، لأن ChatGPT بيبوّظ الكتابة العربي. إحنا محتاجين منه الشكل بس.

---

## 01 · الهوم: كمبيوتر
```
You are a world-class UI/UX designer. Design for "Nosa Handmade Crafts", an Egyptian brand of handmade
crochet, knitting and hand embroidery (baby dress sets with hats and booties, kids cardigans with crochet
bows, crochet bags, paw fingerless gloves, personalised embroidered keepsakes). The attached logo must be
used exactly as is (never redraw it, never put it in a white box). The attached photos are our real products.
Palette (use only these): royal purple #832F88 (primary), yarn red #C32C3C (accent/sale), ink #141414 (text),
warm linen #FAF6F1 (background), soft blush #F6E9EC (soft sections), white #FFFFFF (cards), line #E9E1D8.
Style: warm, tender, artisanal yet ultra-modern and luxurious boutique. Motifs: a thin purple thread line
flowing between sections, dashed "stitch" borders, a red-and-white yarn ball accent, rounded-2xl cards,
soft purple-tinted shadows, generous whitespace, real lifestyle photography. Fonts: elegant serif headings
+ clean geometric sans body. Layout direction RTL (logo on the right), English placeholder text.
Pixel-perfect, high fidelity, Dribbble-shot quality.

SCREEN: full homepage, desktop 1440px, one tall long-scroll image:
1) Slim purple announcement bar ("Free shipping over 1500 EGP").
2) Header: logo, nav (Baby Sets, Cardigans, Bags, Accessories, Embroidery Gifts, Custom Order), search,
   wishlist, account, cart with count badge, AR/EN switch.
3) Instagram-style stories row: circular thumbnails with purple gradient rings.
4) Hero: large lifestyle photo of a crochet baby dress set, bold serif headline, two buttons
   (Shop now / Order a custom piece), the purple thread line drawing across the hero.
5) Shop by category: five soft organic-shaped image tiles.
6) Best sellers grid (4 columns): product cards with price, sale price, rating, wishlist heart,
   color swatches, "Handmade" badge.
7) "Made by hand" story section: hands crocheting, short brand story, stats.
8) Personalised embroidery banner ("Your names, stitched forever").
9) Custom order banner ("Design your own piece") with 3 steps.
10) Customer reviews carousel with photos. 11) Instagram gallery grid. 12) Newsletter.
13) Rich footer on dark ink background with a light version of the logo.
```

## 02 · الهوم: موبايل
```
You are a world-class UI/UX designer. Design for "Nosa Handmade Crafts", an Egyptian brand of handmade
crochet, knitting and hand embroidery (baby dress sets, kids cardigans, crochet bags, accessories,
personalised embroidery). Use the attached logo exactly as is (never in a white box); attached photos are
our real products. Palette only: purple #832F88, yarn red #C32C3C, ink #141414, linen #FAF6F1,
blush #F6E9EC, white, line #E9E1D8. Style: warm, artisanal, ultra-modern luxury boutique; thin purple
thread line motif, dashed stitch borders, yarn ball accent, rounded-2xl cards, soft shadows, real
photography. Serif headings + clean sans body. RTL layout, English placeholder text. High fidelity.

SCREEN: the homepage on mobile (390px). Show 3 phone screens side by side: sticky compact header with
logo and cart, stories row with purple rings, hero with headline and button, horizontally scrolling
category chips, 2-column product grid, embroidery banner, and a bottom navigation bar
(Home, Shop, Search, Wishlist, Cart).
```

## 03 · الشوب والأقسام
```
You are a world-class UI/UX designer. Design for "Nosa Handmade Crafts", an Egyptian brand of handmade
crochet, knitting and hand embroidery. Use the attached logo exactly as is (never in a white box);
attached photos are our real products. Palette only: purple #832F88, yarn red #C32C3C, ink #141414,
linen #FAF6F1, blush #F6E9EC, white, line #E9E1D8. Style: warm, artisanal, ultra-modern luxury boutique;
thin purple thread line motif, dashed stitch borders, rounded-2xl cards, soft shadows. Serif headings +
clean sans body. RTL layout, English placeholder text. High fidelity.

SCREEN: category listing page "Baby Sets", desktop 1440px: breadcrumb, category banner with title and
short text, filters sidebar (age/size chips 0-3m to 4y, color swatches, price range slider,
in stock / made to order, customisable) separated by dashed stitch dividers, sort dropdown, active filter
chips, 3-column product grid with hover state, elegant pagination. Next to it, the mobile version (390px)
with a bottom-sheet filter panel.
```

## 04 · صفحة المنتج
```
You are a world-class UI/UX designer. Design for "Nosa Handmade Crafts", an Egyptian brand of handmade
crochet, knitting and hand embroidery. Use the attached logo exactly as is (never in a white box);
attached photos are our real products. Palette only: purple #832F88, yarn red #C32C3C, ink #141414,
linen #FAF6F1, blush #F6E9EC, white, line #E9E1D8. Style: warm, artisanal, ultra-modern luxury boutique;
thin purple thread line motif, dashed stitch borders, rounded-2xl cards, soft shadows. Serif headings +
clean sans body. RTL layout, English placeholder text. High fidelity.

SCREEN: product page for "Red & white crochet dress set", desktop 1440px: large image gallery with
thumbnails, product on a clean light background, title, price + sale price, rating, "Set includes:
dress, hat" chips, age/size selector, color swatches, quantity stepper, big purple "Add to cart" +
outline "Buy now", "Handmade in Egypt, ready in 3-5 days" stitched badge, delivery estimate by
governorate, optional personalisation field ("Add a name, +50 EGP"), accordion (details, care,
shipping), "Seen in our stories" mini strip, reviews with photos, "You may also like" carousel.
Also show the mobile version (390px) with a sticky add-to-cart bar.
```

## 05 · عارض الاستوريز
```
You are a world-class UI/UX designer. Design for "Nosa Handmade Crafts", an Egyptian brand of handmade
crochet and embroidery. Use the attached logo exactly as is (never in a white box); attached photos are
our real products. Palette only: purple #832F88, yarn red #C32C3C, ink #141414, linen #FAF6F1,
blush #F6E9EC, white. Style: warm, artisanal, ultra-modern luxury boutique. RTL layout, English
placeholder text. High fidelity.

SCREEN: full-screen Instagram-like story viewer, mobile (390px) and desktop side by side: progress bars
on top, brand avatar with a light version of the logo, story photo of a crochet bag, a floating product
card at the bottom ("Shop this piece", price, purple button), dark blurred backdrop, close and
next/previous controls.
```

## 06 · السلة وإتمام الطلب
```
You are a world-class UI/UX designer. Design for "Nosa Handmade Crafts", an Egyptian brand of handmade
crochet, knitting and hand embroidery. Use the attached logo exactly as is (never in a white box);
attached photos are our real products. Palette only: purple #832F88, yarn red #C32C3C, ink #141414,
linen #FAF6F1, blush #F6E9EC, white, line #E9E1D8. Style: warm, artisanal, ultra-modern, very
trustworthy; dashed stitch borders, rounded-2xl cards, soft shadows. Serif headings + clean sans body.
RTL layout, English placeholder text. High fidelity.

SCREENS (one image, three parts):
(a) Slide-in cart drawer from the left: items with thumbnails, size/color, personalisation note,
quantity steppers, free-shipping progress bar drawn as a yarn thread, subtotal, checkout button.
(b) Checkout page, single page: contact (or login with Google / phone), address with Egyptian governorate
and city selects, shipping cost per governorate, payment methods (Cash on delivery active; Card, Wallet,
InstaPay shown as "coming soon"), order notes, coupon field, sticky order summary card.
(c) Order success page with a cute yarn-ball illustration and the order number.
```

## 07 · صفحة اطلب قطعة مخصوص
```
You are a world-class UI/UX designer. Design for "Nosa Handmade Crafts", an Egyptian brand of handmade
crochet, knitting and hand embroidery. Use the attached logo exactly as is (never in a white box);
attached photos are our real products. Palette only: purple #832F88, yarn red #C32C3C, ink #141414,
linen #FAF6F1, blush #F6E9EC, white, line #E9E1D8. Style: warm, tender, artisanal, ultra-modern;
thin purple thread line motif, dashed stitch borders, rounded-2xl cards. Serif headings + clean sans
body. RTL layout, English placeholder text. High fidelity.

SCREEN: "Design your own piece" page, desktop 1440px: friendly hero, 3-step form (choose type: dress set /
cardigan / bag / embroidery, then describe the idea, sizes, colors, budget, then upload reference photos),
a gallery of past custom pieces, FAQ accordion. Soft blush background sections.
```

## 08 · حساب العميل وتسجيل الدخول
```
You are a world-class UI/UX designer. Design for "Nosa Handmade Crafts", an Egyptian brand of handmade
crochet, knitting and hand embroidery. Use the attached logo exactly as is (never in a white box).
Palette only: purple #832F88, yarn red #C32C3C, ink #141414, linen #FAF6F1, blush #F6E9EC, white,
line #E9E1D8. Style: warm, artisanal, ultra-modern; dashed stitch borders, rounded-2xl cards.
Serif headings + clean sans body. RTL layout, English placeholder text. High fidelity.

SCREENS (one image):
(a) Super simple login: big "Continue with Google" button, "or" divider, one phone number field with
+20 prefix and a "Continue" button (the next step asks for a password only). Cozy illustration on the side.
(b) Customer account area: side menu (Orders, Custom orders, Addresses, Wishlist, Profile), orders list
with status badges, and an order details view with a tracking timeline drawn as a purple thread line
(Confirmed, In production, Ready, Shipped, Delivered).
```

## 09 · لوحة التحكم: الرئيسية
```
You are a world-class UI/UX designer. Design the admin dashboard for "Nosa Handmade Crafts", an Egyptian
handmade crochet and embroidery brand. Use the attached logo exactly as is (never in a white box).
Palette only: purple #832F88 (primary), yarn red #C32C3C (alerts), ink #141414, linen #FAF6F1
(background), white cards, line #E9E1D8. Style: clean, calm, modern SaaS dashboard with a warm handmade
touch (subtle dashed stitch dividers). RTL layout, English placeholder text. High fidelity, 1440px.

SCREEN: right sidebar with the logo and nav (Overview, Orders, Custom Orders, Products, Categories,
Customers, Coupons, Reviews, Stories, Website Content, Shipping, Staff, Settings); top bar with search,
notifications, profile. Content: KPI cards (revenue, orders, average order value, new customers) with
sparklines, revenue line chart, orders-by-status donut, top products table, recent orders table,
low-stock alerts, custom orders waiting for a quote, latest synced Instagram stories.
```

## 10 · لوحة التحكم: المنتجات
```
You are a world-class UI/UX designer. Design the admin dashboard for "Nosa Handmade Crafts", an Egyptian
handmade crochet and embroidery brand. Use the attached logo exactly as is (never in a white box);
attached photos are our real products. Palette only: purple #832F88, yarn red #C32C3C, ink #141414,
linen #FAF6F1, white cards, line #E9E1D8. Style: clean, calm, modern SaaS dashboard with subtle dashed
stitch dividers. Right sidebar navigation. RTL layout, English placeholder text. High fidelity, 1440px.

SCREENS (one image):
(a) Products list: data table with thumbnail, name, category, price, stock, status toggle, bulk actions,
filters and search.
(b) Product editor, two columns: name and description with AR/EN tabs, price / sale price, options builder
(sizes, colors) generating a variants table (SKU, price, stock, made-to-order toggle), personalisation
fields builder, image uploader with drag & drop and a "Remove background" toggle showing before/after,
category and tags, production days, SEO preview, publish status card.
```

## 11 · لوحة التحكم: الطلبات
```
You are a world-class UI/UX designer. Design the admin dashboard for "Nosa Handmade Crafts", an Egyptian
handmade crochet and embroidery brand. Use the attached logo exactly as is (never in a white box).
Palette only: purple #832F88, yarn red #C32C3C, ink #141414, linen #FAF6F1, white cards, line #E9E1D8.
Style: clean, calm, modern SaaS dashboard with subtle dashed stitch dividers. Right sidebar navigation.
RTL layout, English placeholder text. High fidelity, 1440px.

SCREENS (one image):
(a) Orders list with status tabs (Pending, Confirmed, In production, Ready, Shipped, Delivered, Cancelled),
colored status badges, filters by date, governorate and payment method.
(b) Order details: customer info, items with personalisation notes, payment and shipping info, status
timeline, change-status control, print invoice / shipping label buttons, internal notes.
```

## 12 · لوحة التحكم: الاستوريز والإعدادات
```
You are a world-class UI/UX designer. Design the admin dashboard for "Nosa Handmade Crafts", an Egyptian
handmade crochet and embroidery brand. Use the attached logo exactly as is (never in a white box);
attached photos are our real products. Palette only: purple #832F88, yarn red #C32C3C, ink #141414,
linen #FAF6F1, white cards, line #E9E1D8. Style: clean, calm, modern SaaS dashboard with subtle dashed
stitch dividers. Right sidebar navigation. RTL layout, English placeholder text. High fidelity, 1440px.

SCREENS (one image):
(a) Stories manager: "Connected Instagram account" card with last sync time and a "Sync now" button,
grid of vertical 9:16 story cards, each with toggles (show on website, highlight) and a "Link product" picker.
(b) Settings: store info, guest checkout on/off, payment methods on/off, shipping rates per Egyptian
governorate table, social links.
```

## 13 · رسومات بخلفية شفافة
```
Create separate PNG illustrations with a TRANSPARENT background (no white, no shadow box, no frame) for
"Nosa Handmade Crafts", an Egyptian handmade crochet and embroidery brand. Use only these colors:
purple #832F88, yarn red #C32C3C, ink #141414, blush #F6E9EC, white. Soft flat-3D style, cute and warm.
Items: a red-and-white yarn ball with a needle, a flowing purple thread line, a crochet hook, a small
knitted heart, a tiny crochet bow, an empty-cart illustration, an empty-search illustration, an
order-success illustration, a custom-order illustration (scissors + yarn).
```
