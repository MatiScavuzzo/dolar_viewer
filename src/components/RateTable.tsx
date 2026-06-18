import type { ProcessedRate } from '../types';

interface Props {
  data: ProcessedRate[];
}

function Variation({ value }: { value: number | null }) {
  if (value === null) return <span className="text-[var(--text)]">—</span>;

  const color =
    value === 0
      ? 'text-[var(--text)]'
      : value > 0
        ? 'text-green-600 dark:text-green-400'
        : 'text-red-500 dark:text-red-400';

  return (
    <span className={`font-medium tabular-nums ${color}`}>
      {value > 0 ? '+' : ''}
      {value.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </span>
  );
}

export function RateTable({ data }: Props) {
  const rows = [...data].reverse();

  const fmt = (n: number) =>
    n.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="rounded-xl border border-[var(--border)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-[var(--text)] text-xs uppercase tracking-wide">
              <th className="text-left px-4 py-3 font-medium bg-[var(--code-bg)]">Fecha</th>
              <th className="text-right px-4 py-3 font-medium bg-[var(--code-bg)]">Divisa Venta</th>
              <th className="text-right px-4 py-3 font-medium bg-[var(--code-bg)]">Divisa Compra</th>
              <th className="text-right px-4 py-3 font-medium bg-[var(--code-bg)]">Billete Venta</th>
              <th className="text-right px-4 py-3 font-medium bg-[var(--code-bg)]">Billete Compra</th>
              <th className="text-right px-4 py-3 font-medium bg-[var(--code-bg)]">Variación</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.fecha}
                className={`border-b border-[var(--border)] last:border-0 transition-colors hover:bg-[var(--accent-bg)] ${
                  i === 0 ? 'bg-[var(--accent-bg)]' : ''
                }`}
              >
                <td className="px-4 py-3 font-medium text-[var(--text-h)] tabular-nums whitespace-nowrap">
                  {row.fechaLabel}
                </td>
                <td className="px-4 py-3 text-right text-[var(--text-h)] font-semibold tabular-nums">
                  ${fmt(row.divisaVenta)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">${fmt(row.divisaCompra)}</td>
                <td className="px-4 py-3 text-right tabular-nums">${fmt(row.billeteVenta)}</td>
                <td className="px-4 py-3 text-right tabular-nums">${fmt(row.billeteCompra)}</td>
                <td className="px-4 py-3 text-right">
                  <Variation value={row.variation} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
