"use client";

import { useState, type FormEvent } from "react";
import dynamic from "next/dynamic";
import { DateControls } from "@/components/DateControls";
import { MetricCards } from "@/components/MetricCards";
import { RateTable } from "@/components/RateTable";
import { fetchRates } from "@/lib/rates";
import type { DateMode, ProcessedRate } from "@/types";

const CHART_HEIGHT = "h-[23rem]";

const RateChart = dynamic(
  () => import("@/components/RateChart").then((mod) => mod.RateChart),
  {
    ssr: false,
    loading: () => (
      <div className={`rounded-xl border border-(--border) ${CHART_HEIGHT}`} />
    ),
  },
);

interface Props {
  today: string;
  defaultFrom: string;
  initialData: ProcessedRate[];
  initialError: string | null;
}

export function Dashboard({
  today,
  defaultFrom,
  initialData,
  initialError,
}: Props) {
  const [mode, setMode] = useState<DateMode>("range");
  const [fromDate, setFromDate] = useState(defaultFrom);
  const [toDate, setToDate] = useState(today);
  const [singleDate, setSingleDate] = useState(today);

  const [data, setData] = useState(initialData);
  const [queriedMode, setQueriedMode] = useState<DateMode>("range");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const from = mode === "single" ? singleDate : fromDate;
    const to = mode === "single" ? singleDate : toDate;

    if (!from || !to) {
      setError("Completá las fechas para consultar.");
      return;
    }
    if (from > to) {
      setError('La fecha "Desde" no puede ser posterior a "Hasta".');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      setData(await fetchRates(from, to));
      setQueriedMode(mode);
    } catch (err) {
      console.error(err);
      setError("No pudimos cargar las cotizaciones. Probá consultar de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const latest = data.at(-1) ?? null;

  return (
    <>
      <DateControls
        mode={mode}
        fromDate={fromDate}
        toDate={toDate}
        singleDate={singleDate}
        maxDate={today}
        onModeChange={setMode}
        onFromChange={setFromDate}
        onToChange={setToDate}
        onSingleChange={setSingleDate}
        onSubmit={handleSubmit}
        loading={loading}
      />

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-(--danger) px-4 py-3 text-sm text-(--danger)"
        >
          {error}
        </p>
      )}

      <div
        aria-busy={loading}
        className={`space-y-5 transition-opacity ${loading ? "opacity-50" : ""}`}
      >
        {latest ? (
          <>
            <MetricCards latest={latest} />
            {data.length > 1 && <RateChart data={data} />}
            <RateTable data={data} />
          </>
        ) : (
          !error && (
            <p className="py-16 text-center text-sm">
              {queriedMode === "single"
                ? "No hay cotización para esa fecha. El banco no publica los fines de semana ni los feriados."
                : "No hay cotizaciones para el período elegido."}
            </p>
          )
        )}
      </div>
    </>
  );
}
