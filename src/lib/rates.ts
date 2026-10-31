import { formatShortDate } from "@/lib/format";
import { supabase } from "@/lib/supabase";
import type { ProcessedRate, SupabaseRate } from "@/types";

const TABLE = "cotizaciones_bna";
const COLUMNS = "fecha, compra, venta, tipo_moneda";
// PostgREST devuelve como máximo 1000 filas por pedido: los rangos largos se piden por páginas.
const PAGE_SIZE = 1000;

/**
 * Agrupa las filas por fecha y calcula la variación contra la última cotización
 * disponible de cada tipo. Las filas anteriores a `from` solo sirven de base para
 * esa variación y no aparecen en el resultado.
 */
export function processRates(
  raw: SupabaseRate[],
  from: string,
): ProcessedRate[] {
  const byDate = new Map<
    string,
    { divisa?: SupabaseRate; billete?: SupabaseRate }
  >();
  for (const rate of raw) {
    byDate.set(rate.fecha, {
      ...byDate.get(rate.fecha),
      [rate.tipo_moneda]: rate,
    });
  }

  let lastDivisa: number | null = null;
  let lastBillete: number | null = null;
  const result: ProcessedRate[] = [];

  for (const fecha of [...byDate.keys()].sort()) {
    const { divisa, billete } = byDate.get(fecha)!;
    if (fecha >= from) {
      result.push({
        fecha,
        fechaLabel: formatShortDate(fecha),
        billeteCompra: billete?.compra ?? null,
        billeteVenta: billete?.venta ?? null,
        divisaCompra: divisa?.compra ?? null,
        divisaVenta: divisa?.venta ?? null,
        variation:
          divisa && lastDivisa !== null ? divisa.venta - lastDivisa : null,
        variationBillete:
          billete && lastBillete !== null ? billete.venta - lastBillete : null,
      });
    }
    lastDivisa = divisa?.venta ?? lastDivisa;
    lastBillete = billete?.venta ?? lastBillete;
  }

  return result;
}

export async function fetchRates(
  from: string,
  to: string,
): Promise<ProcessedRate[]> {
  const previous = await supabase
    .from(TABLE)
    .select(COLUMNS)
    .lt("fecha", from)
    .order("fecha", { ascending: false })
    .limit(4);
  if (previous.error) throw new Error(previous.error.message);

  const rows: SupabaseRate[] = [...(previous.data as SupabaseRate[])];

  for (let start = 0; ; start += PAGE_SIZE) {
    const page = await supabase
      .from(TABLE)
      .select(COLUMNS)
      .gte("fecha", from)
      .lte("fecha", to)
      .order("fecha", { ascending: true })
      .order("tipo_moneda", { ascending: true })
      .range(start, start + PAGE_SIZE - 1);
    if (page.error) throw new Error(page.error.message);

    rows.push(...(page.data as SupabaseRate[]));
    if (page.data.length < PAGE_SIZE) break;
  }

  return processRates(rows, from);
}
