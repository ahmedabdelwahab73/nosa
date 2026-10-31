/** Egypt's 27 governorates with starter fees (EGP) — editable from the dashboard after seeding. */
type Zone = { fee: number; min: number; max: number };

const ZONES = {
  greaterCairo: { fee: 60, min: 1, max: 2 },
  alexCanal: { fee: 70, min: 2, max: 3 },
  delta: { fee: 75, min: 2, max: 4 },
  upper: { fee: 90, min: 3, max: 5 },
  remote: { fee: 120, min: 4, max: 7 },
} satisfies Record<string, Zone>;

const list: [code: string, ar: string, en: string, zone: Zone][] = [
  ["cairo", "القاهرة", "Cairo", ZONES.greaterCairo],
  ["giza", "الجيزة", "Giza", ZONES.greaterCairo],
  ["qalyubia", "القليوبية", "Qalyubia", ZONES.greaterCairo],
  ["alexandria", "الإسكندرية", "Alexandria", ZONES.alexCanal],
  ["port-said", "بورسعيد", "Port Said", ZONES.alexCanal],
  ["ismailia", "الإسماعيلية", "Ismailia", ZONES.alexCanal],
  ["suez", "السويس", "Suez", ZONES.alexCanal],
  ["sharqia", "الشرقية", "Sharqia", ZONES.delta],
  ["dakahlia", "الدقهلية", "Dakahlia", ZONES.delta],
  ["gharbia", "الغربية", "Gharbia", ZONES.delta],
  ["monufia", "المنوفية", "Monufia", ZONES.delta],
  ["beheira", "البحيرة", "Beheira", ZONES.delta],
  ["kafr-el-sheikh", "كفر الشيخ", "Kafr El Sheikh", ZONES.delta],
  ["damietta", "دمياط", "Damietta", ZONES.delta],
  ["faiyum", "الفيوم", "Faiyum", ZONES.upper],
  ["beni-suef", "بني سويف", "Beni Suef", ZONES.upper],
  ["minya", "المنيا", "Minya", ZONES.upper],
  ["asyut", "أسيوط", "Asyut", ZONES.upper],
  ["sohag", "سوهاج", "Sohag", ZONES.upper],
  ["qena", "قنا", "Qena", ZONES.upper],
  ["luxor", "الأقصر", "Luxor", ZONES.upper],
  ["aswan", "أسوان", "Aswan", ZONES.upper],
  ["red-sea", "البحر الأحمر", "Red Sea", ZONES.remote],
  ["new-valley", "الوادي الجديد", "New Valley", ZONES.remote],
  ["matrouh", "مطروح", "Matrouh", ZONES.remote],
  ["north-sinai", "شمال سيناء", "North Sinai", ZONES.remote],
  ["south-sinai", "جنوب سيناء", "South Sinai", ZONES.remote],
];

export const GOVERNORATES = list.map(([code, ar, en, zone], order) => ({
  code,
  name: { ar, en },
  fee: zone.fee,
  estimatedDays: { min: zone.min, max: zone.max },
  isActive: true,
  order,
}));
