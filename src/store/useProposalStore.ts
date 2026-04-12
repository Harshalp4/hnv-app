import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProposalState, ProposalSection, PricingRow } from '../types/proposal';

const today = () => new Date().toISOString().split('T')[0];

let rowIdCounter = 0;
const rid = () => `pr_${++rowIdCounter}_${Date.now()}`;

const DEFAULT_PRICING_ROWS: PricingRow[] = [
  { id: 'r1', service: 'Document Scanning + Document Operations', rate: '\u20B9 0.70', unit: 'Per Image', remarks: 'Included' },
  { id: 'r2', service: 'Document Preparation & Metadata', rate: '\u20B9 0.15', unit: 'Per Image', remarks: 'Included' },
  { id: 'r3', service: 'Minimum Engagement', rate: '5,000 Images', unit: '\u20B9 4,250 Min', remarks: 'Per Batch' },
  { id: 'r4', service: 'OCR \u2013 Optical Character Recognition', rate: 'On Request', unit: 'Per Image', remarks: 'Quotation' },
];

const DEFAULT_PRICING_NOTE = `Note: The minimum billing threshold is 5,000 images per batch. Document Preparation & Metadata (\u20B9 0.15/image) is included in all engagements. The combined rate is \u20B9 0.85 per image. If fewer than 5,000 images are provided in a batch, the minimum charge of \u20B9 4,250 (exclusive of GST) shall apply. GST will be charged additionally at applicable rates.`;

const DEFAULT_SECTIONS: ProposalSection[] = [
  {
    id: 'executive',
    title: '1. Executive Summary',
    content: `HNV Techno Solutions Pvt. Ltd. is pleased to present this proposal to {{clientName}} for professional document scanning and digitization services.

{{clientName}}, as a leading Third Party Administrator (TPA) in the health insurance sector, handles large volumes of physical documents including claim forms, medical records, policy documents, and correspondence. Our service is designed to convert these paper-based documents into secure, searchable digital formats \u2014 improving retrieval speed, reducing storage costs, and supporting regulatory compliance.

We offer a transparent per-image pricing model with dedicated project management, high-resolution scanning, and complete document handling from physical preparation through to final digital delivery.`,
    collapsed: false,
  },
  {
    id: 'about',
    title: '2. About HNV Techno Solutions Pvt. Ltd.',
    content: `HNV Techno Solutions Pvt. Ltd. (CIN: U62099MH2026PTC467022) is a Navi Mumbai-based technology company delivering end-to-end digital transformation services to enterprises across India. We combine technology expertise with operational capability to help organisations go paperless, work smarter, and stay compliant.

Document Management Services (DMS)
Our Document Management practice covers the full lifecycle of physical and digital documents \u2014 from capture to archival to retrieval. We offer:
\u2022 High-volume document scanning and digitization for corporates, TPAs, and government bodies
\u2022 Intelligent indexing, metadata tagging, and folder structuring for fast document retrieval
\u2022 Document storage and archival management \u2014 both on-premise and cloud-based
\u2022 Workflow automation for document-centric processes such as claims, approvals, and compliance
\u2022 OCR-based text extraction and searchable PDF generation
\u2022 Secure document destruction and end-of-life handling

Software Development
HNV Techno Solutions builds custom enterprise software tailored to client workflows. Our development capabilities include:
\u2022 Custom web and mobile application development (.NET, Angular, Flutter, React)
\u2022 AI-powered document processing and data extraction solutions
\u2022 ERP, CRM, and HRMS integrations and customizations
\u2022 API development and third-party system integration
\u2022 Cloud-native application development on Azure and AWS
\u2022 Healthcare IT solutions including TPA management systems and claims processing platforms

Software Support & Maintenance
We provide reliable post-deployment support to keep systems running smoothly:
\u2022 Annual Maintenance Contracts (AMC) for enterprise applications
\u2022 Bug fixes, patches, and security updates
\u2022 Performance monitoring, optimization, and server management
\u2022 User training, onboarding, and helpdesk support
\u2022 SLA-based response commitments for critical systems

Why HNV Techno Solutions
\u2022 Technology-backed document operations \u2014 not just scanning, but intelligent digitization
\u2022 Strict data security and confidentiality protocols across all engagements
\u2022 In-house software capability to build custom DMS solutions on top of scanning output
\u2022 Compliance with India\u2019s Digital Personal Data Protection (DPDP) Act, 2023 and DPDP Rules, 2025
\u2022 Registered under the Companies Act, 2013 \u2014 GST: 27AAICH4615H1ZK`,
    collapsed: true,
  },
  {
    id: 'needs',
    title: '3. Understanding of Client Needs',
    content: `As a health insurance TPA, {{clientName}} manages a high volume of time-sensitive physical documents. Based on our understanding, the key requirements are:

\u2022 Digitization of claim forms, discharge summaries, medical bills, and related documents
\u2022 Accurate and consistent file naming and indexing for easy retrieval
\u2022 Strict confidentiality of patient and policyholder information
\u2022 High-quality scanned output suitable for long-term archival and regulatory submission
\u2022 Reliable turnaround times to support claims processing workflows`,
    collapsed: true,
  },
  {
    id: 'scope',
    title: '4. Scope of Services',
    content: `The following services are included under this engagement:

4.1 Document Preparation
\u2022 Receiving and logging of physical documents from {{clientName}}
\u2022 Removal of staples, paper clips, tags, and binding materials
\u2022 Page straightening, unfolding, and minor repair as needed
\u2022 Batch sorting and serial numbering prior to scanning

4.2 Scanning & Imaging
\u2022 High-resolution scanning at minimum 300 DPI as standard
\u2022 Support for A4, A3, and custom-size documents
\u2022 Color, grayscale, or black & white scanning as specified
\u2022 Output formats: PDF, JPEG, TIFF, or PNG as per client requirement

4.3 Document Operations (Included in Price)
\u2022 Image quality check \u2014 brightness, contrast, and clarity verification
\u2022 Image rotation and orientation correction
\u2022 Blank page removal (on request)
\u2022 File naming as per agreed convention (e.g., Claim No., Patient Name, Date)
\u2022 Folder/batch organization as per client-specified structure
\u2022 Document sequencing and ordering as per client requirement \u2014 chronological, alphabetical, claim-wise, or any custom sequence specified by {{clientName}} prior to commencement

4.4 Delivery
\u2022 Delivery mode, frequency, and schedule shall be as per {{clientName}}\u2019s requirement \u2014 options include daily batch delivery, weekly delivery, or on-demand delivery as mutually agreed
\u2022 Delivery channels: encrypted USB drive, external hard disk, secure cloud upload, SFTP, or any other method specified by {{clientName}}
\u2022 Return of original physical documents in organized condition at frequency agreed with {{clientName}}
\u2022 Delivery report with batch summary, image count, and exception log accompanying each delivery`,
    collapsed: true,
  },
  {
    id: 'responsibilities',
    title: '6. Client Responsibilities',
    content: `To ensure smooth execution and timely delivery, {{clientName}} agrees to:

\u2022 Provide a minimum of 5,000 images/documents per engagement batch. Providing fewer documents does not reduce the minimum billing amount.
\u2022 Ensure all documents are physically accessible and ready for pickup or delivery to HNV\u2019s processing facility at the agreed date and time.
\u2022 Provide a clear naming convention, folder structure, or indexing logic (e.g., by Claim No., Policy No., Date) prior to commencement of work.
\u2022 Designate a single point of contact (SPOC) from {{clientName}} for all coordination, approvals, and day-to-day queries.
\u2022 Ensure all documents being submitted are legally owned by {{clientName}} or that {{clientName}} has the requisite authority to digitize them.
\u2022 Inform HNV Techno Solutions in advance of any sensitive or regulated document categories (e.g., patient medical records, legal notices) so appropriate handling and confidentiality protocols are applied.
\u2022 Complete a pre-work sign-off acknowledging the document count, batch composition, and agreed scope before processing begins.`,
    collapsed: true,
  },
  {
    id: 'quality',
    title: '7. Quality Assurance',
    content: `HNV Techno Solutions is committed to delivering consistently high-quality digital output:

\u2022 Every scanned image undergoes a quality check for resolution, orientation, and legibility
\u2022 A random sample audit of minimum 5% of total images is conducted before final delivery
\u2022 Any defective scans identified during audit are re-scanned at no additional cost
\u2022 Final delivery includes a quality report with batch count and exception log
\u2022 Re-scan requests by {{clientName}} due to HNV error will be addressed within 2 business days at no charge`,
    collapsed: true,
  },
  {
    id: 'security',
    title: '8. Confidentiality & Data Security',
    content: `Given the sensitive nature of health insurance documents, HNV Techno Solutions maintains strict data security practices:

\u2022 All documents and data are treated as strictly confidential
\u2022 Operations staff are bound by internal non-disclosure agreements
\u2022 Physical documents will not leave the processing facility except for return to {{clientName}}
\u2022 Digital files are stored on secured, access-controlled systems during the engagement
\u2022 All digital files are permanently deleted post-delivery upon client confirmation
\u2022 HNV Techno Solutions complies with applicable provisions of India\u2019s Digital Personal Data Protection (DPDP) Act, 2023
\u2022 No scanned content will be shared with any third party under any circumstances`,
    collapsed: true,
  },
  {
    id: 'payment',
    title: '9. Payment Terms',
    content: `Billing Cycle
Monthly \u2014 invoice raised at the end of each calendar month based on actual images processed during that month

Payment Due
Within 30 days from the date of invoice

Payment Mode
NEFT / RTGS / Cheque (Account details provided on invoice)

Taxes
GST as applicable will be charged additionally

Minimum Monthly Billing
\u20B9 1,10,500 per month (exclusive of GST) \u2014 based on 26 working days \u00D7 \u20B9 4,250 per day minimum

Late Payment
Interest @ 1.5% per month on overdue amounts after 30 days from invoice date`,
    collapsed: true,
  },
  {
    id: 'terms',
    title: '10. Terms & Conditions',
    content: `10.1 Acceptance of Proposal
This proposal becomes a binding agreement upon {{clientName}}\u2019s written acceptance (email or signed copy). Work will commence upon execution of this agreement. Billing shall follow the monthly cycle as specified in Section 9.

10.2 Minimum Engagement Clause
Each work order must include a minimum of 5,000 images. The combined rate for all services is \u20B9 0.85 per image (scanning + operations + document preparation & metadata). The minimum billing amount is \u20B9 4,250 per batch (exclusive of GST). If {{clientName}} provides fewer than 5,000 images in a batch, the minimum charge shall apply without exception.

10.3 Client Document Responsibility
{{clientName}} is solely responsible for ensuring that all documents submitted are authorized for digitization and that all necessary consents, regulatory permissions, and data-sharing approvals are in place. HNV Techno Solutions shall not be held liable for any legal, regulatory, or compliance issues arising from the nature, content, or ownership of the documents provided.

10.4 Document Handling & Liability
HNV Techno Solutions will handle all physical documents with reasonable care. However, HNV\u2019s liability for any damage, loss, or destruction of physical documents during processing shall be limited to \u20B9 500 per document, subject to a maximum aggregate liability of \u20B9 25,000 per engagement, unless a separate insurance arrangement is agreed upon in writing prior to commencement.

10.5 Quality Disputes
Any quality complaints must be raised in writing within 5 business days of delivery. HNV Techno Solutions will investigate and resolve valid complaints at no additional charge. Complaints raised after the 5-day window will be treated as new work requests and billed accordingly.

10.6 Turnaround & Delays
Estimated turnaround times are indicative and based on standard document types. HNV Techno Solutions shall not be liable for delays caused by: (a) late document submission by {{clientName}}, (b) unclear, incomplete, or changing indexing/naming requirements, (c) unusual document conditions such as fragile, heavily soiled, or oversized documents, or (d) force majeure events.

10.7 Scope Changes
Any changes to the agreed scope of work (resolution, file format, naming convention, or additional services) must be communicated in writing before processing begins. Mid-work scope changes may result in additional charges and revised timelines, which will be confirmed in writing before implementation.

10.8 Data Deletion & Retention
Scanned digital files will be retained by HNV Techno Solutions for a maximum of 30 calendar days post-delivery, after which they will be permanently and irreversibly deleted. {{clientName}} is responsible for backing up received files promptly. HNV shall not be liable for any loss arising from failure to retain files beyond this period.

10.9 Intellectual Property
All scanned output files are the intellectual property of {{clientName}} upon receipt of full payment. HNV Techno Solutions retains no rights over the content of the scanned documents and will not reproduce, disclose, or use such content for any purpose whatsoever.

10.10 Confidentiality
Both parties agree to keep all project details, pricing, document content, patient data, policyholder information, and business information strictly confidential for a period of 5 years from the date of project completion. This obligation survives termination or expiry of this agreement. HNV Techno Solutions shall ensure all personnel involved in this engagement sign individual non-disclosure undertakings prior to handling any {{clientName}} documents.

10.11 Data Processor Obligations (DPDP Act 2023 & DPDP Rules 2025)
HNV Techno Solutions acknowledges that for the purposes of this engagement, {{clientName}} acts as the Data Fiduciary and HNV Techno Solutions acts as the Data Processor as defined under the Digital Personal Data Protection Act, 2023 and the DPDP Rules, 2025 notified on 13 November 2025. HNV Techno Solutions shall: (a) process personal data only as per the documented instructions of {{clientName}}; (b) not process personal data for any purpose other than as specified in this agreement; (c) implement appropriate technical and organisational measures to protect personal data; (d) not engage any sub-processor without the prior written consent of {{clientName}}; and (e) assist {{clientName}} in fulfilling its obligations under the DPDP Act including responding to data principal rights requests.

10.12 Data Breach Notification
In the event of any actual or suspected personal data breach, HNV Techno Solutions shall notify {{clientName}} in writing within 24 hours of becoming aware of such breach. The notification shall include: (a) the nature and extent of the breach; (b) the categories and approximate number of individuals and records affected; (c) the likely consequences of the breach; and (d) the measures taken or proposed to address the breach. HNV Techno Solutions shall cooperate fully with {{clientName}} in any breach investigation and remediation. {{clientName}}, as Data Fiduciary, is responsible for any mandatory reporting to the Data Protection Board of India as required under the DPDP Act 2023.

10.13 Regulatory Compliance \u2014 IRDAI & IT Act 2000
The parties acknowledge that {{clientName}} is regulated by the Insurance Regulatory and Development Authority of India (IRDAI). All documents scanned under this agreement may be subject to IRDAI record-keeping and audit requirements. HNV Techno Solutions agrees to cooperate with any IRDAI-mandated audit or inspection relating to the handling of {{clientName}}\u2019s documents. This agreement is also subject to the provisions of the Information Technology Act, 2000 and the IT (Amendment) Act, 2008, which govern electronic records and data security in India.

10.14 Audit Rights
{{clientName}} reserves the right to audit HNV Techno Solutions\u2019 document handling procedures, data security controls, and processing facilities during the term of this engagement, with a minimum of 5 business days written notice. HNV Techno Solutions shall provide reasonable access to relevant records, staff, and facilities for the purpose of such audit. This right of audit shall be exercised no more than once per engagement year unless a data breach or compliance concern has been identified.

10.15 Sub-Contracting
HNV Techno Solutions shall not sub-contract, assign, or delegate any part of the scanning or document processing work under this agreement to any third party without the prior written consent of {{clientName}}. In the event such consent is granted, HNV Techno Solutions shall remain fully responsible for the acts and omissions of the sub-contractor and shall ensure the sub-contractor is bound by equivalent confidentiality, data protection, and security obligations as those contained herein.

10.16 Termination
Either party may terminate this agreement with 7 days written notice. In the event of termination, {{clientName}} shall pay for all work completed up to the date of termination at the agreed per-image rate, plus any non-recoverable costs incurred. Upon termination, HNV Techno Solutions shall promptly return all physical documents and permanently delete all digital copies in its possession.

10.17 Governing Law & Jurisdiction
This agreement shall be governed by and construed in accordance with the laws of India, including the Indian Contract Act, 1872, the Information Technology Act, 2000, and the Digital Personal Data Protection Act, 2023. Any disputes arising out of or relating to this agreement shall be subject to the exclusive jurisdiction of the courts at Navi Mumbai, Maharashtra.

10.18 Force Majeure
HNV Techno Solutions shall not be liable for any failure or delay in performance due to causes beyond its reasonable control, including but not limited to natural disasters, government actions, power failures, pandemic, or civil unrest. HNV will notify {{clientName}} in writing promptly of any such event, the expected duration, and a revised timeline for completion.

10.19 Entire Agreement
This proposal, upon written acceptance, constitutes the entire agreement between the parties with respect to the subject matter herein and supersedes all prior discussions, communications, representations, and understandings. Any amendment to this agreement must be made in writing and signed by authorised representatives of both parties.`,
    collapsed: true,
  },
  {
    id: 'acceptance',
    title: '11. Proposal Acceptance',
    content: `To accept this proposal, please sign below and return a signed copy to HNV Techno Solutions Pvt. Ltd. by email or courier. Work will commence upon execution of this agreement. Monthly invoicing will follow as per the agreed payment schedule.`,
    collapsed: true,
  },
];

const initialState: ProposalState = {
  clientName: 'MDIndia Health Insurance TPA Pvt. Ltd.',
  clientAddress: 'Mezzanine Floor, Ballard House, Adi Marzban Path\nBallard Estate, Fort, Mumbai - 400001',
  projectTitle: 'Document Scanning Services',
  date: today(),
  refNumber: 'HNV-SCAN-2026-001',
  validUntil: '30 Days from Date of Issue',
  pricingRows: DEFAULT_PRICING_ROWS,
  pricingNote: DEFAULT_PRICING_NOTE,
  sections: DEFAULT_SECTIONS,
};

interface ProposalActions {
  setClientName: (name: string) => void;
  setClientAddress: (address: string) => void;
  setProjectTitle: (title: string) => void;
  setDate: (date: string) => void;
  setRefNumber: (ref: string) => void;
  setValidUntil: (val: string) => void;
  setPricingNote: (note: string) => void;
  addPricingRow: () => void;
  removePricingRow: (id: string) => void;
  updatePricingRow: (id: string, field: keyof PricingRow, value: string) => void;
  updateSection: (id: string, content: string) => void;
  toggleCollapse: (id: string) => void;
  reset: () => void;
}

export const useProposalStore = create<ProposalState & ProposalActions>()(
  persist(
    (set) => ({
      ...initialState,
      setClientName: (clientName) => set({ clientName }),
      setClientAddress: (clientAddress) => set({ clientAddress }),
      setProjectTitle: (projectTitle) => set({ projectTitle }),
      setDate: (date) => set({ date }),
      setRefNumber: (refNumber) => set({ refNumber }),
      setValidUntil: (validUntil) => set({ validUntil }),
      setPricingNote: (pricingNote) => set({ pricingNote }),
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
      toggleCollapse: (id) =>
        set((s) => ({
          sections: s.sections.map((sec) =>
            sec.id === id ? { ...sec, collapsed: !sec.collapsed } : sec
          ),
        })),
      reset: () => set({
        ...initialState,
        pricingRows: DEFAULT_PRICING_ROWS.map((r) => ({ ...r })),
        sections: DEFAULT_SECTIONS.map((s) => ({ ...s })),
      }),
    }),
    { name: 'hnv:proposal' }
  )
);
