const TIME_ZONE = "Europe/Helsinki";

type Ymd = { year: number; month: number; day: number };

function getYmdInTz(date: Date, timeZone = TIME_ZONE): Ymd {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = fmt.formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value || "";
  return {
    year: Number(get("year")),
    month: Number(get("month")),
    day: Number(get("day")),
  };
}

function toDateFromYmd(ymd: Ymd): Date {
  return new Date(Date.UTC(ymd.year, ymd.month - 1, ymd.day));
}

function getWeekday(ymd: Ymd): number {
  return toDateFromYmd(ymd).getUTCDay();
}

function addDays(ymd: Ymd, days: number): Ymd {
  const d = toDateFromYmd(ymd);
  d.setUTCDate(d.getUTCDate() + days);
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
  };
}

export function addBusinessDays(
  base: Date,
  businessDays: number,
  timeZone = TIME_ZONE
): Ymd {
  let current = getYmdInTz(base, timeZone);
  let added = 0;
  while (added < businessDays) {
    current = addDays(current, 1);
    const weekday = getWeekday(current);
    if (weekday === 0 || weekday === 6) continue; // Sun(0), Sat(6)
    added += 1;
  }
  return current;
}

export function formatYmd(ymd: Ymd, timeZone = TIME_ZONE): string {
  const date = toDateFromYmd(ymd);
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatYmdISO(ymd: Ymd): string {
  const m = String(ymd.month).padStart(2, "0");
  const d = String(ymd.day).padStart(2, "0");
  return `${ymd.year}-${m}-${d}`;
}
