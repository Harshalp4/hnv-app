import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  InvoiceState,
  InvoiceLineItem,
  SellerInfo,
  BuyerInfo,
  InvoiceMeta,
  BankDetails,
} from '../types/invoice';
import type { GstType } from '../types/quotation';
import { DEFAULT_SELLER, DEFAULT_BANK, DEFAULT_DECLARATION } from '../types/invoice';

const today = () => new Date().toISOString().split('T')[0];

function defaultInvoiceNo(): string {
  const now = new Date();
  const y1 = now.getFullYear() % 100;
  const m = now.getMonth() + 1;
  const fy1 = m >= 4 ? y1 : y1 - 1;
  const fy2 = fy1 + 1;
  return `HNV/001/${String(fy1).padStart(2, '0')}-${String(fy2).padStart(2, '0')}`;
}

const initialState: InvoiceState = {
  step: 1,
  seller: { ...DEFAULT_SELLER },
  buyer: {
    companyName: '',
    address: '',
    gstin: '',
    stateName: '',
    stateCode: '',
  },
  meta: {
    invoiceNo: defaultInvoiceNo(),
    invoiceDate: today(),
    buyerOrderNo: '',
    buyerOrderDate: '',
    deliveryNote: '',
    deliveryNoteDate: '',
    supplierRef: '',
    otherRef: '',
    despatchDocNo: '',
    despatchThrough: '',
    destination: '',
    termsOfDelivery: '',
    paymentTerms: '',
  },
  lineItems: [],
  gstRate: 18,
  gstType: 'split' as GstType,
  bankDetails: { ...DEFAULT_BANK },
  declaration: DEFAULT_DECLARATION,
};

interface InvoiceActions {
  setStep: (step: number) => void;
  setSeller: (seller: Partial<SellerInfo>) => void;
  setBuyer: (buyer: Partial<BuyerInfo>) => void;
  setMeta: (meta: Partial<InvoiceMeta>) => void;
  addLineItem: () => void;
  updateLineItem: (id: string, updates: Partial<InvoiceLineItem>) => void;
  removeLineItem: (id: string) => void;
  setGstRate: (rate: number) => void;
  setGstType: (type: GstType) => void;
  setBankDetails: (details: Partial<BankDetails>) => void;
  setDeclaration: (text: string) => void;
  reset: () => void;
}

export const useInvoiceStore = create<InvoiceState & InvoiceActions>()(
  persist(
    (set) => ({
      ...initialState,
      setStep: (step) => set({ step }),
      setSeller: (seller) =>
        set((s) => ({ seller: { ...s.seller, ...seller } })),
      setBuyer: (buyer) =>
        set((s) => ({ buyer: { ...s.buyer, ...buyer } })),
      setMeta: (meta) =>
        set((s) => ({ meta: { ...s.meta, ...meta } })),
      addLineItem: () =>
        set((s) => ({
          lineItems: [
            ...s.lineItems,
            {
              id: crypto.randomUUID(),
              description: '',
              hsn: '998314',
              qty: 1,
              unit: 'Nos',
              rate: 0,
              amount: 0,
            },
          ],
        })),
      updateLineItem: (id, updates) =>
        set((s) => ({
          lineItems: s.lineItems.map((item) =>
            item.id === id
              ? {
                  ...item,
                  ...updates,
                  amount:
                    (updates.qty ?? item.qty) * (updates.rate ?? item.rate),
                }
              : item
          ),
        })),
      removeLineItem: (id) =>
        set((s) => ({
          lineItems: s.lineItems.filter((item) => item.id !== id),
        })),
      setGstRate: (gstRate) => set({ gstRate }),
      setGstType: (gstType) => set({ gstType }),
      setBankDetails: (details) =>
        set((s) => ({ bankDetails: { ...s.bankDetails, ...details } })),
      setDeclaration: (declaration) => set({ declaration }),
      reset: () => set(initialState),
    }),
    { name: 'hnv:invoice' }
  )
);
