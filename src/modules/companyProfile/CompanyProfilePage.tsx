import { useRef } from 'react';
import { useCompanyProfileStore } from '../../store/useCompanyProfileStore';
import { Button } from '../../components/shared/Button';
import { generatePdf } from '../../lib/pdf';
import css from './CompanyProfile.module.css';

type TableType = 'serviceRows' | 'industryRows' | 'clientRows' | 'differentiatorRows' | 'engagementRows';

export function CompanyProfilePage() {
  const store = useCompanyProfileStore();
  const docRef = useRef<HTMLDivElement>(null);

  const handlePdf = async () => {
    if (docRef.current) {
      docRef.current.querySelectorAll('[data-no-print]').forEach((el) => {
        (el as HTMLElement).style.display = 'none';
      });
      docRef.current.querySelectorAll('[contenteditable]').forEach((el) => {
        el.removeAttribute('contenteditable');
      });
      await generatePdf(docRef.current, 'HNV_Corporate_Profile.pdf');
      window.location.reload();
    }
  };

  /** ContentEditable cell for tables — wraps text, shows full content in PDF */
  const Cell = ({
    value,
    table,
    rowId,
    field,
    placeholder,
  }: {
    value: string;
    table: TableType;
    rowId: string;
    field: string;
    placeholder?: string;
  }) => (
    <div
      className={css.cellText}
      contentEditable
      suppressContentEditableWarning
      data-placeholder={placeholder}
      onBlur={(e) => {
        const newVal = e.currentTarget.textContent || '';
        if (newVal !== value) store.updateTableCell(table, rowId, field, newVal);
      }}
      dangerouslySetInnerHTML={{ __html: value }}
    />
  );

  /** Render formatted text with bullets, sub-headings, checks, process steps */
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];

    lines.forEach((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) {
        elements.push(<div key={i} style={{ height: 8 }} />);
      } else if (trimmed.startsWith('\u2022')) {
        elements.push(
          <div key={i} className={css.bulletLine}>{trimmed.substring(1).trim()}</div>
        );
      } else if (trimmed.startsWith('\u2713')) {
        elements.push(
          <div key={i} className={css.checkLine}>{trimmed}</div>
        );
      } else if (/^\d{2}\s*\|/.test(trimmed)) {
        const parts = trimmed.split('\u2014');
        elements.push(
          <div key={i} style={{ marginBottom: 6 }}>
            <span className={css.processStep}>{parts[0].trim()}</span>
            {parts.length > 1 && <span> \u2014 {parts.slice(1).join('\u2014').trim()}</span>}
          </div>
        );
      } else if (
        /^(Our Vision|Our Mission|Scanning Infrastructure|Software & AI|Security & Compliance)/.test(trimmed)
      ) {
        elements.push(
          <div key={i} className={css.subHeading}>{trimmed}</div>
        );
      } else {
        elements.push(
          <div key={i} style={{ marginBottom: 2 }}>{trimmed}</div>
        );
      }
    });

    return <>{elements}</>;
  };

  const getSection = (id: string) => store.sections.find((s) => s.id === id);

  /** Render an inline-editable text section */
  const TextSection = ({ id }: { id: string }) => {
    const section = getSection(id);
    if (!section) return null;
    return (
      <div className={css.section}>
        <div className={css.sectionTitle}>{section.title}</div>
        <div
          className={`${css.sectionContent} ${css.editableContent}`}
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => {
            const newVal = e.currentTarget.innerText;
            if (newVal !== section.content) store.updateSection(section.id, newVal);
          }}
        >
          {renderFormattedText(section.content)}
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Header bar */}
      <div className={css.headerBar}>
        <div className={css.headerLeft}>
          <div className={css.headerLogo}>HNV</div>
          <div className={css.headerInfo}>
            <div className={css.headerTitle}>Company Profile Editor</div>
            <div className={css.headerSub}>Click any text on the document to edit in place</div>
          </div>
        </div>
        <div className={css.headerActions}>
          <Button variant="ghost" onClick={() => store.reset()}>Reset</Button>
          <Button variant="ghost" onClick={() => window.print()}>Print</Button>
          <Button onClick={handlePdf}>Download PDF</Button>
        </div>
      </div>

      {/* Document */}
      <div ref={docRef} className={css.document}>
        {/* Cover page */}
        <div className={css.coverPage}>
          <div className={css.coverAccent} />
          <div className={css.coverCompany}>HNV TECHNO SOLUTIONS</div>
          <div className={css.coverTagline}>Enterprise Document Digitization & Information Management</div>
          <div className={css.coverDivider} />
          <div className={css.coverLabel}>C O R P O R A T E</div>
          <div className={css.coverTitle}>P R O F I L E</div>
          <div className={css.coverSubtitle}>Confidential | FY 2025{'\u2013'}26</div>

          <div className={css.statsBar}>
            <div className={css.statItem}>
              <div className={css.statValue}>15+</div>
              <div className={css.statLabel}>YEARS</div>
            </div>
            <div className={css.statItem}>
              <div className={css.statValue}>7+</div>
              <div className={css.statLabel}>INDUSTRIES</div>
            </div>
            <div className={css.statItem}>
              <div className={css.statValue}>500+</div>
              <div className={css.statLabel}>CLIENTS</div>
            </div>
            <div className={css.statItem}>
              <div className={css.statValue}>50M+</div>
              <div className={css.statLabel}>PAGES DIGITIZED</div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className={css.body}>
          <TextSection id="about" />
          <TextSection id="vision" />

          {/* Core Service Portfolio */}
          <div className={css.section}>
            <div className={css.sectionTitle}>Core Service Portfolio</div>
            <table className={css.dataTable}>
              <thead>
                <tr>
                  <th style={{ width: '28%' }}>Service</th>
                  <th>Description</th>
                  <th data-no-print style={{ width: 36, background: 'transparent' }} />
                </tr>
              </thead>
              <tbody>
                {store.serviceRows.map((row) => (
                  <tr key={row.id}>
                    <td><Cell value={row.service} table="serviceRows" rowId={row.id} field="service" placeholder="Service" /></td>
                    <td><Cell value={row.description} table="serviceRows" rowId={row.id} field="description" placeholder="Description" /></td>
                    <td data-no-print style={{ textAlign: 'center', border: 'none', background: 'transparent', verticalAlign: 'middle' }}>
                      <button className={css.removeRowBtn} onClick={() => store.removeTableRow('serviceRows', row.id)}>&times;</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div data-no-print style={{ marginTop: 8 }}>
              <button className={css.addRowBtn} onClick={() => store.addTableRow('serviceRows')}>+ Add Service</button>
            </div>
          </div>

          {/* Industry Verticals */}
          <div className={css.section}>
            <div className={css.sectionTitle}>Industry Verticals</div>
            <div className={css.tableIntro}>
              Our solutions are purpose-built for the compliance, security, and operational requirements of each industry we serve.
            </div>
            <table className={css.dataTable}>
              <thead>
                <tr>
                  <th style={{ width: '22%' }}>Industry</th>
                  <th>Key Capabilities</th>
                  <th data-no-print style={{ width: 36, background: 'transparent' }} />
                </tr>
              </thead>
              <tbody>
                {store.industryRows.map((row) => (
                  <tr key={row.id}>
                    <td><Cell value={row.industry} table="industryRows" rowId={row.id} field="industry" placeholder="Industry" /></td>
                    <td><Cell value={row.capabilities} table="industryRows" rowId={row.id} field="capabilities" placeholder="Key capabilities" /></td>
                    <td data-no-print style={{ textAlign: 'center', border: 'none', background: 'transparent', verticalAlign: 'middle' }}>
                      <button className={css.removeRowBtn} onClick={() => store.removeTableRow('industryRows', row.id)}>&times;</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div data-no-print style={{ marginTop: 8 }}>
              <button className={css.addRowBtn} onClick={() => store.addTableRow('industryRows')}>+ Add Industry</button>
            </div>
          </div>

          <TextSection id="technology" />
          <TextSection id="process" />

          {/* Why HNV */}
          <div className={css.section}>
            <div className={css.sectionTitle}>Why HNV Techno Solutions</div>
            <div className={css.tableIntro}>
              In a market crowded with general-purpose scanning vendors, HNV Techno Solutions stands apart through a combination of deep industry specialization, technology-forward approach, and an uncompromising commitment to quality and security.
            </div>
            <table className={css.dataTable}>
              <thead>
                <tr>
                  <th style={{ width: '28%' }}>Differentiator</th>
                  <th>Our Advantage</th>
                  <th data-no-print style={{ width: 36, background: 'transparent' }} />
                </tr>
              </thead>
              <tbody>
                {store.differentiatorRows.map((row) => (
                  <tr key={row.id}>
                    <td><Cell value={row.differentiator} table="differentiatorRows" rowId={row.id} field="differentiator" placeholder="Differentiator" /></td>
                    <td><Cell value={row.advantage} table="differentiatorRows" rowId={row.id} field="advantage" placeholder="Our advantage" /></td>
                    <td data-no-print style={{ textAlign: 'center', border: 'none', background: 'transparent', verticalAlign: 'middle' }}>
                      <button className={css.removeRowBtn} onClick={() => store.removeTableRow('differentiatorRows', row.id)}>&times;</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div data-no-print style={{ marginTop: 8 }}>
              <button className={css.addRowBtn} onClick={() => store.addTableRow('differentiatorRows')}>+ Add Row</button>
            </div>
          </div>

          {/* Our Clients */}
          <div className={css.section}>
            <div className={css.sectionTitle}>Our Clients</div>
            <div className={css.tableIntro}>
              We are proud to have served a distinguished portfolio of clients across Banking, Legal, Pharmaceuticals, Manufacturing, and Financial Services sectors.
            </div>
            <table className={css.dataTable}>
              <thead>
                <tr>
                  <th style={{ width: 40 }}>#</th>
                  <th>Client Name</th>
                  <th style={{ width: '28%' }}>Sector</th>
                  <th data-no-print style={{ width: 36, background: 'transparent' }} />
                </tr>
              </thead>
              <tbody>
                {store.clientRows.map((row, idx) => (
                  <tr key={row.id}>
                    <td style={{ textAlign: 'center', fontSize: 11, color: '#888', verticalAlign: 'middle' }}>{idx + 1}</td>
                    <td><Cell value={row.clientName} table="clientRows" rowId={row.id} field="clientName" placeholder="Client name" /></td>
                    <td><Cell value={row.sector} table="clientRows" rowId={row.id} field="sector" placeholder="Sector" /></td>
                    <td data-no-print style={{ textAlign: 'center', border: 'none', background: 'transparent', verticalAlign: 'middle' }}>
                      <button className={css.removeRowBtn} onClick={() => store.removeTableRow('clientRows', row.id)}>&times;</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div data-no-print style={{ marginTop: 8 }}>
              <button className={css.addRowBtn} onClick={() => store.addTableRow('clientRows')}>+ Add Client</button>
            </div>

            {/* Key Performance Metrics */}
            <div className={css.metricsGrid}>
              <div className={css.metricItem}>
                <div className={css.metricValue}>50 Million+</div>
                <div className={css.metricLabel}>Pages Successfully Digitized</div>
              </div>
              <div className={css.metricItem}>
                <div className={css.metricValue}>500+</div>
                <div className={css.metricLabel}>Enterprise Clients Served</div>
              </div>
              <div className={css.metricItem}>
                <div className={css.metricValue}>99.95%+</div>
                <div className={css.metricLabel}>Data Accuracy Rate</div>
              </div>
              <div className={css.metricItem}>
                <div className={css.metricValue}>100,000+</div>
                <div className={css.metricLabel}>Pages/Day Production Capacity</div>
              </div>
              <div className={css.metricItem}>
                <div className={css.metricValue}>15+</div>
                <div className={css.metricLabel}>Years of Industry Experience</div>
              </div>
              <div className={css.metricItem}>
                <div className={css.metricValue}>7+</div>
                <div className={css.metricLabel}>Regulated Industry Verticals</div>
              </div>
            </div>
          </div>

          <TextSection id="certifications" />

          {/* Engagement Models */}
          <div className={css.section}>
            <div className={css.sectionTitle}>Engagement Models</div>
            <div className={css.tableIntro}>
              We offer flexible engagement frameworks designed to accommodate varying project sizes, security requirements, and organizational preferences.
            </div>
            <table className={css.dataTable}>
              <thead>
                <tr>
                  <th style={{ width: '18%' }}>Model</th>
                  <th>Best For</th>
                  <th>Key Features</th>
                  <th data-no-print style={{ width: 36, background: 'transparent' }} />
                </tr>
              </thead>
              <tbody>
                {store.engagementRows.map((row) => (
                  <tr key={row.id}>
                    <td><Cell value={row.model} table="engagementRows" rowId={row.id} field="model" placeholder="Model" /></td>
                    <td><Cell value={row.bestFor} table="engagementRows" rowId={row.id} field="bestFor" placeholder="Best for" /></td>
                    <td><Cell value={row.features} table="engagementRows" rowId={row.id} field="features" placeholder="Key features" /></td>
                    <td data-no-print style={{ textAlign: 'center', border: 'none', background: 'transparent', verticalAlign: 'middle' }}>
                      <button className={css.removeRowBtn} onClick={() => store.removeTableRow('engagementRows', row.id)}>&times;</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div data-no-print style={{ marginTop: 8 }}>
              <button className={css.addRowBtn} onClick={() => store.addTableRow('engagementRows')}>+ Add Model</button>
            </div>
          </div>

          <TextSection id="contact" />
        </div>

        {/* Footer */}
        <div className={css.footer}>
          <span className={css.footerGold}>HNV Techno Solutions</span>
          <br />
          Enterprise Document Digitization & Information Management
          <br />
          Email: info@hnvtechno.com | Phone: +91 XXXXX XXXXX
          <br />
          Website: www.hnvtechno.com
          <div className={css.footerCopyright}>
            &copy; 2025 HNV Techno Solutions. All rights reserved. This document is confidential and intended solely for the use of the intended recipient.
          </div>
        </div>
      </div>
    </div>
  );
}
