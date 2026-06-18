import type { DateMode } from '../types';

interface Props {
  mode: DateMode;
  fromDate: string;
  toDate: string;
  singleDate: string;
  onModeChange: (mode: DateMode) => void;
  onFromChange: (date: string) => void;
  onToChange: (date: string) => void;
  onSingleChange: (date: string) => void;
  onSearch: () => void;
  loading: boolean;
}

function DateInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-[var(--text)] font-medium uppercase tracking-wide">
        {label}
      </label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--bg)] text-[var(--text-h)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
      />
    </div>
  );
}

export function DateControls({
  mode,
  fromDate,
  toDate,
  singleDate,
  onModeChange,
  onFromChange,
  onToChange,
  onSingleChange,
  onSearch,
  loading,
}: Props) {
  return (
    <div className="rounded-xl border border-[var(--border)] p-4 flex flex-wrap items-end gap-4">
      <div className="flex rounded-lg border border-[var(--border)] overflow-hidden text-sm shrink-0">
        {(['range', 'single'] as DateMode[]).map((m) => (
          <button
            key={m}
            onClick={() => onModeChange(m)}
            className={`px-4 py-2 transition-colors capitalize ${
              mode === m
                ? 'bg-[var(--accent)] text-white'
                : 'text-[var(--text)] hover:bg-[var(--accent-bg)]'
            }`}
          >
            {m === 'range' ? 'Rango' : 'Fecha única'}
          </button>
        ))}
      </div>

      {mode === 'range' ? (
        <>
          <DateInput label="Desde" value={fromDate} onChange={onFromChange} />
          <DateInput label="Hasta" value={toDate} onChange={onToChange} />
        </>
      ) : (
        <DateInput label="Fecha" value={singleDate} onChange={onSingleChange} />
      )}

      <button
        onClick={onSearch}
        disabled={loading}
        className="px-5 py-2 bg-[var(--accent)] text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity shrink-0"
      >
        {loading ? 'Cargando...' : 'Consultar'}
      </button>
    </div>
  );
}
