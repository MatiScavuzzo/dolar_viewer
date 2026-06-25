"use client";

import type { ProcessedRate } from "@/types";

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
          ? "border-(--accent-border) bg-(--accent-bg)"
          : "border-(--border) bg-(--bg)"
      }`}
    >
      <p className="text-xs text-(--text) uppercase tracking-wide mb-2">
        {label}
      </p>
      <p className="text-2xl font-semibold text-(--text-h) tabular-nums">
        {value}
      </p>
      {sub && <p className="text-xs text-(--text) mt-1">{sub}</p>}
    </div>
  );
}

export function MetricCards({ latest }: Props) {
  const updatedAt = new Date(latest.updatedAt).toLocaleString("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Argentina/Buenos_Aires",
  });

  const fmt = (n: number) =>
    n.toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-(--text)">
        Última actualización:{" "}
        <span className="font-medium text-(--text-h)">{updatedAt}</span>
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card label="Divisa Venta" value={`$${fmt(latest.divisaVenta)}`} />
        <Card label="Divisa Compra" value={`$${fmt(latest.divisaCompra)}`} />
        <Card label="Billete Venta" value={`$${fmt(latest.billeteVenta)}`} />
        <Card label="Billete Compra" value={`$${fmt(latest.billeteCompra)}`} />
      </div>
    </div>
  );
}
