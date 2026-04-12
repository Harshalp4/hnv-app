export interface ClientInfo {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  city: string;
  industry: string;
  gstin: string;
}

export const INDUSTRIES = [
  'Healthcare',
  'Finance & Banking',
  'Government / PSU',
  'Legal',
  'Education',
  'Manufacturing',
  'Real Estate',
  'Logistics',
  'Insurance',
  'Other',
] as const;
