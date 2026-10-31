import { Dashboard } from "@/components/Dashboard";
import { shiftDays, todayInArgentina } from "@/lib/format";
import { fetchRates } from "@/lib/rates";
import type { ProcessedRate } from "@/types";

// El scraper corre tres veces por día: alcanza con regenerar la página cada hora.
export const revalidate = 3600;

const DEFAULT_RANGE_DAYS = 14;

export default async function Page() {
  const today = todayInArgentina();
  const from = shiftDays(today, -DEFAULT_RANGE_DAYS);

  let initialData: ProcessedRate[] = [];
  let initialError: string | null = null;
  try {
    initialData = await fetchRates(from, today);
  } catch (err) {
    console.error("No se pudieron cargar las cotizaciones", err);
    initialError = "No pudimos cargar las cotizaciones. Probá consultar de nuevo.";
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-(--border) py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3">
            <svg
              aria-hidden="true"
              viewBox="0 0 64 64"
              className="size-12 shrink-0"
            >
              <rect x="2" y="2" width="60" height="60" rx="15" fill="#1F4FD1" />
              <path
                d="M43 22c-2-4-6-6-11-6-6 0-11 3-11 8.500 0 11 22 6 22 16.500 0 5-5 8-11 8-5 0-9-2-11-6M32 9v46"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="5.500"
                strokeLinecap="round"
              />
            </svg>
            <div>
              <h1>Dólar BNA</h1>
              <p className="mt-1 text-sm">
                Cotización de divisa y billete del Banco de la Nación Argentina
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full max-w-6xl mx-auto px-4 py-6 space-y-5 flex-1">
        <Dashboard
          today={today}
          defaultFrom={from}
          initialData={initialData}
          initialError={initialError}
        />
      </main>

      <footer className="border-t border-(--border) py-6 text-sm">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-between gap-x-8 gap-y-3">
          <p className="max-w-2xl">
            Datos publicados por el{" "}
            <a href="https://www.bna.com.ar/Personas">
              Banco de la Nación Argentina
            </a>
            , relevados de lunes a viernes. Sitio independiente, sin vínculo con
            el banco. S/C significa sin cotización.
          </p>
          <p className="flex flex-wrap gap-x-5 gap-y-1">
            <a href="https://github.com/MatiScavuzzo/dolar_viewer">
              Código en GitHub
            </a>
            <span>
              Desarrollado por{" "}
              <a href="https://www.callvutech.com.ar">CallvúTech</a>
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}
