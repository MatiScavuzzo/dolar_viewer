export interface RateEntry {
  fecha: string;
  billeteCompra: string;
  billeteVenta: string;
  divisaCompra: string;
  divisaVenta: string;
}

export interface ApiResponse {
  isSuccess: boolean;
  data: RateEntry[];
}

export interface ProcessedRate {
  fecha: string;
  fechaLabel: string;
  billeteCompra: number;
  billeteVenta: number;
  divisaCompra: number;
  divisaVenta: number;
  variation: number | null;
}

export type DateMode = 'range' | 'single';
