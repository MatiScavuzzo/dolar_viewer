import { useState, useEffect, useCallback } from 'react';
import { DateControls } from './components/DateControls';
import { MetricCards } from './components/MetricCards';
import { RateChart } from './components/RateChart';
import { RateTable } from './components/RateTable';
import type { ApiResponse, DateMode, ProcessedRate } from './types';

const API_BASE =
  'https://api.errepar.com/syserrepar/apidolar/api/CotizacionesBNAII/byDates';

function toYMD(date: Date): string {
  return date.toISOString().split('T')[0];
}

function defaultDates() {
  const to = new Date();
  const from = new Date(to);
  from.setDate(to.getDate() - 14);
  return { from: toYMD(from), to: toYMD(to) };
}

function processData(raw: ApiResponse['data']): ProcessedRate[] {
  const sorted = [...raw].sort(
    (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime(),
  );

  return sorted.map((entry, i) => {
    const prev = sorted[i - 1];
    const divisaVenta = parseFloat(entry.divisaVenta);
    const prevDivisaVenta = prev ? parseFloat(prev.divisaVenta) : null;

    return {
      fecha: entry.fecha,
      fechaLabel: new Date(entry.fecha).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'UTC',
      }),
      billeteCompra: parseFloat(entry.billeteCompra),
      billeteVenta: parseFloat(entry.billeteVenta),
      divisaCompra: parseFloat(entry.divisaCompra),
      divisaVenta,
      variation: prevDivisaVenta !== null ? divisaVenta - prevDivisaVenta : null,
    };
  });
}

export default function App() {
  const { from: defaultFrom, to: defaultTo } = defaultDates();

  const [mode, setMode] = useState<DateMode>('range');
  const [fromDate, setFromDate] = useState(defaultFrom);
  const [toDate, setToDate] = useState(defaultTo);
  const [singleDate, setSingleDate] = useState(defaultTo);

  const [data, setData] = useState<ProcessedRate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    const from = mode === 'single' ? singleDate : fromDate;
    const to = mode === 'single' ? singleDate : toDate;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${API_BASE}?fechaInicial=${from}&fechaFinal=${to}`,
      );
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      const json: ApiResponse = await res.json();
      if (!json.isSuccess) throw new Error('La API devolvió un error.');
      setData(processData(json.data ?? []));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [mode, fromDate, toDate, singleDate]);

  useEffect(() => {
    fetchData();
  }, []);

  const latest = data[data.length - 1] ?? null;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <header className="border-b border-[var(--border)] px-6 py-5">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-semibold text-[var(--text-h)] m-0">Dólar BNA</h1>
          <p className="text-sm text-[var(--text)] mt-1 mb-0">
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
          <div className="flex items-center justify-center py-16 gap-3 text-[var(--text)]">
            <svg
              className="animate-spin h-5 w-5 text-[var(--accent)]"
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
          <div className="text-center py-16 text-[var(--text)] text-sm">
            No hay datos para el período seleccionado.
          </div>
        )}
      </main>
    </div>
  );
}
