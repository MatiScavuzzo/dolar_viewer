export interface SupabaseRate {
  fecha: string;
  compra: number;
  venta: number;
  tipo_moneda: "divisa" | "billete";
  created_at: string;
}

export interface ProcessedRate {
  fecha: string;
  fechaLabel: string;
  billeteCompra: number | null;
  billeteVenta: number | null;
  divisaCompra: number | null;
  divisaVenta: number | null;
  variation: number | null;
  variationBillete: number | null;
  updatedAt: string;
}

export type DateMode = "range" | "single";
