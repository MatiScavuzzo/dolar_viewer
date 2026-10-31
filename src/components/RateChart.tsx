"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatMoney } from "@/lib/format";
import type { ProcessedRate } from "@/types";

type View = "divisa" | "billete" | "todos";

const VIEWS: { value: View; label: string }[] = [
  { value: "divisa", label: "Divisa" },
  { value: "billete", label: "Billete" },
  { value: "todos", label: "Todos" },
];

// El color identifica el tipo de dólar y el trazo, la punta: venta continua, compra punteada.
const SERIES = [
  { key: "divisaVenta", name: "Divisa venta", type: "divisa", color: "var(--series-divisa)", dash: undefined },
  { key: "divisaCompra", name: "Divisa compra", type: "divisa", color: "var(--series-divisa)", dash: "5 4" },
  { key: "billeteVenta", name: "Billete venta", type: "billete", color: "var(--series-billete)", dash: undefined },
  { key: "billeteCompra", name: "Billete compra", type: "billete", color: "var(--series-billete)", dash: "5 4" },
] as const;

const TICK = { fontSize: 12, fill: "var(--text)" };
// Con más puntos que esto los marcadores tapan la línea.
const MAX_POINTS_WITH_DOTS = 31;

export function RateChart({ data }: { data: ProcessedRate[] }) {
  const [view, setView] = useState<View>("divisa");
  const showDots = data.length <= MAX_POINTS_WITH_DOTS;

  return (
    <section className="rounded-xl border border-(--border) p-4">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 mb-4">
        <h2>Evolución del tipo de cambio</h2>
        <fieldset className="flex items-center gap-4 text-sm">
          <legend className="sr-only">Cotizaciones a mostrar</legend>
          {VIEWS.map(({ value, label }) => (
            <label key={value} className="flex items-center gap-1.5">
              <input
                type="radio"
                name="vista-grafico"
                value={value}
                checked={view === value}
                onChange={() => setView(value)}
                className="accent-(--accent)"
              />
              {label}
            </label>
          ))}
        </fieldset>
      </div>
      <ResponsiveContainer width="100%" height={288}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis
            dataKey="fechaLabel"
            tick={TICK}
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
            minTickGap={32}
          />
          <YAxis
            tick={TICK}
            tickLine={false}
            axisLine={false}
            domain={["auto", "auto"]}
            tickFormatter={(v: number) => `$${v.toLocaleString("es-AR")}`}
            width={72}
          />
          <Tooltip
            formatter={(val) => formatMoney(typeof val === "number" ? val : null)}
            contentStyle={{
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              fontSize: "13px",
              color: "var(--text-h)",
            }}
            itemStyle={{ color: "var(--text-h)" }}
            labelStyle={{ color: "var(--text-h)", fontWeight: 600 }}
          />
          <Legend
            itemSorter={null}
            wrapperStyle={{ fontSize: "13px" }}
            formatter={(value) => (
              <span style={{ color: "var(--text)" }}>{value}</span>
            )}
          />
          {SERIES.filter((s) => view === "todos" || view === s.type).map((s) => (
            <Line
              key={s.key}
              type="linear"
              dataKey={s.key}
              name={s.name}
              legendType="plainline"
              stroke={s.color}
              strokeWidth={2}
              strokeDasharray={s.dash}
              dot={showDots ? { r: 3, fill: s.color, strokeDasharray: "" } : false}
              activeDot={{ r: 5 }}
              connectNulls={false}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
}
