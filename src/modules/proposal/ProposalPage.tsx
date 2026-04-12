import { useRef, useCallback } from 'react';
import { useProposalStore } from '../../store/useProposalStore';
import { Button } from '../../components/shared/Button';
import { generatePdf } from '../../lib/pdf';
import css from './ProposalPreview.module.css';

export function ProposalPage() {
  const store = useProposalStore();
  const docRef = useRef<HTMLDivElement>(null);

  const handlePdf = async () => {
    if (docRef.current) {
      // Hide editing UI for PDF
      docRef.current.querySelectorAll('[data-no-print]').forEach((el) => {
        (el as HTMLElement).style.display = 'none';
      });
      docRef.current.querySelectorAll('[contenteditable]').forEach((el) => {
        el.removeAttribute('contenteditable');
      });
      await generatePdf(docRef.current, `${store.refNumber}_Proposal.pdf`);
      // Restore
      window.location.reload();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  /** Replace {{clientName}} in content */
  const replacePlaceholders = useCallback(
    (text: string) =>
      text.replace(/\{\{clientName\}\}/g, store.clientName || '[Client Name]'),
    [store.clientName]
  );

  /** Definition list terms for Section 9 */
  const DL_TERMS = ['Billing Cycle', 'Payment Due', 'Payment Mode', 'Taxes', 'Minimum Monthly Billing', 'Late Payment'];

  /** Render section content with bullet styling and sub-headings */
  const renderFormattedText = (text: string) => {
    const resolved = replacePlaceholders(text);
    const lines = resolved.split('\n');
    const elements: React.ReactNode[] = [];

    lines.forEach((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) {
        elements.push(<div key={i} style={{ height: 8 }} />);
      } else if (trimmed.startsWith('\u2022')) {
        elements.push(
          <div key={i} className={css.bulletLine}>
            {trimmed.substring(1).trim()}
          </div>
        );
      } else if (
        /^\d+\.\d+\s/.test(trimmed) ||
        /^(Document Management|Software Development|Software Support|Why HNV)/.test(trimmed)
      ) {
        elements.push(
          <div key={i} className={css.subHeading}>
            {trimmed}
          </div>
        );
      } else if (DL_TERMS.includes(trimmed)) {
        elements.push(
          <div key={i} className={css.dlTerm}>
            {trimmed}
          </div>
        );
      } else {
        elements.push(
          <div key={i} style={{ marginBottom: 2 }}>
            {trimmed}
          </div>
        );
      }
    });

    return <>{elements}</>;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '--';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  /** Helper for inline contentEditable span */
  const Editable = ({
    value,
    onChange,
    tag: Tag = 'span',
    className,
    style,
    multiline,
  }: {
    value: string;
    onChange: (v: string) => void;
    tag?: 'span' | 'div';
    className?: string;
    style?: React.CSSProperties;
    multiline?: boolean;
  }) => (
    <Tag
      className={`${css.editable} ${className || ''}`}
      contentEditable
      suppressContentEditableWarning
      style={style}
      onBlur={(e) => {
        const el = e.currentTarget;
        const newVal = multiline ? el.innerText : el.textContent || '';
        if (newVal !== value) onChange(newVal);
      }}
      dangerouslySetInnerHTML={{ __html: multiline ? value.replace(/\n/g, '<br>') : value }}
    />
  );

  return (
    <div>
      {/* Header bar */}
      <div className={css.headerBar}>
        <div className={css.headerLeft}>
          <div className={css.headerLogo}>HNV</div>
          <div className={css.headerInfo}>
            <div className={css.headerTitle}>Proposal Editor</div>
            <div className={css.headerSub}>Click any text on the document to edit in place</div>
          </div>
        </div>
        <div className={css.headerActions}>
          <Button variant="ghost" onClick={() => store.reset()}>Reset</Button>
          <Button variant="ghost" onClick={handlePrint}>Print</Button>
          <Button onClick={handlePdf}>Download PDF</Button>
        </div>
      </div>

      {/* Document preview — everything is inline-editable */}
      <div ref={docRef} className={css.document}>
        {/* Cover page */}
        <div className={css.coverPage}>
          <div className={css.coverAccent} />
          <div className={css.coverLogo}>HNV Techno Solutions Pvt. Ltd.</div>
          <div className={css.coverTitle}>
            <Editable
              value={store.projectTitle.toUpperCase()}
              onChange={(v) => store.setProjectTitle(v)}
            />
          </div>
          <div className={css.coverSubtitle}>Service Proposal</div>
          <div className={css.coverDivider} />
          <div className={css.coverMeta}>
            <div className={css.coverMetaGroup}>
              <span className={css.coverMetaLabel}>Prepared for</span>
              <Editable value={store.clientName || '[Client Name]'} onChange={store.setClientName} />
              <Editable
                value={store.clientAddress}
                onChange={store.setClientAddress}
                tag="div"
                multiline
                style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}
              />
            </div>
            <div className={css.coverMetaGroup}>
              <span className={css.coverMetaLabel}>Prepared by</span>
              <span>HNV Techno Solutions Pvt. Ltd.</span>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>
                Mahape, Navi Mumbai, Maharashtra
                <br />
                GST: 27AAICH4615H1ZK &nbsp;|&nbsp; CIN: U62099MH2026PTC467022
              </div>
            </div>
            <div className={css.coverMetaRow}>
              <div>
                <span className={css.coverMetaLabel}>Date:</span>{' '}
                <input
                  type="date"
                  value={store.date}
                  onChange={(e) => store.setDate(e.target.value)}
                  className={css.inlineDateInput}
                />
                <span style={{ marginLeft: 8, fontSize: 12, opacity: 0.7 }}>({formatDate(store.date)})</span>
              </div>
              <div>
                <span className={css.coverMetaLabel}>Proposal No:</span>{' '}
                <Editable value={store.refNumber} onChange={store.setRefNumber} />
              </div>
              <div>
                <span className={css.coverMetaLabel}>Valid Until:</span>{' '}
                <Editable value={store.validUntil} onChange={store.setValidUntil} />
              </div>
            </div>
          </div>
        </div>

        {/* Body sections */}
        <div className={css.body}>
          {store.sections.map((section, idx) => (
            <div key={section.id}>
              {/* Insert pricing section after scope (section 4, index 3) */}
              {idx === 4 && (
                <div className={css.section}>
                  <div className={css.sectionHeader}>
                    <div className={css.sectionTitle}>5. Pricing</div>
                  </div>
                  <div className={css.sectionContent}>
                    <div style={{ marginBottom: 12 }}>
                      Our pricing is based on a per-image model. All document preparation and document operations are included in the per-image rate.
                    </div>

                    <table className={css.pricingTable}>
                      <thead>
                        <tr>
                          <th>Service</th>
                          <th>Rate</th>
                          <th>Unit</th>
                          <th>Remarks</th>
                          <th data-no-print style={{ width: 36, background: 'transparent', border: 'none' }} />
                        </tr>
                      </thead>
                      <tbody>
                        {store.pricingRows.map((row) => (
                          <tr key={row.id}>
                            <td>
                              <div
                                className={css.cellText}
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => {
                                  const v = e.currentTarget.textContent || '';
                                  if (v !== row.service) store.updatePricingRow(row.id, 'service', v);
                                }}
                                dangerouslySetInnerHTML={{ __html: row.service }}
                              />
                            </td>
                            <td>
                              <div
                                className={css.cellText}
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => {
                                  const v = e.currentTarget.textContent || '';
                                  if (v !== row.rate) store.updatePricingRow(row.id, 'rate', v);
                                }}
                                dangerouslySetInnerHTML={{ __html: row.rate }}
                              />
                            </td>
                            <td>
                              <div
                                className={css.cellText}
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => {
                                  const v = e.currentTarget.textContent || '';
                                  if (v !== row.unit) store.updatePricingRow(row.id, 'unit', v);
                                }}
                                dangerouslySetInnerHTML={{ __html: row.unit }}
                              />
                            </td>
                            <td>
                              <div
                                className={css.cellText}
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => {
                                  const v = e.currentTarget.textContent || '';
                                  if (v !== row.remarks) store.updatePricingRow(row.id, 'remarks', v);
                                }}
                                dangerouslySetInnerHTML={{ __html: row.remarks }}
                              />
                            </td>
                            <td data-no-print style={{ textAlign: 'center', border: 'none', background: 'transparent' }}>
                              <button
                                className={css.removeRowBtn}
                                onClick={() => store.removePricingRow(row.id)}
                                title="Remove row"
                              >
                                &times;
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div data-no-print style={{ marginTop: 8, marginBottom: 12 }}>
                      <button className={css.addRowBtn} onClick={() => store.addPricingRow()}>
                        + Add Service Row
                      </button>
                    </div>

                    {/* Editable pricing note */}
                    <div
                      className={css.pricingNote}
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        const newVal = e.currentTarget.innerText;
                        if (newVal !== store.pricingNote) store.setPricingNote(newVal);
                      }}
                      dangerouslySetInnerHTML={{ __html: store.pricingNote.replace(/\n/g, '<br>') }}
                    />
                  </div>
                </div>
              )}

              {/* Regular section — inline editable */}
              <div className={css.section}>
                <div className={css.sectionHeader}>
                  <div className={css.sectionTitle}>{section.title}</div>
                </div>
                <div
                  className={`${css.sectionContent} ${css.editableContent}`}
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const newVal = e.currentTarget.innerText;
                    if (newVal !== section.content) {
                      store.updateSection(section.id, newVal);
                    }
                  }}
                >
                  {renderFormattedText(replacePlaceholders(section.content))}
                </div>
              </div>
            </div>
          ))}

          {/* Signature blocks — matching DOCX */}
          <div className={css.signatureArea}>
            <div className={css.signatureBlock}>
              <div className={css.signatureLabel}>For: HNV Techno Solutions Pvt. Ltd.</div>
              <div className={css.signatureLine} />
              <div className={css.signatureCaption}>Authorized Signatory</div>
              <div className={css.signatureField}>Name: ___________________________</div>
              <div className={css.signatureField}>Designation: ____________________</div>
              <div className={css.signatureField}>Date: ___________________________</div>
              <div className={css.signatureField}>Company Seal:</div>
            </div>
            <div className={css.signatureBlock}>
              <div className={css.signatureLabel}>For: {store.clientName || '[Client Name]'}</div>
              <div className={css.signatureLine} />
              <div className={css.signatureCaption}>Authorized Signatory</div>
              <div className={css.signatureField}>Name: ___________________________</div>
              <div className={css.signatureField}>Designation: ____________________</div>
              <div className={css.signatureField}>Date: ___________________________</div>
              <div className={css.signatureField}>Company Seal:</div>
            </div>
          </div>
        </div>

        {/* Footer — matching DOCX */}
        <div className={css.footer}>
          <div className={css.footerLabel}>For queries, please contact:</div>
          <span className={css.footerGold}>HNV Techno Solutions Pvt. Ltd.</span>
          <br />
          Mahape, Navi Mumbai, Maharashtra
          <br />
          GST: 27AAICH4615H1ZK &nbsp;|&nbsp; CIN: U62099MH2026PTC467022
          <br />
          Email: info@hnvtechno.com &nbsp;|&nbsp; Phone: +91 XXXXX XXXXX
        </div>
      </div>
    </div>
  );
}
