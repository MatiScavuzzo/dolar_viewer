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
  billeteCompra: number;
  billeteVenta: number;
  divisaCompra: number;
  divisaVenta: number;
  variation: number | null;
  variationBillete: number | null;
  updatedAt: string;
}

export type DateMode = "range" | "single";
