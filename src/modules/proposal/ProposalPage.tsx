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
      docRef.current.querySelectorAll('[data-no-print]').forEach((el) => {
        (el as HTMLElement).style.display = 'none';
      });
      docRef.current.querySelectorAll('[contenteditable]').forEach((el) => {
        el.removeAttribute('contenteditable');
      });
      await generatePdf(docRef.current, `${store.refNumber}_Proposal.pdf`);
      window.location.reload();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const replacePlaceholders = useCallback(
    (text: string) =>
      text
        .replace(/\{\{clientName\}\}/g, store.clientName || '[Client Name]')
        .replace(/\{\{companyName\}\}/g, store.companyName || '[Company Name]'),
    [store.clientName, store.companyName]
  );

  const DL_TERMS = ['Billing Cycle', 'Payment Due', 'Payment Mode', 'Taxes', 'Minimum Monthly Billing', 'Late Payment'];

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
        trimmed.endsWith(':') ||
        /^[A-Z][A-Za-z\s&,\-()]+$/.test(trimmed) && trimmed.length < 80 && trimmed.split(' ').length <= 10
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

  /** Count enabled sections for numbering in export */
  const enabledSections = store.sections.filter((s) => s.enabled);
  const enabledCount = enabledSections.length + (store.pricingEnabled ? 1 : 0);

  return (
    <div className={css.pageLayout}>
      {/* Left: Section control panel */}
      <div className={css.controlPanel} data-no-print>
        <div className={css.controlHeader}>Sections</div>
        <div className={css.controlHint}>Toggle sections to include in export</div>

        <label className={css.checkItem}>
          <input
            type="checkbox"
            checked={store.coverEnabled}
            onChange={() => store.setCoverEnabled(!store.coverEnabled)}
          />
          <span>Cover Page</span>
        </label>

        {store.sections.map((section) => (
          <label key={section.id} className={css.checkItem}>
            <input
              type="checkbox"
              checked={section.enabled}
              onChange={() => store.toggleSectionEnabled(section.id)}
            />
            <span>{section.title}</span>
          </label>
        ))}

        <label className={css.checkItem}>
          <input
            type="checkbox"
            checked={store.pricingEnabled}
            onChange={() => store.setPricingEnabled(!store.pricingEnabled)}
          />
          <span>Pricing</span>
        </label>

        <label className={css.checkItem}>
          <input
            type="checkbox"
            checked={store.signatureEnabled}
            onChange={() => store.setSignatureEnabled(!store.signatureEnabled)}
          />
          <span>Signature Block</span>
        </label>

        <label className={css.checkItem}>
          <input
            type="checkbox"
            checked={store.footerEnabled}
            onChange={() => store.setFooterEnabled(!store.footerEnabled)}
          />
          <span>Footer</span>
        </label>

        <div className={css.controlDivider} />

        <button className={css.addSectionBtn} onClick={() => store.addSection()}>
          + Add Section
        </button>

        <div className={css.controlStats}>
          {enabledCount} of {store.sections.length + 4} sections selected
        </div>
      </div>

      {/* Right: Document */}
      <div className={css.docArea}>
        {/* Header bar */}
        <div className={css.headerBar} data-no-print>
          <div className={css.headerLeft}>
            <div className={css.headerLogo}>PRO</div>
            <div className={css.headerInfo}>
              <div className={css.headerTitle}>Proposal Editor</div>
              <div className={css.headerSub}>Click any text to edit &bull; Toggle sections from the left panel</div>
            </div>
          </div>
          <div className={css.headerActions}>
            <Button variant="ghost" onClick={() => store.reset()}>Reset</Button>
            <Button variant="ghost" onClick={handlePrint}>Print</Button>
            <Button onClick={handlePdf}>Download PDF</Button>
          </div>
        </div>

        <div ref={docRef} className={css.document}>
          {/* Cover page */}
          {store.coverEnabled && (
            <div className={css.coverPage}>
              <div className={css.coverAccent} />
              <div className={css.coverLogo}>
                <Editable value={store.companyName} onChange={store.setCompanyName} />
              </div>
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
                  <Editable value={store.companyName} onChange={store.setCompanyName} />
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>
                    <Editable
                      value={store.companyAddress}
                      onChange={store.setCompanyAddress}
                      tag="div"
                      multiline
                    />
                    {(store.companyGst || store.companyCin) && (
                      <div style={{ marginTop: 2 }}>
                        {store.companyGst && <>GST: <Editable value={store.companyGst} onChange={store.setCompanyGst} /></>}
                        {store.companyGst && store.companyCin && <>&nbsp;|&nbsp;</>}
                        {store.companyCin && <>CIN: <Editable value={store.companyCin} onChange={store.setCompanyCin} /></>}
                      </div>
                    )}
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
          )}

          {/* Body sections */}
          <div className={css.body}>
            {store.sections.map((section) => {
              if (!section.enabled) return null;

              return (
                <div key={section.id}>
                  <div className={css.section}>
                    <div className={css.sectionHeader}>
                      <div
                        className={`${css.sectionTitle} ${css.editable}`}
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => {
                          const v = e.currentTarget.textContent || '';
                          if (v !== section.title) store.updateSectionTitle(section.id, v);
                        }}
                      >
                        {section.title}
                      </div>
                      <button
                        data-no-print
                        className={css.removeRowBtn}
                        onClick={() => store.removeSection(section.id)}
                        title="Remove section"
                        style={{ marginLeft: 8 }}
                      >
                        &times;
                      </button>
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
              );
            })}

            {/* Pricing section */}
            {store.pricingEnabled && (
              <div className={css.section}>
                <div className={css.sectionHeader}>
                  <div className={css.sectionTitle}>Pricing</div>
                </div>
                <div className={css.sectionContent}>
                  <div style={{ marginBottom: 12 }}>
                    <div
                      className={css.editableContent}
                      contentEditable
                      suppressContentEditableWarning
                      style={{ display: 'inline' }}
                    >
                      Our pricing for the proposed engagement is as follows:
                    </div>
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

            {/* Signature blocks */}
            {store.signatureEnabled && (
              <div className={css.signatureArea}>
                <div className={css.signatureBlock}>
                  <div className={css.signatureLabel}>
                    For: <Editable value={store.companyName} onChange={store.setCompanyName} />
                  </div>
                  <div className={css.signatureLine} />
                  <div className={css.signatureCaption} contentEditable suppressContentEditableWarning>Authorized Signatory</div>
                  <div className={css.signatureField} contentEditable suppressContentEditableWarning>Name: ___________________________</div>
                  <div className={css.signatureField} contentEditable suppressContentEditableWarning>Designation: ____________________</div>
                  <div className={css.signatureField} contentEditable suppressContentEditableWarning>Date: ___________________________</div>
                  <div className={css.signatureField} contentEditable suppressContentEditableWarning>Company Seal:</div>
                </div>
                <div className={css.signatureBlock}>
                  <div className={css.signatureLabel}>
                    For: <Editable value={store.clientName || '[Client Name]'} onChange={store.setClientName} />
                  </div>
                  <div className={css.signatureLine} />
                  <div className={css.signatureCaption} contentEditable suppressContentEditableWarning>Authorized Signatory</div>
                  <div className={css.signatureField} contentEditable suppressContentEditableWarning>Name: ___________________________</div>
                  <div className={css.signatureField} contentEditable suppressContentEditableWarning>Designation: ____________________</div>
                  <div className={css.signatureField} contentEditable suppressContentEditableWarning>Date: ___________________________</div>
                  <div className={css.signatureField} contentEditable suppressContentEditableWarning>Company Seal:</div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {store.footerEnabled && (
            <div className={css.footer}>
              <div className={css.footerLabel}>For queries, please contact:</div>
              <span className={css.footerGold}>
                <Editable value={store.companyName} onChange={store.setCompanyName} />
              </span>
              <br />
              <Editable value={store.companyAddress} onChange={store.setCompanyAddress} />
              <br />
              GST: <Editable value={store.companyGst || '—'} onChange={store.setCompanyGst} />
              &nbsp;|&nbsp;
              CIN: <Editable value={store.companyCin || '—'} onChange={store.setCompanyCin} />
              <br />
              Email: <Editable value={store.companyEmail} onChange={store.setCompanyEmail} />
              &nbsp;|&nbsp;
              Phone: <Editable value={store.companyPhone} onChange={store.setCompanyPhone} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
