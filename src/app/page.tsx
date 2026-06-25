"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { DateControls } from "@/components/DateControls";
import { MetricCards } from "@/components/MetricCards";
import { RateTable } from "@/components/RateTable";
import type { DateMode, ProcessedRate, SupabaseRate } from "@/types";
import { supabase } from "@/lib/supabase";

const RateChart = dynamic(
  () =>
    import("@/components/RateChart").then((mod) => ({
      default: mod.RateChart,
    })),
  { ssr: false },
);

function toYMD(date: Date): string {
  return date.toISOString().split("T")[0];
}

function defaultDates() {
  const to = new Date();
  const from = new Date(to);
  from.setDate(to.getDate() - 14);
  return { from: toYMD(from), to: toYMD(to) };
}

function processData(raw: SupabaseRate[]): ProcessedRate[] {
  const fechas = [...new Set(raw.map((r) => r.fecha))].sort();

  return fechas.map((fecha, i) => {
    const divisa = raw.find(
      (r) => r.fecha === fecha && r.tipo_moneda === "divisa",
    );
    const billete = raw.find(
      (r) => r.fecha === fecha && r.tipo_moneda === "billete",
    );
    const prevFecha = fechas[i - 1];
    const prevDivisa = prevFecha
      ? raw.find((r) => r.fecha === prevFecha && r.tipo_moneda === "divisa")
      : null;
    const prevBillete = prevFecha
      ? raw.find((r) => r.fecha === prevFecha && r.tipo_moneda === "billete")
      : null;

    const [y, m, d] = fecha.split("-");
    return {
      fecha,
      fechaLabel: `${d}/${m}/${y}`,
      billeteCompra: billete?.compra ?? 0,
      billeteVenta: billete?.venta ?? 0,
      divisaCompra: divisa?.compra ?? 0,
      divisaVenta: divisa?.venta ?? 0,
      variation: prevDivisa ? (divisa?.venta ?? 0) - prevDivisa.venta : null,
      variationBillete: prevBillete
        ? (billete?.venta ?? 0) - prevBillete.venta
        : null,
      updatedAt: divisa?.created_at ?? billete?.created_at ?? "",
    };
  });
}

export default function Page() {
  const { from: defaultFrom, to: defaultTo } = defaultDates();

  const [mode, setMode] = useState<DateMode>("range");
  const [fromDate, setFromDate] = useState(defaultFrom);
  const [toDate, setToDate] = useState(defaultTo);
  const [singleDate, setSingleDate] = useState(defaultTo);

  const [data, setData] = useState<ProcessedRate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    const from = mode === "single" ? singleDate : fromDate;
    const to = mode === "single" ? singleDate : toDate;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("cotizaciones_bna")
        .select("fecha, compra, venta, tipo_moneda, created_at")
        .gte("fecha", from)
        .lte("fecha", to)
        .order("fecha", { ascending: true });
      console.log({ data, error, from, to });
      setData(processData(data ?? []));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [mode, fromDate, toDate, singleDate]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const latest = data[data.length - 1] ?? null;

  return (
    <div className="min-h-screen bg-(--bg) text-(--text)">
      <header className="border-b border-(--border) px-6 py-5">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-semibold text-(--text-h) m-0">
            Dólar BNA
          </h1>
          <p className="text-sm text-(--text) mt-1 mb-0">
            Cotizaciones del Banco Nación Argentina
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-5">
        <DateControls
          mode={mode}
          fromDate={fromDate}
          toDate={toDate}
          singleDate={singleDate}
          onModeChange={setMode}
          onFromChange={setFromDate}
          onToChange={setToDate}
          onSingleChange={setSingleDate}
          onSearch={fetchData}
          loading={loading}
        />

        {loading && (
          <div className="flex items-center justify-center py-16 gap-3 text-(--text)">
            <svg
              className="animate-spin h-5 w-5 text-(--accent)"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            <span className="text-sm">Consultando cotizaciones...</span>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-4 py-4 text-sm text-red-700 dark:text-red-400 flex items-start gap-2">
            <span className="mt-0.5">⚠</span>
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && latest && (
          <MetricCards latest={latest} count={data.length} />
        )}

        {!loading && !error && data.length > 1 && <RateChart data={data} />}

        {!loading && !error && data.length > 0 && <RateTable data={data} />}

        {!loading && !error && data.length === 0 && (
          <div className="text-center py-16 text-(--text) text-sm">
            No hay datos para el período seleccionado.
          </div>
        )}
      </main>
    </div>
  );
}
