export interface ProfileSection {
  id: string;
  title: string;
  content: string;
}

export interface ServiceRow {
  id: string;
  service: string;
  description: string;
}

export interface IndustryRow {
  id: string;
  industry: string;
  capabilities: string;
}

export interface ClientRow {
  id: string;
  num: number;
  clientName: string;
  sector: string;
}

export interface DifferentiatorRow {
  id: string;
  differentiator: string;
  advantage: string;
}

export interface EngagementRow {
  id: string;
  model: string;
  bestFor: string;
  features: string;
}

export interface CompanyProfileState {
  sections: ProfileSection[];
  serviceRows: ServiceRow[];
  industryRows: IndustryRow[];
  clientRows: ClientRow[];
  differentiatorRows: DifferentiatorRow[];
  engagementRows: EngagementRow[];
}
