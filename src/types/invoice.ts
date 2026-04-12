import type { GstType } from './quotation';

export type PaymentTerms = 'advance' | 'net15' | 'net30' | 'net45' | 'net60';

export interface InvoiceLineItem {
  id: string;
  description: string;
  hsn: string;
  qty: number;
  unit: string;
  rate: number;
  amount: number;
}

export interface BankDetails {
  bankName: string;
  accountNo: string;
  branchIfsc: string;
}

export interface InvoiceMeta {
  invoiceNo: string;
  invoiceDate: string;
  buyerOrderNo: string;
  buyerOrderDate: string;
  deliveryNote: string;
  deliveryNoteDate: string;
  supplierRef: string;
  otherRef: string;
  despatchDocNo: string;
  despatchThrough: string;
  destination: string;
  termsOfDelivery: string;
  paymentTerms: string;
}

export interface SellerInfo {
  companyName: string;
  address: string;
  gstin: string;
  stateName: string;
  stateCode: string;
  pan: string;
}

export interface BuyerInfo {
  companyName: string;
  address: string;
  gstin: string;
  stateName: string;
  stateCode: string;
}

export interface InvoiceState {
  step: number;
  seller: SellerInfo;
  buyer: BuyerInfo;
  meta: InvoiceMeta;
  lineItems: InvoiceLineItem[];
  gstRate: number;
  gstType: GstType;
  bankDetails: BankDetails;
  declaration: string;
}

export const PAYMENT_TERMS_LABELS: Record<PaymentTerms, string> = {
  advance: '100% Advance',
  net15: 'Net 15 days',
  net30: 'Net 30 days',
  net45: 'Net 45 days',
  net60: 'Net 60 days',
};

export const DEFAULT_SELLER: SellerInfo = {
  companyName: 'HNV TECHNO SOLUTIONS PRIVATE LIMITED',
  address: 'FLAT NO 301, AADITYA SUNRISE APARTMENT, C WING\nAmbarnath, Thane, Maharashtra, 421506',
  gstin: '27AAICH4615H1ZK',
  stateName: 'Maharashtra',
  stateCode: '27',
  pan: 'AAICH4615H',
};

export const DEFAULT_BANK: BankDetails = {
  bankName: 'Federal Bank',
  accountNo: '16810200007510',
  branchIfsc: 'Mahape & FDRL0001681',
};

export const DEFAULT_DECLARATION = 'We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.';
