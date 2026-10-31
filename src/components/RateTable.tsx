import { Variation } from "@/components/Variation";
import { formatMoney } from "@/lib/format";
import type { ProcessedRate } from "@/types";

const COLUMNS = [
  "Divisa venta",
  "Divisa compra",
  "Variación divisa",
  "Billete venta",
  "Billete compra",
  "Variación billete",
];

const CELL = "px-4 py-3 text-right tabular-nums whitespace-nowrap";

export function RateTable({ data }: { data: ProcessedRate[] }) {
  const rows = [...data].reverse();

  return (
    <div
      tabIndex={0}
      role="region"
      aria-label="Tabla de cotizaciones por fecha"
      className="rounded-xl border border-(--border) overflow-auto max-h-[32rem]"
    >
      <table className="w-full text-sm">
        <caption className="sr-only">
          Cotizaciones por fecha, de la más reciente a la más antigua
        </caption>
        <thead className="sticky top-0 bg-(--surface)">
          <tr className="border-b border-(--border)">
            <th scope="col" className="text-left px-4 py-3 font-medium">
              Fecha
            </th>
            {COLUMNS.map((column) => (
              <th
                key={column}
                scope="col"
                className="text-right px-4 py-3 font-medium whitespace-nowrap"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.fecha}
              className="border-b border-(--border) last:border-0 text-(--text-h) hover:bg-(--accent-bg)"
            >
              <th
                scope="row"
                className="px-4 py-3 text-left font-medium tabular-nums whitespace-nowrap"
              >
                {row.fechaLabel}
              </th>
              <td className={CELL}>{formatMoney(row.divisaVenta)}</td>
              <td className={CELL}>{formatMoney(row.divisaCompra)}</td>
              <td className={CELL}>
                <Variation value={row.variation} />
              </td>
              <td className={CELL}>{formatMoney(row.billeteVenta)}</td>
              <td className={CELL}>{formatMoney(row.billeteCompra)}</td>
              <td className={CELL}>
                <Variation value={row.variationBillete} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
