export const BUSINESS_TIME_ZONE = "Asia/Kolkata";
export const BUSINESS_TIME_ZONE_LABEL = "India Standard Time (IST)";

export function getCurrentTimestamp() {
  return Date.now();
}

const businessDateTimeFormatter = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: BUSINESS_TIME_ZONE,
});

export function formatBusinessDateTime(value: string | Date) {
  return businessDateTimeFormatter.format(new Date(value));
}

export function formatBusinessDate(value: string | Date) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeZone: BUSINESS_TIME_ZONE,
  }).format(new Date(value));
}

export function toBusinessDateTimeInput(value: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: BUSINESS_TIME_ZONE,
  }).formatToParts(new Date(value));
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((candidate) => candidate.type === type)?.value ?? "";

  return {
    date: `${part("year")}-${part("month")}-${part("day")}`,
    time: `${part("hour")}:${part("minute")}`,
  };
}

export function businessDateTimeToIso(date: string, time: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) {
    return null;
  }

  const parsed = new Date(`${date}T${time}:00+05:30`);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

export function getBusinessDayRange(value = new Date()) {
  const { date } = toBusinessDateTimeInput(value.toISOString());
  const start = businessDateTimeToIso(date, "00:00");
  const nextDate = new Date(`${date}T00:00:00+05:30`);
  nextDate.setUTCDate(nextDate.getUTCDate() + 1);

  return {
    date,
    start: start ?? value.toISOString(),
    end: nextDate.toISOString(),
  };
}
