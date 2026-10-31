import { formatVariation } from "@/lib/format";

export function Variation({ value }: { value: number | null }) {
  if (value === null) return <span>—</span>;

  const color =
    value === 0 ? "" : value > 0 ? "text-(--up)" : "text-(--down)";

  return (
    <span className={`font-medium tabular-nums ${color}`}>
      {formatVariation(value)}
    </span>
  );
}
