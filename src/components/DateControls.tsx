import type { FormEvent } from "react";
import { MIN_DATE } from "@/lib/format";
import type { DateMode } from "@/types";

interface Props {
  mode: DateMode;
  fromDate: string;
  toDate: string;
  singleDate: string;
  maxDate: string;
  onModeChange: (mode: DateMode) => void;
  onFromChange: (date: string) => void;
  onToChange: (date: string) => void;
  onSingleChange: (date: string) => void;
  onSubmit: (event: FormEvent) => void;
  loading: boolean;
}

const MODES: { value: DateMode; label: string }[] = [
  { value: "range", label: "Rango" },
  { value: "single", label: "Fecha única" },
];

function DateInput({
  label,
  value,
  max,
  onChange,
}: {
  label: string;
  value: string;
  max: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm font-medium">
      {label}
      <input
        type="date"
        value={value}
        min={MIN_DATE}
        max={max}
        required
        onChange={(e) => onChange(e.target.value)}
        className="border border-(--field) rounded-lg px-3 py-2 bg-(--bg) font-normal text-(--text-h)"
      />
    </label>
  );
}

export function DateControls({
  mode,
  fromDate,
  toDate,
  singleDate,
  maxDate,
  onModeChange,
  onFromChange,
  onToChange,
  onSingleChange,
  onSubmit,
  loading,
}: Props) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-(--border) p-4 flex flex-wrap items-end gap-4"
    >
      <div
        role="group"
        aria-label="Tipo de consulta"
        className="flex rounded-lg border border-(--field) overflow-hidden text-sm shrink-0"
      >
        {MODES.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            aria-pressed={mode === value}
            onClick={() => onModeChange(value)}
            className={`px-4 py-2 transition-colors ${
              mode === value
                ? "bg-(--accent) text-(--on-accent)"
                : "hover:bg-(--accent-bg)"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "range" ? (
        <>
          <DateInput
            label="Desde"
            value={fromDate}
            max={maxDate}
            onChange={onFromChange}
          />
          <DateInput
            label="Hasta"
            value={toDate}
            max={maxDate}
            onChange={onToChange}
          />
        </>
      ) : (
        <DateInput
          label="Fecha"
          value={singleDate}
          max={maxDate}
          onChange={onSingleChange}
        />
      )}

      <button
        type="submit"
        disabled={loading}
        className="px-5 py-2 bg-(--accent) text-(--on-accent) rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity shrink-0"
      >
        {loading ? "Consultando…" : "Consultar"}
      </button>
    </form>
  );
}
