export interface ProposalSection {
  id: string;
  title: string;
  content: string;
  collapsed: boolean;
  enabled: boolean;
}

export interface PricingRow {
  id: string;
  service: string;
  rate: string;
  unit: string;
  remarks: string;
}

export interface ProposalState {
  clientName: string;
  clientAddress: string;
  companyName: string;
  companyAddress: string;
  companyGst: string;
  companyCin: string;
  companyEmail: string;
  companyPhone: string;
  projectTitle: string;
  date: string;
  refNumber: string;
  validUntil: string;
  pricingRows: PricingRow[];
  pricingNote: string;
  pricingEnabled: boolean;
  coverEnabled: boolean;
  signatureEnabled: boolean;
  footerEnabled: boolean;
  sections: ProposalSection[];
}
