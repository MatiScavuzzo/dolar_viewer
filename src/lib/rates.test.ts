import { describe, expect, it } from "bun:test";
import { formatMoney, shiftDays, todayInArgentina } from "./format";
import { processRates } from "./rates";
import type { SupabaseRate } from "../types";

const rate = (
  fecha: string,
  tipo_moneda: SupabaseRate["tipo_moneda"],
  venta: number,
): SupabaseRate => ({ fecha, tipo_moneda, compra: venta - 10, venta });

describe("processRates", () => {
  it("usa los días anteriores al rango solo como base de la variación", () => {
    const result = processRates(
      [rate("2026-10-29", "divisa", 1000), rate("2026-10-30", "divisa", 1005)],
      "2026-10-30",
    );
    expect(result.map((r) => r.fecha)).toEqual(["2026-10-30"]);
    expect(result[0].variation).toBe(5);
  });

  it("compara contra la última cotización disponible de cada tipo", () => {
    const result = processRates(
      [
        rate("2026-10-28", "billete", 1000),
        rate("2026-10-29", "divisa", 900),
        rate("2026-10-30", "billete", 1020),
      ],
      "2026-10-28",
    );
    expect(result[2].variationBillete).toBe(20);
    expect(result[2].divisaVenta).toBeNull();
    expect(result[2].variation).toBeNull();
  });
});

describe("formato", () => {
  it("muestra S/C sin signo de pesos cuando no hay cotización", () => {
    expect(formatMoney(null)).toBe("S/C");
  });

  it("calcula la fecha en hora argentina", () => {
    // 01:00 UTC del 31 todavía es 22:00 del 30 en Argentina.
    expect(todayInArgentina(new Date("2026-10-31T01:00:00Z"))).toBe(
      "2026-10-30",
    );
  });

  it("resta días cruzando el mes", () => {
    expect(shiftDays("2026-11-02", -14)).toBe("2026-10-19");
  });
});
