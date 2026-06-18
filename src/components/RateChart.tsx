import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { ProcessedRate } from '../types';

interface Props {
  data: ProcessedRate[];
}

export function RateChart({ data }: Props) {
  const chartData = data.map((d) => ({
    fecha: d.fechaLabel,
    'Divisa Venta': d.divisaVenta,
    'Divisa Compra': d.divisaCompra,
  }));

  const fmt = (val: number) =>
    `$${val.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="rounded-xl border border-[var(--border)] p-4">
      <h2 className="text-sm font-semibold text-[var(--text-h)] mb-4 uppercase tracking-wide">
        Evolución del tipo de cambio
      </h2>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={chartData} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="fecha"
            tick={{ fontSize: 11, fill: 'var(--text)' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--text)' }}
            tickLine={false}
            axisLine={false}
            domain={['auto', 'auto']}
            tickFormatter={(v) => `$${(v as number).toLocaleString('es-AR')}`}
            width={80}
          />
          <Tooltip
            formatter={(val) => fmt(val as number)}
            contentStyle={{
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '13px',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Line
            type="monotone"
            dataKey="Divisa Venta"
            stroke="var(--accent)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="Divisa Compra"
            stroke="#60a5fa"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
