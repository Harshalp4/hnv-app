export interface ProposalSection {
  id: string;
  title: string;
  content: string;
  collapsed: boolean;
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
  projectTitle: string;
  date: string;
  refNumber: string;
  validUntil: string;
  pricingRows: PricingRow[];
  pricingNote: string;
  sections: ProposalSection[];
}
