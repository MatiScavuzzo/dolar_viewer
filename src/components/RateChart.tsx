"use client";

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
import type { ProcessedRate } from "@/types";
import { useState } from "react";

interface Props {
  data: ProcessedRate[];
}

export function RateChart({ data }: Props) {
  const [viewBillete, setViewBillete] = useState<boolean>(false);
  const [viewDivisa, setViewDivisa] = useState<boolean>(true);
  const [viewTodos, setViewTodos] = useState<boolean>(false);

  const handleViewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "billete") {
      setViewBillete(true);
      setViewDivisa(false);
      setViewTodos(false);
    } else if (e.target.name === "divisa") {
      setViewDivisa(true);
      setViewBillete(false);
      setViewTodos(false);
    } else if (e.target.name === "todos") {
      setViewBillete(true);
      setViewDivisa(true);
      setViewTodos(true);
    }
  };

  const chartData = data.map((d) => ({
    fecha: d.fechaLabel,
    "Divisa Venta": d.divisaVenta,
    "Divisa Compra": d.divisaCompra,
    "Billete Venta": d.billeteVenta,
    "Billete Compra": d.billeteCompra,
  }));

  const fmt = (val: number | null) =>
    val === null
      ? "S/C"
      : `$${val.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="rounded-xl border border-(--border) p-4">
      <h2 className="text-sm font-semibold text-(--text-h) mb-4 uppercase tracking-wide">
        Evolución del tipo de cambio
      </h2>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart
          data={chartData}
          margin={{ top: 4, right: 8, left: 8, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="fecha"
            tick={{ fontSize: 11, fill: "var(--text)" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--text)" }}
            tickLine={false}
            axisLine={false}
            domain={["auto", "auto"]}
            tickFormatter={(v) => `$${(v as number).toLocaleString("es-AR")}`}
            width={80}
          />
          <Tooltip
            formatter={(val) => fmt(val as number)}
            contentStyle={{
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              fontSize: "13px",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          {viewDivisa && (
            <Line
              type="monotone"
              dataKey="Divisa Venta"
              stroke="var(--accent)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              connectNulls={false}
            />
          )}
          {viewDivisa && (
            <Line
              type="monotone"
              dataKey="Divisa Compra"
              stroke="#60a5fa"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              connectNulls={false}
            />
          )}
          {viewBillete && (
            <Line
              type="monotone"
              dataKey="Billete Venta"
              stroke="#34d399"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              connectNulls={false}
            />
          )}
          {viewBillete && (
            <Line
              type="monotone"
              dataKey="Billete Compra"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              connectNulls={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-2">
        <input
          id="billete"
          type="radio"
          onChange={handleViewChange}
          name="billete"
          checked={viewTodos ? false : viewBillete}
        />
        <label htmlFor="billete">Billete</label>
        <input
          id="divisa"
          type="radio"
          onChange={handleViewChange}
          name="divisa"
          checked={viewTodos ? false : viewDivisa}
        />
        <label htmlFor="divisa">Divisa</label>
        <input
          id="todos"
          type="radio"
          onChange={handleViewChange}
          name="todos"
          checked={viewTodos}
        />
        <label htmlFor="todos">Todos</label>
      </div>
    </div>
  );
}
