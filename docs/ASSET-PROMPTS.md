# برومبتات صور الموقع (Assets)

بعد كل ديزاين، هنا بتتكتب الصور اللي محتاجينها منه، وكل صورة ليها برومبت جاهز لـ ChatGPT.

**قواعد عامة:**
- كل صورة في **شات جديد**، وارفع معاها صورة المنتج الحقيقي لو الصورة فيها منتج، عشان يطلع شبهه.
- احفظ الصورة في `docs/assets/` بالاسم المكتوب جنبها.
- **مش محتاجين صور لـ:** الخيط البنفسجي، والحدود المنقطة، والأيقونات، لأننا بنرسمهم في الكود. وكمان صور المنتجات نفسها، لأنها بتترفع من لوحة التحكم.

- **الهيرو والبانرات** (أي صورة فيها منتج) بتتغير من **لوحة التحكم** (CMS)، والصور اللي هنا مجرد صور مبدئية.
  الثابت في الكود بس: الزخارف والرسومات (زي كورة الصوف والتوقيع).

---

## من ديزاين 01: الهوم

### A1 · صورة الهيرو · `hero-baby-set.png`
```
Professional lifestyle product photo, wide 16:9 (2400x1350). A handmade red-and-white crochet baby dress
with white polka-dot pom-poms, a matching crochet hat with a red bow, and tiny red crochet booties, laid
flat on a soft cream knitted blanket, with a small teddy bear and white baby's-breath flowers. Soft natural
window light, warm cozy tones, shallow depth of field. Keep the LEFT 45% of the frame calm and empty
(soft blanket texture only) because text will be placed there. No text, no logo, no watermark.
```
> ارفع معاها `docs/references/products/ref-2.png` عشان الفستان يطلع شبه منتجكم.

### A2 · إيد بتشتغل كروشيه · `made-by-hand.png`
```
Close-up lifestyle photo, 4:3 (1600x1200). A woman's hands crocheting a deep red yarn piece with a wooden
crochet hook, cozy cream knitted sweater sleeves, soft warm window light, cream and blush tones, shallow
depth of field, authentic and artisanal. No face, no text, no logo, no watermark.
```

### A3 · بانر التطريز · `embroidery-banner.png`
```
Lifestyle product photo, wide 21:9 (2520x1080). A wooden embroidery hoop with the name "Noor" hand
embroidered in elegant purple script, surrounded by small pink and purple embroidered flowers, resting on a
soft cream knitted blanket with white baby's-breath flowers. Soft warm light. Keep the LEFT 50% calm and
empty for text. No other text, no logo, no watermark.
```

### A4 · بانر الطلب المخصوص · `custom-order.png`
```
Product photo with TRANSPARENT background (PNG, 1200x1200). A small handmade red crochet baby dress with
white pom-poms next to a red-and-white yarn ball with a crochet hook and a small paper sketch of the dress
design. Soft shadow under the objects only, no background, no frame, no text, no watermark.
```

### A5 · كورة الصوف · `yarn-ball.png`
```
A single red-and-white striped yarn ball with a thin needle stuck in it, exactly in the style of a brand
logo accent: soft flat-3D illustration, colors only #C32C3C red and white, subtle soft shading.
TRANSPARENT background (PNG, 800x800), no shadow box, no frame, no text.
```

### A6 · توقيع "Handmade with love" · `handmade-with-love.png`
```
Elegant hand-lettered script text "Handmade with love" with a small heart drawn with a single continuous
thread line at the end. Color: soft blush pink #F6E9EC on a TRANSPARENT background (PNG, 1200x500),
thin flowing calligraphy, no other elements, no shadow.
```

> **الأقسام والمنتجات وإنستجرام والتقييمات** في الديزاين: كلها صور منتجات حقيقية بتترفع من لوحة التحكم، ومش محتاجين نطلّعها.

---

## من ديزاين 02: الهوم موبايل

**مفيش صور جديدة.**
- كورة الصوف البنفسجي الصغيرة اللي جنب العناوين، وأيقونة "Our Story"، والخيط اللي فيه قلب: هنرسمهم SVG في الكود.
- صور الهيرو والأقسام والمنتجات بتترفع من الداش بورد.

---

## من ديزاين 03: صفحة القسم

**مفيش صور جديدة.** صورة بانر القسم بتترفع من الداش بورد مع القسم نفسه، والخيط وكورة الصوف بيترسموا SVG في الكود.

---

## من ديزاين 04: صفحة المنتج

**مفيش صور جديدة.** صور المنتج والاستوريز من الداش بورد، وصور التقييمات بيرفعها العملاء، وصورة العميل الصغيرة بتتعرض كأول حرف من اسمه. أيقونة كورة الصوف اللي في البادج بتترسم SVG.

---

## من ديزاين 05: الاستوريز

**مفيش صور جديدة.** الاستوريز بتيجي من إنستجرام، وصورة البروفايل هي اللوجو الموجود عندنا.
> خانة "Send message" مش هتبعت رسالة على إنستجرام، هتتبدل بزرار "ابعتيلنا على واتساب/إنستجرام" يفتح الشات. والقلب هيضيف المنتج للمفضلة.

---

## من ديزاين 06: السلة وإتمام الطلب

### A7 · كورة الصوف الفرحانة · `yarn-happy.png`
بتظهر في صفحة "طلبك اتأكد"، وهنستخدمها كمان في الصفحات الفاضية (سلة فاضية، مفيش نتايج).
```
Cute happy character illustration: a red-and-white striped yarn ball (#C32C3C and white) with a small
smiling face, tiny legs, cheerfully pulling a loose red yarn thread that curls into a heart shape. Same
soft flat-3D style as the attached yarn ball. A few tiny sparkles and small pink hearts around it.
TRANSPARENT background (PNG, 1200x1200), clean sharp edges, no glow, no halo, no shadow box, no text.
```
> ارفع معاها `docs/assets/yarn-ball.png` عشان تطلع بنفس الستايل.

- شريط الشحن المجاني، والخيط والقلب المنقط: SVG في الكود.

---

## من ديزاين 07: اطلب قطعة مخصوص

**مفيش صور جديدة.**
- صورة الهيرو و"Past Custom Pieces" بتترفع من الداش بورد.
- أيقونات النوع (فستان، كارديجان، شنطة، تطريز): SVG خطوط في الكود.
- "Custom made · Just for you": خط مكتوب بإيد من Google Fonts.
> حد رفع صور الزبون 5MB لكل صورة و5 صور بالكتير، مش 10MB زي ما في الديزاين.

---

## من ديزاين 08: الدخول وحساب العميل

### A8 · سلة الصوف · `yarn-basket.png`
بتظهر في صفحة تسجيل الدخول.
```
Cozy illustration: a woven wicker basket full of yarn balls in purple #832F88, red #C32C3C and cream,
a draped chunky purple knitted scarf, a cream mug with a small pink heart, a crochet hook, and a few
olive leaves on the left. Soft painterly flat-3D style, warm light. TRANSPARENT background (PNG,
1600x1000), clean sharp edges, no glow, no halo, no frame, no text.
```

- "Small hands create big joy" و"Handmade with love": خط يدوي في الكود.
- خط التتبع البنفسجي والدواير المنقطة: SVG في الكود.

---

## من ديزاين 09: الداش بورد الرئيسية

**مفيش صور جديدة.** اللوجو الأبيض موجود عندنا (`frontend/public/brand/logo-light.png`)، والرسوم البيانية بتترسم في الكود، والصور من بيانات الموقع نفسه.
> الأسعار هتبقى بالجنيه، والتحية ("صباح الخير يا ...") بتاخد اسم الشخص اللي داخل.

---

## من ديزاين 10: الداش بورد المنتجات

**مفيش صور جديدة.** حد صور الموظفين 10MB، والعربي هو التاب الأول (اللغة الأساسية).

---

## من ديزاين 11: الداش بورد الطلبات

**مفيش صور جديدة.** طرق الدفع بتتعرض بأيقونة عامة + الاسم (مش لوجوهات Visa/فودافون كاش). دلوقتي الدفع عند الاستلام بس.

---

## من ديزاين 12: الداش بورد الاستوريز والإعدادات

### A9 · ورد خطوط للقايمة · `sidebar-flowers.png`
زخرفة خفيفة تحت القايمة البنفسجي.
```
Delicate line-art illustration of crocheted flowers and leaves with a thin flowing thread, single
continuous thin line style, color soft pink #E7A3C4 only, on a TRANSPARENT background (PNG, 600x900,
vertical). Elegant, minimal, sparse, no fill, no shadow, no text.
```
- القايمة هتفضل زي ديزاين 09 (كل الأقسام)، مش القايمة المختصرة اللي هنا.

---

## بدل ديزاين 13: رسومات الصفحات الفاضية
(كورة الصوف والخيط والطلب الناجح خلصوا خلاص، فدول بس الناقصين.) كل واحدة في شات جديد، وارفع معاها `docs/assets/empty-cart.png` عشان نفس الستايل (A10 اتعملت الأول وبقت المرجع).

### A10 · سلة فاضية · `empty-cart.png`
```
Cute illustration: a small empty woven wicker basket with a sleepy red-and-white striped yarn ball
character (#C32C3C and white) peeking over its edge, a loose red thread trailing out. Same soft flat-3D
style as the attached image. TRANSPARENT background (PNG, 1000x1000), clean sharp edges, no glow,
no halo, no shadow box, no text.
```

### A11 · مفيش نتايج / الصفحة مش موجودة · `empty-search.png`
```
Cute illustration: a red-and-white striped yarn ball character (#C32C3C and white) holding a small
magnifying glass, looking curious, with a tangled thread question-mark shape beside it. Same soft
flat-3D style as the attached image. TRANSPARENT background (PNG, 1000x1000), clean sharp edges,
no glow, no halo, no shadow box, no text.
```
