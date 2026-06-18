import type { ProcessedRate } from '../types';

interface Props {
  latest: ProcessedRate;
  count: number;
}

function Card({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        accent
          ? 'border-[var(--accent-border)] bg-[var(--accent-bg)]'
          : 'border-[var(--border)] bg-[var(--bg)]'
      }`}
    >
      <p className="text-xs text-[var(--text)] uppercase tracking-wide mb-2">{label}</p>
      <p className="text-2xl font-semibold text-[var(--text-h)] tabular-nums">{value}</p>
      {sub && <p className="text-xs text-[var(--text)] mt-1">{sub}</p>}
    </div>
  );
}

export function MetricCards({ latest, count }: Props) {
  const spread = latest.divisaVenta - latest.divisaCompra;
  const fecha = new Date(latest.fecha).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

  const fmt = (n: number) =>
    n.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div>
      <p className="text-xs text-[var(--text)] mb-3">
        Último registro: <span className="font-medium text-[var(--text-h)]">{fecha}</span>
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card label="Divisa Venta" value={`$${fmt(latest.divisaVenta)}`} accent />
        <Card label="Divisa Compra" value={`$${fmt(latest.divisaCompra)}`} />
        <Card label="Spread" value={`$${fmt(spread)}`} sub="Venta − Compra" />
        <Card label="Registros" value={String(count)} sub="en el período" />
      </div>
    </div>
  );
}
