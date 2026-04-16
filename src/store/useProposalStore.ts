import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProposalState, ProposalSection, PricingRow } from '../types/proposal';

const today = () => new Date().toISOString().split('T')[0];

let rowIdCounter = 0;
const rid = () => `pr_${++rowIdCounter}_${Date.now()}`;

const DEFAULT_PRICING_ROWS: PricingRow[] = [
  { id: 'r1', service: 'Service Item 1', rate: '₹ 0.00', unit: 'Per Unit', remarks: '' },
  { id: 'r2', service: 'Service Item 2', rate: '₹ 0.00', unit: 'Per Unit', remarks: '' },
];

const DEFAULT_PRICING_NOTE = `Note: All prices are exclusive of applicable taxes. Terms and conditions apply as per the agreement.`;

const DEFAULT_SECTIONS: ProposalSection[] = [
  {
    id: 'executive',
    title: '1. Executive Summary',
    content: `HNV Techno Solutions Pvt. Ltd. is pleased to present this proposal to {{clientName}} for professional digital transformation and document management services.

In today's business environment, organisations generate and handle vast volumes of physical and digital documents daily. Efficient management of these documents is critical for operational efficiency, regulatory compliance, and business continuity. HNV Techno Solutions brings proven expertise in converting paper-intensive processes into streamlined digital workflows — enabling faster retrieval, reduced storage costs, enhanced security, and full regulatory compliance.

This proposal outlines our understanding of {{clientName}}'s requirements, our proposed approach and methodology, scope of services, commercial terms, and the value we bring as a long-term technology partner. We are confident that our combination of domain expertise, operational capability, and technology-driven approach will deliver measurable results for {{clientName}}.`,
    collapsed: false,
    enabled: true,
  },
  {
    id: 'about',
    title: '2. About HNV Techno Solutions Pvt. Ltd.',
    content: `HNV Techno Solutions Pvt. Ltd. (CIN: U62099MH2026PTC467022) is a Navi Mumbai-based technology company delivering end-to-end digital transformation services to enterprises across India. We combine deep technology expertise with strong operational capability to help organisations go paperless, work smarter, and stay compliant.

Document Management Services (DMS)
HNV's Document Management Services division is our flagship practice — purpose-built to handle the complete document lifecycle from physical capture through intelligent digital archival and instant retrieval. We serve corporates, government bodies, financial institutions, healthcare organisations, and regulated industries with mission-critical document operations.

Our DMS capabilities include:
• High-volume document scanning and digitization — processing lakhs of pages per month with consistent quality
• Intelligent indexing, metadata tagging, and multi-level folder structuring for instant document retrieval
• Custom DMS solutions available in on-premise and cloud (SaaS) deployment options tailored to client requirements
• OCR and full-text extraction for creating fully searchable digital archives
• Automated workflow integration for document-centric processes such as claims processing, approvals, audits, and compliance
• Secure document storage and archival management — both on-premise and cloud-based with role-based access controls
• Document migration from legacy systems to modern DMS platforms
• Secure document destruction with certificate of destruction and complete chain-of-custody documentation

Software Development
HNV Techno Solutions builds custom enterprise software tailored to client workflows. Our development capabilities include:
• Custom web and mobile application development (.NET, Angular, Flutter, React)
• AI-powered document processing and data extraction solutions
• ERP, CRM, and HRMS integrations and customizations
• API development and third-party system integration
• Cloud-native application development on Azure and AWS
• Healthcare IT solutions including TPA management systems and claims processing platforms

Software Support & Maintenance
We provide reliable post-deployment support to keep systems running smoothly:
• Annual Maintenance Contracts (AMC) for enterprise applications
• Bug fixes, patches, and security updates
• Performance monitoring, optimization, and server management
• User training, onboarding, and helpdesk support
• SLA-based response commitments for critical systems

Industry Verticals Served
• Banking, Financial Services & Insurance (BFSI)
• Healthcare & Third Party Administrators (TPA)
• Government & Public Sector Undertakings (PSU)
• Manufacturing & Engineering
• Legal & Compliance
• Education & Research Institutions
• Pharmaceuticals & Life Sciences

Why HNV Techno Solutions
• Technology-backed document operations — not just scanning, but intelligent digitization with AI-powered quality control
• End-to-end capability — from physical document handling to custom DMS software development under one roof
• Strict data security and confidentiality protocols across all engagements with NDA-bound operations staff
• Flexible DMS solutions with multiple licensing and deployment models
• Proven scalability — equipped to handle projects ranging from thousands to crores of pages
• Compliance with India's Digital Personal Data Protection (DPDP) Act, 2023 and DPDP Rules, 2025
• Registered under the Companies Act, 2013 — GST: 27AAICH4615H1ZK | PAN: AAICH4615H`,
    collapsed: true,
    enabled: true,
  },
  {
    id: 'clients',
    title: '3. Our Clients',
    content: `HNV Techno Solutions is trusted by leading organisations across diverse industries. Some of our valued clients include:

Banking & Financial Services
• MD Bank (Mumbai District Bank, Mumbai)
• Corporation Bank
• Federal Bank (Nerul Navi Mumbai, Dombivali, Goa & Pune)
• Shivkrupa Sahakari Patpedhi

Healthcare & TPA
• MDIndia Health Insurance TPA Pvt. Ltd.
• Bhartiya Arogya Nidhi

Legal & Professional Services
• Vira Legal (High Court)
• RMS Legal (High Court)
• R.K. Diwan (Law Firm)

Manufacturing & Industrial
• BKT (Balkrishna Tyre)
• Gentech Pharmaceuticals
• Ansapack
• National Gas Allied & Equipment
• ACE

Marketing & Branding
• Chanakya's Brand Solution

Our client engagements span document scanning, digitization, custom software development, DMS implementation, and enterprise solutions — ranging from focused projects to large-scale, multi-year transformation programmes.`,
    collapsed: true,
    enabled: true,
  },
  {
    id: 'needs',
    title: '4. Understanding of Client Needs',
    content: `Based on our discussions with {{clientName}}, we understand the key requirements to be:

• Digitization and conversion of existing physical/paper-based records into secure, accessible digital formats
• Structured indexing, cataloguing, and metadata tagging for fast and accurate document retrieval
• Secure storage, archival, and lifecycle management of both physical and digital documents
• Workflow automation to reduce manual effort, improve turnaround time, and ensure process consistency
• Integration with existing enterprise systems (ERP, CRM, HRMS, or legacy applications) for seamless data flow
• Compliance with applicable regulatory, audit, and data protection requirements
• Reliable turnaround times with quality assurance at every stage of delivery
• Scalable solution that can grow with {{clientName}}'s evolving business needs`,
    collapsed: true,
    enabled: true,
  },
  {
    id: 'scope',
    title: '5. Scope of Services',
    content: `The following services are included under this engagement:

5.1 Document Preparation
• Receiving and logging of physical documents from {{clientName}}
• Removal of staples, paper clips, tags, and binding materials
• Page straightening, unfolding, and minor repair as needed
• Batch sorting and serial numbering prior to processing

5.2 Scanning & Digitization
• High-resolution scanning at minimum 300 DPI as standard
• Support for A4, A3, Legal, and custom-size documents
• Colour, grayscale, or black & white scanning as specified
• Output formats: PDF, JPEG, TIFF, or PNG as per client requirement

5.3 Document Operations & Indexing
• Image quality check — brightness, contrast, and clarity verification
• Image rotation and orientation correction
• Blank page removal (on request)
• File naming as per agreed convention (e.g., Reference No., Name, Date)
• Folder/batch organization as per client-specified structure
• OCR / full-text extraction for searchable PDFs (on request)

5.4 Software Development & Integration
• Custom web and mobile application development
• API development and third-party system integration
• DMS implementation and configuration as per client requirements
• Cloud-native application deployment on Azure / AWS

5.5 Support & Maintenance
• Annual Maintenance Contracts (AMC) for delivered applications
• Bug fixes, patches, and security updates
• Performance monitoring, optimization, and server management
• User training, onboarding, and helpdesk support

5.6 Delivery
• Delivery mode, frequency, and schedule as per {{clientName}}'s requirement
• Delivery channels: encrypted USB drive, external hard disk, secure cloud upload, SFTP, or any other method specified
• Progress reports and status updates at agreed intervals
• Final delivery with complete documentation and handover`,
    collapsed: true,
    enabled: true,
  },
  {
    id: 'methodology',
    title: '6. Process & Methodology',
    content: `HNV Techno Solutions follows a structured, quality-driven process to ensure consistent delivery across all engagements:

Phase 1 — Discovery & Planning
• Requirement gathering sessions with {{clientName}}'s stakeholders
• Document audit — assess volume, types, condition, and special handling needs
• Define naming conventions, folder structures, indexing parameters, and output specifications
• Agree on timelines, milestones, delivery schedule, and escalation matrix
• Sign-off on project plan and scope document

Phase 2 — Setup & Mobilisation
• Allocate dedicated project manager as single point of contact
• Configure scanning stations, software tools, and quality checkpoints
• Set up secure storage, access controls, and data transfer mechanisms
• Staff onboarding with NDA execution and project-specific training
• Pilot batch processing for {{clientName}}'s review and sign-off before full-scale rollout

Phase 3 — Execution & Processing
• Document pickup / receipt as per agreed schedule
• Document preparation, scanning, and digitization at production scale
• Indexing, metadata tagging, and quality verification on every batch
• Regular status updates and progress reports to {{clientName}}

Phase 4 — Quality Control & Review
• Multi-level quality checks — automated + manual review
• Random sample audit of minimum 5% of total output per batch
• Re-processing of any rejected images at zero additional cost
• Quality summary report with batch count, exception log, and metrics

Phase 5 — Delivery & Closure
• Final output delivery via agreed channel (USB, HDD, cloud, SFTP)
• Delivery report with complete batch summary and image count
• Return of original physical documents in organized condition
• Post-delivery support window for any queries or corrections
• Project closure sign-off and feedback`,
    collapsed: true,
    enabled: true,
  },
  {
    id: 'quality',
    title: '7. Quality Assurance',
    content: `HNV Techno Solutions is committed to delivering consistently high-quality output at every stage:

Quality Standards
• All scanning performed at minimum 300 DPI resolution with colour calibration
• Every scanned image undergoes automated quality checks for resolution, orientation, clarity, and completeness
• Manual review layer by trained QC operators for accuracy of indexing, naming, and metadata
• Random sample audit of minimum 5% of total images per batch before final delivery

Error Handling & Resolution
• Any defective scans identified during audit are re-processed at no additional cost
• Re-scan requests by {{clientName}} due to HNV error will be addressed within 2 business days at no charge
• Quality complaints must be raised within 5 business days of delivery for resolution at no additional charge

Reporting & Transparency
• Each delivery includes a quality report with batch count, image count, and exception log
• Regular progress reviews and status updates at agreed intervals
• Dedicated project manager for all communication and escalation`,
    collapsed: true,
    enabled: true,
  },
  {
    id: 'security',
    title: '8. Confidentiality & Data Security',
    content: `Given the sensitive nature of business documents, HNV Techno Solutions maintains strict data security practices across all engagements:

Data Handling & Access Control
• All documents and data are treated as strictly confidential
• Operations staff are bound by individual non-disclosure agreements (NDAs) before handling any client documents
• Physical documents are stored in secured, access-controlled facilities during processing
• Digital files are stored on encrypted, access-controlled systems with role-based permissions

Data Protection & Compliance
• HNV Techno Solutions complies with applicable provisions of India's Digital Personal Data Protection (DPDP) Act, 2023 and DPDP Rules, 2025
• Compliance with the Information Technology Act, 2000 and IT (Amendment) Act, 2008
• Personal data is processed only as per documented instructions of the client

Data Deletion & Destruction
• All digital copies are permanently deleted within 30 days of confirmed delivery
• Secure document destruction available with certificate of destruction and chain-of-custody documentation
• No client content will be shared with any third party under any circumstances

Audit & Inspection
• {{clientName}} reserves the right to audit HNV's document handling procedures and security controls with 5 business days written notice`,
    collapsed: true,
    enabled: true,
  },
  {
    id: 'responsibilities',
    title: '9. Client Responsibilities',
    content: `To ensure smooth execution and timely delivery, {{clientName}} agrees to:

• Provide physical access to documents and ensure they are ready for pickup or delivery at agreed dates
• Provide clear naming convention, folder structure, or indexing logic prior to commencement of work
• Designate a single point of contact (SPOC) for all coordination, approvals, and day-to-day queries
• Provide timely approvals and feedback at agreed milestones — delays in approvals may impact delivery timelines
• Ensure all documents submitted are legally owned by {{clientName}} or that {{clientName}} has requisite authority to digitize them
• Inform HNV in advance of any sensitive or regulated document categories so appropriate handling protocols are applied
• Complete a pre-work sign-off acknowledging document count, batch composition, and agreed scope before processing begins
• Ensure availability of stakeholders for kickoff, review meetings, and final sign-off`,
    collapsed: true,
    enabled: true,
  },
  {
    id: 'payment',
    title: '10. Payment Terms',
    content: `Billing Cycle
As per mutually agreed schedule — monthly, milestone-based, or on completion

Payment Due
Within 30 days from the date of invoice

Payment Mode
NEFT / RTGS / Cheque / UPI (Account details provided on invoice)

Taxes
GST at applicable rates will be charged additionally on all invoices

Advance
For new engagements, a one-time advance may be requested as per mutual agreement

Late Payment
Interest @ 1.5% per month on overdue amounts beyond 30 days from invoice date`,
    collapsed: true,
    enabled: true,
  },
  {
    id: 'terms',
    title: '11. Terms & Conditions',
    content: `11.1 Acceptance of Proposal
This proposal becomes a binding agreement upon {{clientName}}'s written acceptance (email or signed copy). Work will commence upon execution of this agreement.

11.2 Scope Changes
Any changes to the agreed scope of work (resolution, format, naming convention, additional services) must be communicated in writing before processing begins. Mid-work changes may result in additional charges and revised timelines, confirmed in writing before implementation.

11.3 Document Handling & Liability
HNV Techno Solutions will handle all physical documents with reasonable care. Liability for any damage or loss during processing shall be limited to ₹500 per document, subject to a maximum aggregate liability of ₹25,000 per engagement, unless a separate insurance arrangement is agreed upon in writing.

11.4 Quality Disputes
Quality complaints must be raised in writing within 5 business days of delivery. Valid complaints will be resolved at no additional charge. Complaints raised after the 5-day window will be treated as new work requests.

11.5 Confidentiality
Both parties agree to keep all project details, pricing, document content, and business information strictly confidential for a period of 5 years from the date of project completion. This obligation survives termination or expiry of this agreement.

11.6 Data Processor Obligations (DPDP Act 2023)
HNV Techno Solutions shall process personal data only as per the documented instructions of {{clientName}} and implement appropriate technical and organisational measures to protect personal data. HNV shall not engage any sub-processor without prior written consent.

11.7 Data Deletion & Retention
Scanned digital files will be retained for a maximum of 30 calendar days post-delivery, after which they will be permanently deleted. {{clientName}} is responsible for backing up received files promptly.

11.8 Sub-Contracting
HNV shall not sub-contract any part of the work without prior written consent of {{clientName}}. If consent is granted, HNV remains fully responsible for the sub-contractor's performance.

11.9 Termination
Either party may terminate this agreement with 15 days written notice. {{clientName}} shall pay for all work completed up to the date of termination. Upon termination, HNV shall return all physical documents and delete all digital copies.

11.10 Governing Law & Jurisdiction
This agreement shall be governed by the laws of India, including the Indian Contract Act 1872, IT Act 2000, and DPDP Act 2023. Disputes shall be subject to the exclusive jurisdiction of the courts at Navi Mumbai, Maharashtra.

11.11 Force Majeure
HNV Techno Solutions shall not be liable for delays due to causes beyond reasonable control, including natural disasters, government actions, power failures, pandemic, or civil unrest.

11.12 Entire Agreement
This proposal, upon written acceptance, constitutes the entire agreement between the parties and supersedes all prior discussions and communications. Amendments must be in writing and signed by both parties.`,
    collapsed: true,
    enabled: true,
  },
  {
    id: 'acceptance',
    title: '12. Proposal Acceptance',
    content: `To accept this proposal, please sign below and return a signed copy to HNV Techno Solutions Pvt. Ltd. by email or courier. Upon acceptance, our team will initiate the discovery and planning phase within 3 business days.

We look forward to a successful partnership with {{clientName}}.`,
    collapsed: true,
    enabled: true,
  },
];

const initialState: ProposalState = {
  clientName: '',
  clientAddress: '',
  companyName: 'HNV Techno Solutions Pvt. Ltd.',
  companyAddress: 'Mahape, Navi Mumbai, Maharashtra',
  companyGst: '27AAICH4615H1ZK',
  companyCin: 'U62099MH2026PTC467022',
  companyEmail: 'info@hnvtechno.com',
  companyPhone: '+91 XXXXX XXXXX',
  projectTitle: 'Service Proposal',
  date: today(),
  refNumber: 'PROP-001',
  validUntil: '30 Days from Date of Issue',
  pricingRows: DEFAULT_PRICING_ROWS,
  pricingNote: DEFAULT_PRICING_NOTE,
  pricingEnabled: true,
  coverEnabled: true,
  signatureEnabled: true,
  footerEnabled: true,
  sections: DEFAULT_SECTIONS,
};

interface ProposalActions {
  setClientName: (name: string) => void;
  setClientAddress: (address: string) => void;
  setCompanyName: (name: string) => void;
  setCompanyAddress: (address: string) => void;
  setCompanyGst: (gst: string) => void;
  setCompanyCin: (cin: string) => void;
  setCompanyEmail: (email: string) => void;
  setCompanyPhone: (phone: string) => void;
  setProjectTitle: (title: string) => void;
  setDate: (date: string) => void;
  setRefNumber: (ref: string) => void;
  setValidUntil: (val: string) => void;
  setPricingNote: (note: string) => void;
  setPricingEnabled: (v: boolean) => void;
  setCoverEnabled: (v: boolean) => void;
  setSignatureEnabled: (v: boolean) => void;
  setFooterEnabled: (v: boolean) => void;
  addPricingRow: () => void;
  removePricingRow: (id: string) => void;
  updatePricingRow: (id: string, field: keyof PricingRow, value: string) => void;
  updateSection: (id: string, content: string) => void;
  updateSectionTitle: (id: string, title: string) => void;
  toggleCollapse: (id: string) => void;
  toggleSectionEnabled: (id: string) => void;
  addSection: () => void;
  removeSection: (id: string) => void;
  reset: () => void;
}

export const useProposalStore = create<ProposalState & ProposalActions>()(
  persist(
    (set) => ({
      ...initialState,
      setClientName: (clientName) => set({ clientName }),
      setClientAddress: (clientAddress) => set({ clientAddress }),
      setCompanyName: (companyName) => set({ companyName }),
      setCompanyAddress: (companyAddress) => set({ companyAddress }),
      setCompanyGst: (companyGst) => set({ companyGst }),
      setCompanyCin: (companyCin) => set({ companyCin }),
      setCompanyEmail: (companyEmail) => set({ companyEmail }),
      setCompanyPhone: (companyPhone) => set({ companyPhone }),
      setProjectTitle: (projectTitle) => set({ projectTitle }),
      setDate: (date) => set({ date }),
      setRefNumber: (refNumber) => set({ refNumber }),
      setValidUntil: (validUntil) => set({ validUntil }),
      setPricingNote: (pricingNote) => set({ pricingNote }),
      setPricingEnabled: (pricingEnabled) => set({ pricingEnabled }),
      setCoverEnabled: (coverEnabled) => set({ coverEnabled }),
      setSignatureEnabled: (signatureEnabled) => set({ signatureEnabled }),
      setFooterEnabled: (footerEnabled) => set({ footerEnabled }),
      addPricingRow: () =>
        set((s) => ({
          pricingRows: [...s.pricingRows, { id: rid(), service: '', rate: '', unit: '', remarks: '' }],
        })),
      removePricingRow: (id) =>
        set((s) => ({
          pricingRows: s.pricingRows.filter((r) => r.id !== id),
        })),
      updatePricingRow: (id, field, value) =>
        set((s) => ({
          pricingRows: s.pricingRows.map((r) =>
            r.id === id ? { ...r, [field]: value } : r
          ),
        })),
      updateSection: (id, content) =>
        set((s) => ({
          sections: s.sections.map((sec) =>
            sec.id === id ? { ...sec, content } : sec
          ),
        })),
      updateSectionTitle: (id, title) =>
        set((s) => ({
          sections: s.sections.map((sec) =>
            sec.id === id ? { ...sec, title } : sec
          ),
        })),
      toggleCollapse: (id) =>
        set((s) => ({
          sections: s.sections.map((sec) =>
            sec.id === id ? { ...sec, collapsed: !sec.collapsed } : sec
          ),
        })),
      toggleSectionEnabled: (id) =>
        set((s) => ({
          sections: s.sections.map((sec) =>
            sec.id === id ? { ...sec, enabled: !sec.enabled } : sec
          ),
        })),
      addSection: () =>
        set((s) => {
          const num = s.sections.length + 1;
          return {
            sections: [
              ...s.sections,
              {
                id: rid(),
                title: `${num}. New Section`,
                content: 'Enter content here...',
                collapsed: false,
                enabled: true,
              },
            ],
          };
        }),
      removeSection: (id) =>
        set((s) => ({
          sections: s.sections.filter((sec) => sec.id !== id),
        })),
      reset: () => set({
        ...initialState,
        pricingRows: DEFAULT_PRICING_ROWS.map((r) => ({ ...r })),
        sections: DEFAULT_SECTIONS.map((s) => ({ ...s })),
      }),
    }),
    { name: 'hnv:proposal', version: 9 }
  )
);
