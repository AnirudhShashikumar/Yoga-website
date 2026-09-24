"use client";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "numeric",
  minute: "2-digit",
  timeZoneName: "short",
});

export function SessionTime({
  startsAt,
  endsAt,
}: {
  startsAt: string;
  endsAt: string;
}) {
  const starts = new Date(startsAt);
  const ends = new Date(endsAt);

  return (
    <span suppressHydrationWarning>
      <time dateTime={startsAt}>{dateFormatter.format(starts)}</time>
      <span aria-hidden="true"> · </span>
      <time dateTime={startsAt}>{timeFormatter.format(starts)}</time>
      <span aria-hidden="true">–</span>
      <time dateTime={endsAt}>{timeFormatter.format(ends)}</time>
    </span>
  );
}
