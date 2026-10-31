const TIME_ZONE = "America/Argentina/Buenos_Aires";

/** Primer día con cotizaciones cargadas en la base. */
export const MIN_DATE = "2020-01-02";

const amount = new Intl.NumberFormat("es-AR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatMoney(value: number | null): string {
  return value === null ? "S/C" : `$${amount.format(value)}`;
}

export function formatVariation(value: number): string {
  return `${value > 0 ? "+" : ""}${amount.format(value)}`;
}

/** Fecha de hoy (AAAA-MM-DD) en Argentina, sin importar dónde corra el código. */
export function todayInArgentina(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(now);
}

export function shiftDays(ymd: string, days: number): string {
  const date = new Date(`${ymd}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function formatShortDate(ymd: string): string {
  const [y, m, d] = ymd.split("-");
  return `${d}/${m}/${y}`;
}

export function formatLongDate(ymd: string): string {
  return new Date(`${ymd}T12:00:00Z`).toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
