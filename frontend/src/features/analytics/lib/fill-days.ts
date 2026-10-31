const DAY_MS = 24 * 60 * 60 * 1000;

/** Store days are Cairo days, matching how the API groups sales. */
const cairoDay = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Cairo", year: "numeric", month: "2-digit", day: "2-digit" });

type Day = { date: string; revenue: number; orders: number };

/** The API only returns days that had orders; charts need every day of the range, with zeros. */
export function fillDays(days: number, byDay: Day[], now = new Date()): Day[] {
  const known = new Map(byDay.map((day) => [day.date, day]));
  return Array.from({ length: days }, (_, index) => {
    const date = cairoDay.format(new Date(now.getTime() - (days - 1 - index) * DAY_MS));
    return known.get(date) ?? { date, revenue: 0, orders: 0 };
  });
}
