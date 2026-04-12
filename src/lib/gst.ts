import type { GstType } from '../types/quotation';

export interface GstBreakdown {
  taxableAmount: number;
  gstRate: number;
  gstType: GstType;
  cgst: number;
  sgst: number;
  igst: number;
  totalGst: number;
  grandTotal: number;
}

export function calculateGst(taxableAmount: number, gstRate: number, gstType: GstType): GstBreakdown {
  const totalGst = taxableAmount * gstRate / 100;
  const half = totalGst / 2;
  return {
    taxableAmount,
    gstRate,
    gstType,
    cgst: gstType === 'split' ? half : 0,
    sgst: gstType === 'split' ? half : 0,
    igst: gstType === 'igst' ? totalGst : 0,
    totalGst,
    grandTotal: taxableAmount + totalGst,
  };
}
