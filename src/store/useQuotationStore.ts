import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { QuotationState, ServiceMode, IndexingLevel, UrgencyTier, DmsEdition, DmsDeployment, DmsLicenseValidity, DmsLicenseType, GstType } from '../types/quotation';
import type { ClientInfo } from '../types/client';
import { DEFAULT_TERMS } from '../types/quotation';
import { peekNextRefNumber } from '../lib/refNumber';

const today = () => new Date().toISOString().split('T')[0];
const plus30 = () => {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().split('T')[0];
};

const initialState: QuotationState = {
  step: 1,
  client: { companyName: '', contactPerson: '', email: '', phone: '', city: '', industry: 'Healthcare', gstin: '' },
  meta: {
    date: today(),
    validUntil: plus30(),
    refNumber: peekNextRefNumber('HNV'),
    letterheadAddress: 'Mahape, Navi Mumbai - 400 710, Maharashtra, India\n+91 XXXXX XXXXX  |  info@hnvtechno.com  |  GSTIN: 27AABCH1234N1ZX',
  },
  serviceMode: null,
  scan: {
    volume: 10000,
    sides: 1,
    docTypes: ['A4 standard'],
    rates: { prep: 0.50, scan: 1.00, qc: 0.20 },
    indexing: { level: 0, rates: [0, 2.00, 4.00, 8.00], docCount: 1000 },
    addOns: {
      ocr: { enabled: false, rate: 0.30 },
      colour: { enabled: false, rate: 0.50 },
      transport: { enabled: false, ratePerTrip: 3000, trips: 2 },
      onsite: { enabled: false, ratePerDay: 8000, days: 1 },
      destruction: { enabled: false, ratePerBox: 500, boxes: 4 },
      delivery: { enabled: false, rate: 2000 },
    },
    urgency: { tier: 0, priorityPct: 20, expressPct: 40 },
  },
  dms: {
    edition: 'premium',
    deploymentType: 'premise',
    licenseValidity: 'annual',
    licenseType: 'named',
    users: 10,
    storage: 100,
    ratePerUser: 525,
    addOns: {
      documentEditor: { enabled: false, rate: 200 },
      eSignature: { enabled: false, rate: 150 },
      aiIntegration: { enabled: false, rate: 300 },
    },
  },
  gstRate: 18,
  gstType: 'split',
  discountPct: 0,
  termsConditions: DEFAULT_TERMS,
};

interface QuotationActions {
  setStep: (step: number) => void;
  setClient: (client: Partial<ClientInfo>) => void;
  setMeta: (meta: Partial<QuotationState['meta']>) => void;
  setServiceMode: (mode: ServiceMode) => void;
  setScanVolume: (volume: number) => void;
  setScanSides: (sides: 1 | 2) => void;
  setScanDocTypes: (types: string[]) => void;
  setScanRate: (key: 'prep' | 'scan' | 'qc', value: number) => void;
  setIndexingLevel: (level: IndexingLevel) => void;
  setIndexingRate: (level: IndexingLevel, rate: number) => void;
  setIndexingDocCount: (count: number) => void;
  setScanAddOn: (key: keyof QuotationState['scan']['addOns'], updates: Record<string, unknown>) => void;
  setUrgencyTier: (tier: UrgencyTier) => void;
  setUrgencyPct: (tier: 1 | 2, pct: number) => void;
  setDmsEdition: (edition: DmsEdition, rate: number) => void;
  setDmsDeployment: (deployment: DmsDeployment) => void;
  setDmsLicenseValidity: (validity: DmsLicenseValidity) => void;
  setDmsLicenseType: (type: DmsLicenseType) => void;
  setDmsUsers: (users: number) => void;
  setDmsStorage: (storage: number) => void;
  setDmsRate: (rate: number) => void;
  setDmsAddOn: (key: keyof QuotationState['dms']['addOns'], updates: Record<string, unknown>) => void;
  setGstRate: (rate: number) => void;
  setGstType: (type: GstType) => void;
  setDiscountPct: (pct: number) => void;
  setTerms: (terms: string) => void;
  reset: () => void;
}

export const useQuotationStore = create<QuotationState & QuotationActions>()(
  persist(
    (set) => ({
      ...initialState,
      setStep: (step) => set({ step }),
      setClient: (client) => set((s) => ({ client: { ...s.client, ...client } })),
      setMeta: (meta) => set((s) => ({ meta: { ...s.meta, ...meta } })),
      setServiceMode: (serviceMode) => set({ serviceMode }),
      setScanVolume: (volume) => set((s) => ({ scan: { ...s.scan, volume } })),
      setScanSides: (sides) => set((s) => ({ scan: { ...s.scan, sides } })),
      setScanDocTypes: (docTypes) => set((s) => ({ scan: { ...s.scan, docTypes } })),
      setScanRate: (key, value) => set((s) => ({ scan: { ...s.scan, rates: { ...s.scan.rates, [key]: value } } })),
      setIndexingLevel: (level) => set((s) => ({ scan: { ...s.scan, indexing: { ...s.scan.indexing, level } } })),
      setIndexingRate: (level, rate) => set((s) => {
        const rates = [...s.scan.indexing.rates] as [number, number, number, number];
        rates[level] = rate;
        return { scan: { ...s.scan, indexing: { ...s.scan.indexing, rates } } };
      }),
      setIndexingDocCount: (docCount) => set((s) => ({ scan: { ...s.scan, indexing: { ...s.scan.indexing, docCount } } })),
      setScanAddOn: (key, updates) => set((s) => ({
        scan: { ...s.scan, addOns: { ...s.scan.addOns, [key]: { ...s.scan.addOns[key], ...updates } } }
      })),
      setUrgencyTier: (tier) => set((s) => ({ scan: { ...s.scan, urgency: { ...s.scan.urgency, tier } } })),
      setUrgencyPct: (tier, pct) => set((s) => ({
        scan: { ...s.scan, urgency: { ...s.scan.urgency, [tier === 1 ? 'priorityPct' : 'expressPct']: pct } }
      })),
      setDmsEdition: (edition, rate) => set((s) => ({ dms: { ...s.dms, edition, ratePerUser: rate } })),
      setDmsDeployment: (deploymentType) => set((s) => {
        // Reset users to valid count when switching deployment
        const validUsers = deploymentType === 'cloud' ? [5, 10, 15, 20, 25, 50] : [5, 10, 15, 20, 25, 50, 100, 150, 200];
        const users = validUsers.includes(s.dms.users) ? s.dms.users : validUsers[1];
        return { dms: { ...s.dms, deploymentType, users } };
      }),
      setDmsLicenseValidity: (licenseValidity) => set((s) => ({ dms: { ...s.dms, licenseValidity } })),
      setDmsLicenseType: (licenseType) => set((s) => ({ dms: { ...s.dms, licenseType } })),
      setDmsUsers: (users) => set((s) => ({ dms: { ...s.dms, users } })),
      setDmsStorage: (storage) => set((s) => ({ dms: { ...s.dms, storage } })),
      setDmsRate: (ratePerUser) => set((s) => ({ dms: { ...s.dms, ratePerUser } })),
      setDmsAddOn: (key, updates) => set((s) => ({
        dms: { ...s.dms, addOns: { ...s.dms.addOns, [key]: { ...s.dms.addOns[key], ...updates } } }
      })),
      setGstRate: (gstRate) => set({ gstRate }),
      setGstType: (gstType) => set({ gstType }),
      setDiscountPct: (discountPct) => set({ discountPct }),
      setTerms: (termsConditions) => set({ termsConditions }),
      reset: () => set(initialState),
    }),
    { name: 'hnv:quotation' }
  )
);
