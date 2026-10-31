import { Variation } from "@/components/Variation";
import { formatLongDate, formatMoney } from "@/lib/format";
import type { ProcessedRate } from "@/types";

function Card({
  label,
  value,
  variation,
}: {
  label: string;
  value: number | null;
  variation?: number | null;
}) {
  return (
    <div className="rounded-xl border border-(--border) p-4">
      <p className="text-sm mb-2">{label}</p>
      <p className="figure text-xl sm:text-3xl text-(--text-h)">
        {formatMoney(value)}
      </p>
      {variation !== undefined && variation !== null && (
        <p className="text-sm mt-1">
          <Variation value={variation} /> respecto de la cotización anterior
        </p>
      )}
    </div>
  );
}

export function MetricCards({ latest }: { latest: ProcessedRate }) {
  return (
    <section aria-label="Última cotización" className="flex flex-col gap-3">
      <p className="text-sm">
        Cotización del{" "}
        <span className="font-medium text-(--text-h)">
          {formatLongDate(latest.fecha)}
        </span>
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card
          label="Divisa venta"
          value={latest.divisaVenta}
          variation={latest.variation}
        />
        <Card label="Divisa compra" value={latest.divisaCompra} />
        <Card
          label="Billete venta"
          value={latest.billeteVenta}
          variation={latest.variationBillete}
        />
        <Card label="Billete compra" value={latest.billeteCompra} />
      </div>
    </section>
  );
}
