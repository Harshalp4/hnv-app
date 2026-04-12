import type { ClientInfo } from './client';

export type ServiceMode = 'scan' | 'dms' | 'both';
export type IndexingLevel = 0 | 1 | 2 | 3;
export type UrgencyTier = 0 | 1 | 2;
export type DmsEdition = 'standard' | 'premium' | 'enterprise';
export type DmsDeployment = 'premise' | 'cloud';
export type DmsLicenseValidity = 'annual' | 'perpetual';
export type DmsLicenseType = 'named' | 'concurrent';
export type GstType = 'split' | 'igst';

export interface ScanConfig {
  volume: number;
  sides: 1 | 2;
  docTypes: string[];
  rates: {
    prep: number;
    scan: number;
    qc: number;
  };
  indexing: {
    level: IndexingLevel;
    rates: [number, number, number, number];
    docCount: number;
  };
  addOns: {
    ocr: { enabled: boolean; rate: number };
    colour: { enabled: boolean; rate: number };
    transport: { enabled: boolean; ratePerTrip: number; trips: number };
    onsite: { enabled: boolean; ratePerDay: number; days: number };
    destruction: { enabled: boolean; ratePerBox: number; boxes: number };
    delivery: { enabled: boolean; rate: number };
  };
  urgency: {
    tier: UrgencyTier;
    priorityPct: number;
    expressPct: number;
  };
}

export interface DmsConfig {
  edition: DmsEdition;
  deploymentType: DmsDeployment;
  licenseValidity: DmsLicenseValidity;
  licenseType: DmsLicenseType;
  users: number;
  storage: number; // GB, for cloud
  ratePerUser: number;
  addOns: {
    documentEditor: { enabled: boolean; rate: number };
    eSignature: { enabled: boolean; rate: number };
    aiIntegration: { enabled: boolean; rate: number };
  };
}

export interface QuotationMeta {
  date: string;
  validUntil: string;
  refNumber: string;
  letterheadAddress: string;
}

export interface QuotationLineItem {
  section: string;
  description: string;
  sac: string;
  qty: number;
  unit: string;
  rate: number;
  amount: number;
}

export interface QuotationCalcResult {
  lines: QuotationLineItem[];
  subtotal: number;
  discountAmount: number;
  taxableAmount: number;
  gstAmount: number;
  grandTotal: number;
  totalImages: number;
  totalPages: number;
  sides: number;
}

export interface QuotationState {
  step: number;
  client: ClientInfo;
  meta: QuotationMeta;
  serviceMode: ServiceMode | null;
  scan: ScanConfig;
  dms: DmsConfig;
  gstRate: number;
  gstType: GstType;
  discountPct: number;
  termsConditions: string;
}

export const DEFAULT_TERMS = `• Quotation valid for 30 days from date of issue.
• 50% advance payment required before commencement; balance on delivery of digital output.
• Pricing excludes travel & lodging for on-site work outside Navi Mumbai.
• All physical documents handled under strict chain of custody throughout the project.
• Scanned output delivered in Searchable PDF and/or TIFF unless specified otherwise.
• GST levied as per prevailing government rates at time of invoicing.`;

export const DOC_TYPES = [
  'A4 standard',
  'A3 / large format',
  'Bound books',
  'Engineering drawings',
  'X-ray / medical film',
  'ID cards / certificates',
  'Mixed / miscellaneous',
] as const;

export const INDEXING_LABELS = [
  'No indexing — batch/date filename only',
  'Basic — 2–3 fields (date, doc type, reference no.)',
  'Standard — 5–7 fields (name, date, type, dept, ID)',
  'Detailed — 10+ fields, double-keyed for accuracy',
] as const;

export const INDEXING_DESCRIPTIONS = [
  'Lowest cost, no searchable metadata',
  'Standard for archival, HR, general files',
  'Healthcare, legal, insurance projects',
  'Banking, government, high-compliance',
] as const;

export const DMS_EDITIONS: { value: DmsEdition; label: string; rate: number }[] = [
  { value: 'standard', label: 'Standard', rate: 262 },
  { value: 'premium', label: 'Premium', rate: 525 },
  { value: 'enterprise', label: 'Enterprise', rate: 630 },
];

export const DMS_PREMISE_USER_COUNTS = [5, 10, 15, 20, 25, 50, 100, 150, 200] as const;
export const DMS_CLOUD_USER_COUNTS = [5, 10, 15, 20, 25, 50] as const;
export const DMS_CLOUD_STORAGE_OPTIONS = Array.from({ length: 19 }, (_, i) => (i + 2) * 50); // 100 to 1000 in 50GB steps

export const DMS_PLAN_NAMES: Record<string, { name: string; color: string }> = {
  'annual-named': { name: 'Bronze', color: '#CD7F32' },
  'annual-concurrent': { name: 'Silver', color: '#8D9093' },
  'perpetual-named': { name: 'Gold', color: '#C4962C' },
  'perpetual-concurrent': { name: 'Platinum', color: '#6B7B8D' },
};

export function getDmsPlanName(validity: DmsLicenseValidity, type: DmsLicenseType) {
  return DMS_PLAN_NAMES[`${validity}-${type}`];
}
