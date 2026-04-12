import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  CompanyProfileState,
  ProfileSection,
  ServiceRow,
  IndustryRow,
  ClientRow,
  DifferentiatorRow,
  EngagementRow,
} from '../types/companyProfile';

let rowId = 0;
const rid = () => `cp_${++rowId}_${Date.now()}`;

const DEFAULT_SECTIONS: ProfileSection[] = [
  {
    id: 'about',
    title: 'About HNV Techno Solutions',
    content: `HNV Techno Solutions is a leading enterprise document digitization and information management company with over 15 years of proven expertise in transforming how organizations capture, process, store, and retrieve critical business documents. We combine industrial-grade scanning infrastructure with intelligent automation technologies to deliver end-to-end document lifecycle solutions for mission-critical environments.

Founded on the principle that every organization deserves secure, accessible, and compliant document management, we serve a distinguished portfolio of clients across Government, Healthcare, Legal, Education, Banking & Finance, Manufacturing, and Supply Chain sectors. Our deep domain expertise across regulated industries sets us apart from generalist service providers, enabling us to deliver solutions that are not just technically sound, but operationally aligned with sector-specific compliance mandates.

Headquartered in India, our state-of-the-art digitization centres are equipped with high-speed production scanners, advanced OCR and ICR engines, AI-driven data extraction platforms, and enterprise-grade document management systems. We maintain strict chain-of-custody protocols, ensuring that every physical document entrusted to us is handled with the highest standards of security and confidentiality.`,
  },
  {
    id: 'vision',
    title: 'Vision & Mission',
    content: `Our Vision
To be India\u2019s most trusted enterprise partner for document digitization and intelligent information management, enabling organizations to transition from paper-dependent operations to secure, searchable, and audit-ready digital ecosystems.

Our Mission
To deliver world-class document scanning, imaging, archival, and data extraction services that meet the rigorous demands of regulated industries \u2014 combining speed, accuracy, and uncompromising security at scale.`,
  },
  {
    id: 'technology',
    title: 'Technology & Infrastructure',
    content: `Our technology infrastructure is designed for enterprise-grade throughput, security, and reliability. We continuously invest in cutting-edge platforms to maintain our competitive advantage.

Scanning Infrastructure
\u2022 High-speed duplex scanners: Kodak Alaris, Fujitsu fi-Series, Canon DR-Series (100\u2013200 ppm)
\u2022 Large format scanners: Contex and Colortrac wide-format scanners for A0+ documents
\u2022 Flatbed and book scanners for fragile, bound, and heritage document preservation
\u2022 Microfilm/microfiche scanners with 16mm and 35mm roll film capability

Software & AI Platform
\u2022 Advanced OCR engines: ABBYY FineReader, Tesseract (multi-language), custom-trained ML models
\u2022 AI-powered document classification, auto-indexing, and intelligent data extraction pipelines
\u2022 Enterprise DMS with full-text search, version control, and workflow automation
\u2022 Cloud and on-premise deployment options with Azure, AWS, and private cloud support

Security & Compliance
\u2022 ISO 27001 certified information security management practices
\u2022 CCTV-monitored and access-controlled scanning centres with biometric entry
\u2022 AES-256 encryption for data at rest and in transit; secure VPN-based file transfer
\u2022 NDA-backed workforce with background-verified operators and strict confidentiality protocols
\u2022 Comprehensive audit trail for every document lifecycle event with tamper-proof logging`,
  },
  {
    id: 'process',
    title: 'Our Process: End-to-End Document Lifecycle',
    content: `We follow a rigorous, six-stage methodology that ensures complete traceability, quality assurance, and compliance at every step of the document digitization journey.

01 | DISCOVERY & ASSESSMENT \u2014 Site survey, document inventory, volume estimation, format analysis, compliance requirement mapping, and project scoping with SLA definition.

02 | DOCUMENT PREPARATION \u2014 Sorting, de-stapling, page repair, batch creation, barcode labelling, and chain-of-custody documentation before scanning commences.

03 | SCANNING & IMAGE CAPTURE \u2014 High-speed production scanning with real-time quality monitoring, automatic blank page detection, deskewing, and image enhancement.

04 | OCR & DATA EXTRACTION \u2014 Multi-engine OCR processing, AI-driven classification, metadata indexing, data validation, and manual QC for handwritten or degraded documents.

05 | QUALITY ASSURANCE \u2014 Multi-tier quality audit (sampling-based and 100% review options), accuracy benchmarking against source documents, and exception handling workflows.

06 | DELIVERY & ARCHIVAL \u2014 Secure delivery via encrypted media, cloud upload, or DMS integration. Physical document return or certified destruction per client mandate.`,
  },
  {
    id: 'certifications',
    title: 'Certifications & Compliance',
    content: `\u2713 ISO 27001:2022 \u2014 Information Security Management System
\u2713 ISO 9001:2015 \u2014 Quality Management System
\u2713 HIPAA Compliant Operations for Healthcare Document Processing
\u2713 MSME/NSIC Registered Enterprise
\u2713 GeM (Government e-Marketplace) Registered Vendor
\u2713 GST Registered | PAN Verified | DPIIT Recognized`,
  },
  {
    id: 'contact',
    title: 'Contact Us',
    content: `We welcome the opportunity to discuss how HNV Techno Solutions can support your document digitization and information management objectives. Please reach out to schedule a consultation or request a detailed proposal.

Email: info@hnvtechno.com | Phone: +91 XXXXX XXXXX
Website: www.hnvtechno.com
Mahape, Navi Mumbai, Maharashtra`,
  },
];

const DEFAULT_SERVICE_ROWS: ServiceRow[] = [
  { id: 's1', service: 'Document Scanning & Imaging', description: 'High-speed bulk scanning of A0 to A6 formats, including bound books, fragile documents, engineering drawings, and microfilm. Production capacity of 100,000+ pages/day with 300\u2013600 DPI resolution.' },
  { id: 's2', service: 'OCR & Intelligent Data Capture', description: 'Advanced Optical Character Recognition with support for English, Hindi, Marathi, and regional languages. AI-powered handwriting recognition (ICR), barcode extraction, and form field auto-detection.' },
  { id: 's3', service: 'Large Format Scanning', description: 'Blueprint, engineering drawing, and architectural plan digitization up to A0+ size. Lossless colour reproduction with vector conversion capabilities for CAD-ready output.' },
  { id: 's4', service: 'Document Archival & Storage', description: 'Enterprise DMS integration, cloud-hosted and on-premise archival solutions with full-text search, role-based access control, and automated retention policy management.' },
  { id: 's5', service: 'Medical Records Digitization', description: 'HIPAA/NABH-aligned digitization of patient charts, lab reports, imaging records, and clinical documentation with HL7/FHIR-compatible metadata tagging.' },
  { id: 's6', service: 'Legal Document Processing', description: 'Court records, case files, contracts, and land records digitization with Bates numbering, privilege tagging, and e-Discovery ready output formats.' },
  { id: 's7', service: 'AI-Powered Data Extraction', description: 'Machine learning models for automated classification, entity extraction, and structured data output from unstructured documents. Custom model training for domain-specific vocabularies.' },
  { id: 's8', service: 'Microfilm & Microfiche Conversion', description: 'Legacy media digitization including 16mm/35mm microfilm, microfiche, and aperture cards with high-fidelity image reconstruction.' },
  { id: 's9', service: 'On-Site Scanning Services', description: 'Deployment of dedicated scanning teams and equipment at client premises for sensitive document projects that cannot be transported off-site.' },
  { id: 's10', service: 'Data Entry & Indexing', description: 'Manual and automated indexing services with multi-level metadata tagging, quality audit checkpoints, and 99.95%+ accuracy guarantee.' },
];

const DEFAULT_INDUSTRY_ROWS: IndustryRow[] = [
  { id: 'i1', industry: 'Government', capabilities: 'Land records, gazette digitization, RTI compliance archives, e-Governance portal integration, NIC/MeitY project experience, Aadhaar-linked document systems, state and central government tender execution.' },
  { id: 'i2', industry: 'Healthcare', capabilities: 'EMR/EHR digitization, patient chart scanning, NABH/HIPAA compliance, lab report archival, radiology image management, clinical research document processing, insurance claim documentation.' },
  { id: 'i3', industry: 'Legal', capabilities: 'Case file digitization, court record archival, contract management, land title searches, Bates stamping, privilege review support, e-Discovery and litigation hold compliance.' },
  { id: 'i4', industry: 'Education', capabilities: 'Student records management, examination paper archival, NAAC accreditation documentation, library digitization, university certificate verification systems, research paper indexing.' },
  { id: 'i5', industry: 'Banking & Finance', capabilities: 'KYC document processing, loan file digitization, cheque image archival, RBI audit compliance, SEBI regulatory documentation, account opening form scanning, NPA/recovery file management.' },
  { id: 'i6', industry: 'Manufacturing', capabilities: 'Quality assurance documentation, ISO compliance records, shop floor drawings, BOM archival, vendor documentation management, EHS compliance records, SAP document integration.' },
  { id: 'i7', industry: 'Supply Chain', capabilities: 'Bill of lading digitization, customs documentation, warehouse receipt management, logistics tracking records, vendor compliance certificates, import/export documentation archival.' },
];

const DEFAULT_CLIENT_ROWS: ClientRow[] = [
  { id: 'c1', num: 1, clientName: 'MD Bank (Mumbai District Bank)', sector: 'Banking & Finance' },
  { id: 'c2', num: 2, clientName: 'Corporation Bank', sector: 'Banking & Finance' },
  { id: 'c3', num: 3, clientName: 'Federal Bank (Nerul, Dombivali, Goa & Pune)', sector: 'Banking & Finance' },
  { id: 'c4', num: 4, clientName: 'Vira Legal (High Court)', sector: 'Legal' },
  { id: 'c5', num: 5, clientName: 'RMS Legal (High Court)', sector: 'Legal' },
  { id: 'c6', num: 6, clientName: 'Gentech Pharmaceuticals', sector: 'Healthcare & Pharma' },
  { id: 'c7', num: 7, clientName: 'Ansapack', sector: 'Manufacturing & Packaging' },
  { id: 'c8', num: 8, clientName: 'BKT \u2013 Balkrishna Tyres', sector: 'Manufacturing' },
  { id: 'c9', num: 9, clientName: 'R.K. Diwan (Law Firm)', sector: 'Legal' },
  { id: 'c10', num: 10, clientName: 'Chanakya\u2019s Brand Solutions', sector: 'Marketing & Branding' },
  { id: 'c11', num: 11, clientName: 'Bhartiya Arogya Nidhi', sector: 'Healthcare & Welfare' },
  { id: 'c12', num: 12, clientName: 'Shivkrupa Sahakari Patpedhi', sector: 'Co-operative Finance' },
  { id: 'c13', num: 13, clientName: 'National Gas Allied & Equipment', sector: 'Energy & Industrial' },
  { id: 'c14', num: 14, clientName: 'ACE', sector: 'Enterprise' },
  { id: 'c15', num: 15, clientName: 'POCT Group', sector: 'Group / Conglomerate' },
];

const DEFAULT_DIFFERENTIATOR_ROWS: DifferentiatorRow[] = [
  { id: 'd1', differentiator: '15+ Years of Domain Expertise', advantage: 'Deep institutional knowledge in handling sensitive, high-volume document projects across seven regulated industry verticals.' },
  { id: 'd2', differentiator: 'AI & ML Integration', advantage: 'Not just scanning \u2014 we deliver intelligent document processing with automated classification, entity extraction, and predictive indexing capabilities.' },
  { id: 'd3', differentiator: 'Enterprise-Grade Security', advantage: 'ISO 27001 certified operations, biometric-controlled facilities, encrypted data handling, and comprehensive audit trails for every document.' },
  { id: 'd4', differentiator: 'Scalable Capacity', advantage: '100,000+ pages/day production capacity with elastic scaling for surge requirements. On-site and off-site deployment models.' },
  { id: 'd5', differentiator: '99.95%+ Accuracy Guarantee', advantage: 'Multi-tier QA framework with automated and manual validation stages. SLA-backed accuracy commitments for every project.' },
  { id: 'd6', differentiator: 'End-to-End Lifecycle', advantage: 'From physical document pickup to digital archival and certified destruction \u2014 single-vendor accountability across the entire value chain.' },
  { id: 'd7', differentiator: 'Flexible Engagement Models', advantage: 'Project-based, managed services, on-site deployment, and hybrid models tailored to client requirements and budgets.' },
  { id: 'd8', differentiator: 'Compliance-First Approach', advantage: 'Built-in compliance frameworks for HIPAA, NABH, IT Act, RBI, SEBI, NAAC, and sector-specific regulatory mandates.' },
];

const DEFAULT_ENGAGEMENT_ROWS: EngagementRow[] = [
  { id: 'e1', model: 'Project-Based', bestFor: 'Defined-scope digitization drives with clear start and end dates', features: 'Fixed pricing, milestone deliveries, dedicated project manager' },
  { id: 'e2', model: 'Managed Services', bestFor: 'Ongoing document processing with predictable monthly volumes', features: 'Per-page pricing, dedicated team, monthly reporting and SLA tracking' },
  { id: 'e3', model: 'On-Site Deployment', bestFor: 'Classified/sensitive documents that cannot leave client premises', features: 'HNV team and equipment deployed at client location, supervised operations' },
  { id: 'e4', model: 'Hybrid Model', bestFor: 'Organizations requiring a mix of on-site and off-site processing', features: 'Flexible split between secure off-site centre and client-premise operations' },
];

const initialState: CompanyProfileState = {
  sections: DEFAULT_SECTIONS,
  serviceRows: DEFAULT_SERVICE_ROWS,
  industryRows: DEFAULT_INDUSTRY_ROWS,
  clientRows: DEFAULT_CLIENT_ROWS,
  differentiatorRows: DEFAULT_DIFFERENTIATOR_ROWS,
  engagementRows: DEFAULT_ENGAGEMENT_ROWS,
};

type TableType = 'serviceRows' | 'industryRows' | 'clientRows' | 'differentiatorRows' | 'engagementRows';

interface ProfileActions {
  updateSection: (id: string, content: string) => void;
  updateTableCell: (table: TableType, rowId: string, field: string, value: string | number) => void;
  addTableRow: (table: TableType) => void;
  removeTableRow: (table: TableType, rowId: string) => void;
  reset: () => void;
}

export const useCompanyProfileStore = create<CompanyProfileState & ProfileActions>()(
  persist(
    (set) => ({
      ...initialState,
      updateSection: (id, content) =>
        set((s) => ({
          sections: s.sections.map((sec) =>
            sec.id === id ? { ...sec, content } : sec
          ),
        })),
      updateTableCell: (table, rowId, field, value) =>
        set((s) => ({
          [table]: (s[table] as unknown as Array<{ id: string; [k: string]: unknown }>).map((r) =>
            r.id === rowId ? { ...r, [field]: value } : r
          ),
        })),
      addTableRow: (table) =>
        set((s) => {
          const id = rid();
          const templates: Record<TableType, Record<string, unknown>> = {
            serviceRows: { id, service: '', description: '' },
            industryRows: { id, industry: '', capabilities: '' },
            clientRows: { id, num: (s.clientRows.length + 1), clientName: '', sector: '' },
            differentiatorRows: { id, differentiator: '', advantage: '' },
            engagementRows: { id, model: '', bestFor: '', features: '' },
          };
          return { [table]: [...(s[table] as unknown[]), templates[table]] };
        }),
      removeTableRow: (table, rowId) =>
        set((s) => ({
          [table]: (s[table] as unknown as Array<{ id: string; [k: string]: unknown }>).filter((r) => r.id !== rowId),
        })),
      reset: () => set({
        ...initialState,
        sections: DEFAULT_SECTIONS.map((s) => ({ ...s })),
        serviceRows: DEFAULT_SERVICE_ROWS.map((r) => ({ ...r })),
        industryRows: DEFAULT_INDUSTRY_ROWS.map((r) => ({ ...r })),
        clientRows: DEFAULT_CLIENT_ROWS.map((r) => ({ ...r })),
        differentiatorRows: DEFAULT_DIFFERENTIATOR_ROWS.map((r) => ({ ...r })),
        engagementRows: DEFAULT_ENGAGEMENT_ROWS.map((r) => ({ ...r })),
      }),
    }),
    { name: 'hnv:company-profile' }
  )
);
