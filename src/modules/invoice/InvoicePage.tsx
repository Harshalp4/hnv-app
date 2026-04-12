import { useRef, useState, useEffect } from 'react';
import { useInvoiceStore } from '../../store/useInvoiceStore';
import { useClientHistoryStore } from '../../store/useClientHistoryStore';
import { StepperWizard } from '../../components/shared/StepperWizard';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';
import { FormField, inputClass, textareaClass } from '../../components/shared/FormField';
import { SectionLabel } from '../../components/shared/SectionLabel';
import { generatePdf } from '../../lib/pdf';
import { formatINR, numberToWordsIndian } from '../../lib/indianFormat';
import { generateMailtoLink, copyToClipboard } from '../../lib/emailHelper';
import type { GstType } from '../../types/quotation';
import css from './InvoicePreview.module.css';

const STEPS = ['Client info', 'Line items', 'Config', 'Preview', 'Email'];

export function InvoicePage() {
  const store = useInvoiceStore();
  const addEntry = useClientHistoryStore((s) => s.addEntry);
  const previewRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const subtotal = store.lineItems.reduce((sum, item) => sum + item.qty * item.rate, 0);
  const gstAmount = subtotal * store.gstRate / 100;
  const grandTotal = subtotal + gstAmount;

  const fmtDate = (d: string) => {
    if (!d) return '';
    const dt = new Date(d);
    return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // ─── Step 1: Client / Invoice Meta ───────────────────────
  const step1 = (
    <Card title="Invoice &amp; Buyer Information" step={1}>
      <SectionLabel first>Seller Details</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <FormField label="Company name">
          <input className={inputClass} value={store.seller.companyName} onChange={(e) => store.setSeller({ companyName: e.target.value })} />
        </FormField>
        <FormField label="GSTIN">
          <input className={inputClass} value={store.seller.gstin} onChange={(e) => store.setSeller({ gstin: e.target.value })} />
        </FormField>
      </div>
      <FormField label="Address">
        <textarea className={textareaClass} value={store.seller.address} onChange={(e) => store.setSeller({ address: e.target.value })} style={{ height: 50 }} />
      </FormField>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        <FormField label="State Name">
          <input className={inputClass} value={store.seller.stateName} onChange={(e) => store.setSeller({ stateName: e.target.value })} />
        </FormField>
        <FormField label="State Code">
          <input className={inputClass} value={store.seller.stateCode} onChange={(e) => store.setSeller({ stateCode: e.target.value })} />
        </FormField>
        <FormField label="PAN">
          <input className={inputClass} value={store.seller.pan} onChange={(e) => store.setSeller({ pan: e.target.value })} />
        </FormField>
      </div>

      <SectionLabel>Buyer Details</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <FormField label="Company name *">
          <input className={inputClass} value={store.buyer.companyName} onChange={(e) => store.setBuyer({ companyName: e.target.value })} placeholder="Buyer company" />
        </FormField>
        <FormField label="GSTIN">
          <input className={inputClass} value={store.buyer.gstin} onChange={(e) => store.setBuyer({ gstin: e.target.value })} placeholder="27XXXXX0000X1Z0" />
        </FormField>
      </div>
      <FormField label="Address">
        <textarea className={textareaClass} value={store.buyer.address} onChange={(e) => store.setBuyer({ address: e.target.value })} style={{ height: 50 }} placeholder="Full address" />
      </FormField>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <FormField label="State Name">
          <input className={inputClass} value={store.buyer.stateName} onChange={(e) => store.setBuyer({ stateName: e.target.value })} placeholder="Maharashtra" />
        </FormField>
        <FormField label="State Code">
          <input className={inputClass} value={store.buyer.stateCode} onChange={(e) => store.setBuyer({ stateCode: e.target.value })} placeholder="27" />
        </FormField>
      </div>

      <SectionLabel>Invoice Metadata</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        <FormField label="Invoice No *">
          <input className={inputClass} value={store.meta.invoiceNo} onChange={(e) => store.setMeta({ invoiceNo: e.target.value })} placeholder="HNV/001/26-27" />
        </FormField>
        <FormField label="Invoice Date *">
          <input className={inputClass} type="date" value={store.meta.invoiceDate} onChange={(e) => store.setMeta({ invoiceDate: e.target.value })} />
        </FormField>
        <FormField label="Mode/Terms of Payment">
          <input className={inputClass} value={store.meta.paymentTerms} onChange={(e) => store.setMeta({ paymentTerms: e.target.value })} placeholder="e.g. Net 30 days" />
        </FormField>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <FormField label="Buyer's Order No">
          <input className={inputClass} value={store.meta.buyerOrderNo} onChange={(e) => store.setMeta({ buyerOrderNo: e.target.value })} />
        </FormField>
        <FormField label="Buyer's Order Date">
          <input className={inputClass} type="date" value={store.meta.buyerOrderDate} onChange={(e) => store.setMeta({ buyerOrderDate: e.target.value })} />
        </FormField>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <FormField label="Delivery Note">
          <input className={inputClass} value={store.meta.deliveryNote} onChange={(e) => store.setMeta({ deliveryNote: e.target.value })} />
        </FormField>
        <FormField label="Delivery Note Date">
          <input className={inputClass} type="date" value={store.meta.deliveryNoteDate} onChange={(e) => store.setMeta({ deliveryNoteDate: e.target.value })} />
        </FormField>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <FormField label="Supplier's Ref">
          <input className={inputClass} value={store.meta.supplierRef} onChange={(e) => store.setMeta({ supplierRef: e.target.value })} />
        </FormField>
        <FormField label="Other Reference(s)">
          <input className={inputClass} value={store.meta.otherRef} onChange={(e) => store.setMeta({ otherRef: e.target.value })} />
        </FormField>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <FormField label="Despatch Doc No">
          <input className={inputClass} value={store.meta.despatchDocNo} onChange={(e) => store.setMeta({ despatchDocNo: e.target.value })} />
        </FormField>
        <FormField label="Despatched through">
          <input className={inputClass} value={store.meta.despatchThrough} onChange={(e) => store.setMeta({ despatchThrough: e.target.value })} />
        </FormField>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <FormField label="Destination">
          <input className={inputClass} value={store.meta.destination} onChange={(e) => store.setMeta({ destination: e.target.value })} />
        </FormField>
        <FormField label="Terms of Delivery">
          <input className={inputClass} value={store.meta.termsOfDelivery} onChange={(e) => store.setMeta({ termsOfDelivery: e.target.value })} />
        </FormField>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <Button onClick={() => store.setStep(2)}>Next — Line items &rarr;</Button>
      </div>
    </Card>
  );

  // ─── Step 2: Line Items ──────────────────────────────────
  const step2 = (
    <Card title="Line Items" step={2}>
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {store.lineItems.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '30px 2fr 90px 60px 60px 80px 80px 30px', gap: 6, marginBottom: 4, padding: '0 0 4px', borderBottom: '1px solid #e8e6e0', minWidth: 560 }}>
            <span style={{ fontSize: 9, color: '#888', fontWeight: 600 }}>Sl</span>
            <span style={{ fontSize: 9, color: '#888', fontWeight: 600 }}>Description of Services</span>
            <span style={{ fontSize: 9, color: '#888', fontWeight: 600 }}>HSN/SAC</span>
            <span style={{ fontSize: 9, color: '#888', fontWeight: 600 }}>Qty</span>
            <span style={{ fontSize: 9, color: '#888', fontWeight: 600 }}>Unit</span>
            <span style={{ fontSize: 9, color: '#888', fontWeight: 600 }}>Rate</span>
            <span style={{ fontSize: 9, color: '#888', fontWeight: 600 }}>Amount</span>
            <span />
          </div>
        )}
        {store.lineItems.map((item, idx) => (
          <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '30px 2fr 90px 60px 60px 80px 80px 30px', gap: 6, alignItems: 'end', marginBottom: 6, minWidth: 560 }}>
            <div style={{ padding: '7px 0', fontSize: 11, fontWeight: 600, textAlign: 'center' }}>{idx + 1}</div>
            <input className={inputClass} value={item.description} onChange={(e) => store.updateLineItem(item.id, { description: e.target.value })} placeholder="Service description" />
            <input className={inputClass} value={item.hsn} onChange={(e) => store.updateLineItem(item.id, { hsn: e.target.value })} placeholder="998314" />
            <input className={inputClass} type="number" value={item.qty} min={1} onChange={(e) => store.updateLineItem(item.id, { qty: parseFloat(e.target.value) || 0 })} />
            <input className={inputClass} value={item.unit} onChange={(e) => store.updateLineItem(item.id, { unit: e.target.value })} placeholder="Nos" />
            <input className={inputClass} type="number" value={item.rate} min={0} onChange={(e) => store.updateLineItem(item.id, { rate: parseFloat(e.target.value) || 0 })} />
            <div style={{ padding: '7px 4px', fontSize: 11, fontWeight: 600, color: '#1a2744', textAlign: 'right' }}>{formatINR(item.qty * item.rate)}</div>
            <Button variant="danger" onClick={() => store.removeLineItem(item.id)} style={{ padding: '7px 8px' }}>x</Button>
          </div>
        ))}
      </div>
      <Button variant="ghost" onClick={() => store.addLineItem()} style={{ width: '100%', justifyContent: 'center' }}>+ Add line item</Button>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: '1rem' }}>
        <Button variant="ghost" onClick={() => store.setStep(1)}>&larr; Back</Button>
        <Button onClick={() => store.setStep(3)} disabled={store.lineItems.length === 0}>Configure &rarr;</Button>
      </div>
    </Card>
  );

  // ─── Step 3: Config ──────────────────────────────────────
  const step3 = (
    <Card title="GST, Bank &amp; Declaration" step={3}>
      <SectionLabel first>GST</SectionLabel>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
        <span style={{ fontSize: 11, color: '#666' }}>GST rate:</span>
        <input type="number" value={store.gstRate} min={0} max={28}
          style={{ width: 60, fontSize: 11, padding: '5px 8px', border: '1px solid #e0ddd6', borderRadius: 6 }}
          onChange={(e) => store.setGstRate(parseFloat(e.target.value) || 0)} />
        <span style={{ fontSize: 10, color: '#888' }}>%</span>
        <span style={{ fontSize: 11, color: '#666', marginLeft: 6 }}>Type:</span>
        <select value={store.gstType} onChange={(e) => store.setGstType(e.target.value as GstType)}
          style={{ fontSize: 11, padding: '5px 8px', border: '1px solid #e0ddd6', borderRadius: 6, background: 'white' }}>
          <option value="split">CGST + SGST (intra-state)</option>
          <option value="igst">IGST (inter-state)</option>
        </select>
      </div>

      <SectionLabel>Bank Details</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <FormField label="Bank Name">
          <input className={inputClass} value={store.bankDetails.bankName} onChange={(e) => store.setBankDetails({ bankName: e.target.value })} />
        </FormField>
        <FormField label="A/c No.">
          <input className={inputClass} value={store.bankDetails.accountNo} onChange={(e) => store.setBankDetails({ accountNo: e.target.value })} />
        </FormField>
      </div>
      <FormField label="Branch & IFS Code">
        <input className={inputClass} value={store.bankDetails.branchIfsc} onChange={(e) => store.setBankDetails({ branchIfsc: e.target.value })} />
      </FormField>

      <SectionLabel>Company PAN</SectionLabel>
      <FormField label="PAN">
        <input className={inputClass} value={store.seller.pan} onChange={(e) => store.setSeller({ pan: e.target.value })} />
      </FormField>

      <SectionLabel>Declaration</SectionLabel>
      <FormField label="Declaration text">
        <textarea className={textareaClass} value={store.declaration} onChange={(e) => store.setDeclaration(e.target.value)} style={{ height: 60 }} />
      </FormField>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: '1rem' }}>
        <Button variant="ghost" onClick={() => store.setStep(2)}>&larr; Back</Button>
        <Button onClick={() => store.setStep(4)}>Preview invoice &rarr;</Button>
      </div>
    </Card>
  );

  // ─── Helpers for preview ─────────────────────────────────
  const halfGst = store.gstRate / 2;

  // Group line items by HSN for tax summary
  const hsnMap = new Map<string, { taxable: number; hsn: string }>();
  store.lineItems.forEach((item) => {
    const key = item.hsn || '-';
    const existing = hsnMap.get(key);
    const amt = item.qty * item.rate;
    if (existing) {
      existing.taxable += amt;
    } else {
      hsnMap.set(key, { taxable: amt, hsn: key });
    }
  });
  const hsnRows = Array.from(hsnMap.values());

  // ─── Step 4: Preview ─────────────────────────────────────
  const step4 = (
    <Card title="Invoice preview" step={4}>
      <div className={css.scrollWrap}>
      <div ref={previewRef} className={css.invoice}>
        {/* Header */}
        <div className={css.header}>
          <div className={css.companyName}>{store.seller.companyName}</div>
          <div className={css.companyAddr}>{store.seller.address}</div>
          <div className={css.gstLine}>
            <b>GSTIN/UIN:</b> {store.seller.gstin}
            &nbsp;&nbsp;&nbsp;&nbsp;
            <b>State Name :</b> {store.seller.stateName}, <b>Code :</b> {store.seller.stateCode}
          </div>
        </div>

        {/* Title */}
        <div className={css.title}>Tax Invoice</div>

        {/* Meta grid */}
        <div className={css.metaGrid}>
          <div className={css.metaLeft}>
            <div className={css.metaRow}>
              <div className={css.metaLabel}>Invoice No.</div>
              <div className={css.metaValue}>{store.meta.invoiceNo}</div>
            </div>
            <div className={css.metaRow}>
              <div className={css.metaLabel}>Delivery Note</div>
              <div className={css.metaValue}>{store.meta.deliveryNote}</div>
            </div>
            <div className={css.metaRow}>
              <div className={css.metaLabel}>Supplier's Ref.</div>
              <div className={css.metaValue}>{store.meta.supplierRef}</div>
            </div>
            <div className={css.metaRow}>
              <div className={css.metaLabel}>Buyer's Order No.</div>
              <div className={css.metaValue}>{store.meta.buyerOrderNo}</div>
            </div>
            <div className={css.metaRow}>
              <div className={css.metaLabel}>Despatch Doc No.</div>
              <div className={css.metaValue}>{store.meta.despatchDocNo}</div>
            </div>
            <div className={css.metaRow}>
              <div className={css.metaLabel}>Despatched through</div>
              <div className={css.metaValue}>{store.meta.despatchThrough}</div>
            </div>
          </div>
          <div className={css.metaRight}>
            <div className={css.metaRow}>
              <div className={css.metaLabel}>Dated</div>
              <div className={css.metaValue}>{fmtDate(store.meta.invoiceDate)}</div>
            </div>
            <div className={css.metaRow}>
              <div className={css.metaLabel}>Mode/Terms of Payment</div>
              <div className={css.metaValue}>{store.meta.paymentTerms}</div>
            </div>
            <div className={css.metaRow}>
              <div className={css.metaLabel}>Other Reference(s)</div>
              <div className={css.metaValue}>{store.meta.otherRef}</div>
            </div>
            <div className={css.metaRow}>
              <div className={css.metaLabel}>Dated</div>
              <div className={css.metaValue}>{fmtDate(store.meta.buyerOrderDate)}</div>
            </div>
            <div className={css.metaRow}>
              <div className={css.metaLabel}>Delivery Note Date</div>
              <div className={css.metaValue}>{fmtDate(store.meta.deliveryNoteDate)}</div>
            </div>
            <div className={css.metaRow}>
              <div className={css.metaLabel}>Destination</div>
              <div className={css.metaValue}>{store.meta.destination}</div>
            </div>
          </div>
        </div>

        {/* Terms of delivery row (full width) */}
        <div style={{ display: 'flex', borderBottom: '1px solid #000', minHeight: 22 }}>
          <div className={css.metaLabel} style={{ width: 140 }}>Terms of Delivery</div>
          <div className={css.metaValue} style={{ borderLeft: '1px solid #000' }}>{store.meta.termsOfDelivery}</div>
        </div>

        {/* Buyer block */}
        <div className={css.buyerBlock}>
          <div className={css.buyerHeader}>Buyer (Bill to)</div>
          <div className={css.buyerName}>{store.buyer.companyName}</div>
          <div className={css.buyerAddr}>{store.buyer.address}</div>
          <div className={css.buyerGst}>
            <b>GSTIN/UIN :</b> {store.buyer.gstin}
            &nbsp;&nbsp;&nbsp;&nbsp;
            <b>State Name :</b> {store.buyer.stateName}, <b>Code :</b> {store.buyer.stateCode}
          </div>
        </div>

        {/* Line items table */}
        <table className={css.lineTable}>
          <thead>
            <tr>
              <th style={{ width: 30 }}>Sl No</th>
              <th>Description of Services</th>
              <th style={{ width: 80 }}>HSN/SAC</th>
              <th style={{ width: 55 }}>Quantity</th>
              <th style={{ width: 55 }}>Rate</th>
              <th style={{ width: 40 }}>per</th>
              <th style={{ width: 90 }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {store.lineItems.map((item, idx) => (
              <tr key={item.id}>
                <td className={css.center}>{idx + 1}</td>
                <td>{item.description}</td>
                <td className={css.center}>{item.hsn}</td>
                <td className={css.right}>{item.qty}</td>
                <td className={css.right}>{formatINR(item.rate)}</td>
                <td className={css.center}>{item.unit}</td>
                <td className={css.right}>{formatINR(item.qty * item.rate)}.00</td>
              </tr>
            ))}
            {/* Empty rows to fill space (min 3 visible rows) */}
            {store.lineItems.length < 3 && Array.from({ length: 3 - store.lineItems.length }).map((_, i) => (
              <tr key={`empty-${i}`}>
                <td>&nbsp;</td><td /><td /><td /><td /><td /><td />
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td />
              <td style={{ textAlign: 'right', fontWeight: 700 }}>Total</td>
              <td />
              <td className={css.right}>{store.lineItems.reduce((s, i) => s + i.qty, 0)}</td>
              <td />
              <td />
              <td className={css.right}>{formatINR(subtotal)}.00</td>
            </tr>
          </tfoot>
        </table>

        {/* GST breakup rows */}
        {store.gstType === 'split' ? (
          <>
            <div className={css.totalRow}>
              <div style={{ flex: 1 }} />
              <div className={css.totalLabel}>Central Tax (CGST) @ {halfGst}%</div>
              <div className={css.totalValue}>{formatINR(subtotal * halfGst / 100)}.00</div>
            </div>
            <div className={css.totalRow}>
              <div style={{ flex: 1 }} />
              <div className={css.totalLabel}>State Tax (SGST) @ {halfGst}%</div>
              <div className={css.totalValue}>{formatINR(subtotal * halfGst / 100)}.00</div>
            </div>
          </>
        ) : (
          <div className={css.totalRow}>
            <div style={{ flex: 1 }} />
            <div className={css.totalLabel}>Integrated Tax (IGST) @ {store.gstRate}%</div>
            <div className={css.totalValue}>{formatINR(gstAmount)}.00</div>
          </div>
        )}
        <div className={css.totalRow} style={{ fontWeight: 700, fontSize: 11 }}>
          <div style={{ flex: 1 }} />
          <div className={css.totalLabel} style={{ fontWeight: 700 }}>Total</div>
          <div className={css.totalValue}>{formatINR(grandTotal)}.00</div>
        </div>

        {/* Amount in words */}
        <div className={css.amountWords}>
          <b>Amount Chargeable (in words):</b>&nbsp;&nbsp;
          {numberToWordsIndian(grandTotal)}
        </div>

        {/* Tax summary table */}
        <table className={css.taxTable}>
          <thead>
            <tr>
              <th rowSpan={2}>HSN/SAC</th>
              <th rowSpan={2}>Taxable Value</th>
              {store.gstType === 'split' ? (
                <>
                  <th colSpan={2}>Central Tax</th>
                  <th colSpan={2}>State Tax</th>
                </>
              ) : (
                <th colSpan={2}>Integrated Tax</th>
              )}
              <th rowSpan={2}>Total Tax Amount</th>
            </tr>
            <tr>
              {store.gstType === 'split' ? (
                <>
                  <th>Rate</th><th>Amount</th>
                  <th>Rate</th><th>Amount</th>
                </>
              ) : (
                <>
                  <th>Rate</th><th>Amount</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {hsnRows.map((row) => {
              const cAmt = row.taxable * halfGst / 100;
              const iAmt = row.taxable * store.gstRate / 100;
              return (
                <tr key={row.hsn}>
                  <td>{row.hsn}</td>
                  <td className={css.right}>{formatINR(row.taxable)}.00</td>
                  {store.gstType === 'split' ? (
                    <>
                      <td>{halfGst}%</td>
                      <td className={css.right}>{formatINR(cAmt)}.00</td>
                      <td>{halfGst}%</td>
                      <td className={css.right}>{formatINR(cAmt)}.00</td>
                      <td className={css.right}>{formatINR(cAmt * 2)}.00</td>
                    </>
                  ) : (
                    <>
                      <td>{store.gstRate}%</td>
                      <td className={css.right}>{formatINR(iAmt)}.00</td>
                      <td className={css.right}>{formatINR(iAmt)}.00</td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td style={{ fontWeight: 700 }}>Total</td>
              <td className={css.right} style={{ fontWeight: 700 }}>{formatINR(subtotal)}.00</td>
              {store.gstType === 'split' ? (
                <>
                  <td />
                  <td className={css.right} style={{ fontWeight: 700 }}>{formatINR(subtotal * halfGst / 100)}.00</td>
                  <td />
                  <td className={css.right} style={{ fontWeight: 700 }}>{formatINR(subtotal * halfGst / 100)}.00</td>
                  <td className={css.right} style={{ fontWeight: 700 }}>{formatINR(gstAmount)}.00</td>
                </>
              ) : (
                <>
                  <td />
                  <td className={css.right} style={{ fontWeight: 700 }}>{formatINR(gstAmount)}.00</td>
                  <td className={css.right} style={{ fontWeight: 700 }}>{formatINR(gstAmount)}.00</td>
                </>
              )}
            </tr>
          </tfoot>
        </table>

        {/* Tax amount in words */}
        <div className={css.amountWords}>
          <b>Tax Amount (in words):</b>&nbsp;&nbsp;
          {numberToWordsIndian(gstAmount)}
        </div>

        {/* Bottom section: bank + declaration */}
        <div className={css.bottomGrid}>
          <div className={css.bottomLeft}>
            <div className={css.panRow}><b>Company's PAN :</b> {store.seller.pan}</div>
            <div style={{ marginTop: 8 }}>
              <div className={css.bankTitle}>Company's Bank Details</div>
              <div className={css.bankRow}>
                <span className={css.bankLabel}>Bank Name :</span>
                <span className={css.bankValue}>{store.bankDetails.bankName}</span>
              </div>
              <div className={css.bankRow}>
                <span className={css.bankLabel}>A/c No. :</span>
                <span className={css.bankValue}>{store.bankDetails.accountNo}</span>
              </div>
              <div className={css.bankRow}>
                <span className={css.bankLabel}>Branch & IFS Code :</span>
                <span className={css.bankValue}>{store.bankDetails.branchIfsc}</span>
              </div>
            </div>
          </div>
          <div className={css.bottomRight}>
            <div>
              <div className={css.declarationTitle}>Declaration</div>
              <div className={css.declarationText}>{store.declaration}</div>
            </div>
            <div className={css.signBlock}>
              <div className={css.signCompany}>for {store.seller.companyName}</div>
              <div className={css.signLabel}>Authorised Signatory</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={css.footer}>This is a Computer Generated Invoice</div>
      </div>
      </div>{/* close scrollWrap */}

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: '0.9rem' }}>
        <Button variant="ghost" onClick={() => store.setStep(3)}>&larr; Back</Button>
        <Button variant="ghost" onClick={async () => {
          if (previewRef.current) await generatePdf(previewRef.current, `${store.meta.invoiceNo.replace(/\//g, '-')}_Invoice.pdf`);
        }}>Print / PDF</Button>
        <Button onClick={() => {
          addEntry({
            clientName: store.buyer.companyName,
            contactPerson: '',
            email: '',
            date: store.meta.invoiceDate,
            docType: 'invoice',
            refNumber: store.meta.invoiceNo,
            amount: grandTotal,
          });
          store.setStep(5);
        }}>Compose &amp; send email &rarr;</Button>
      </div>
    </Card>
  );

  // ─── Step 5: Email ────────────────────────────────────────
  const [emailTo, setEmailTo] = useState('');
  const [emailBody, setEmailBody] = useState('');
  useEffect(() => {
    if (store.step === 5) {
      setEmailBody(`Dear Sir/Ma'am,

Please find attached Tax Invoice ${store.meta.invoiceNo} for ${store.buyer.companyName || 'your organisation'}.

Invoice Amount: Rs.${formatINR(grandTotal)} (inclusive of GST)
${store.meta.paymentTerms ? `Payment Terms: ${store.meta.paymentTerms}` : ''}

Bank Details for payment:
${store.bankDetails.bankName} | A/c: ${store.bankDetails.accountNo} | Branch & IFSC: ${store.bankDetails.branchIfsc}

Please process the payment at your earliest convenience.

Warm regards,
HNV Techno Solutions Pvt. Ltd.`);
    }
  }, [store.step]);

  const step5 = (
    <Card title="Send invoice" step={5}>
      <FormField label="To *">
        <input className={inputClass} type="email" value={emailTo} onChange={(e) => setEmailTo(e.target.value)} placeholder="buyer@company.com" />
      </FormField>
      <FormField label="Subject">
        <input className={inputClass} defaultValue={`Invoice ${store.meta.invoiceNo} | HNV Techno Solutions Pvt. Ltd.`} />
      </FormField>
      <FormField label="Email body">
        <textarea className={textareaClass} value={emailBody} onChange={(e) => setEmailBody(e.target.value)} style={{ height: 200, fontSize: 11, lineHeight: 1.6 }} />
      </FormField>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: '1rem' }}>
        <Button variant="ghost" onClick={() => store.setStep(4)}>&larr; Back</Button>
        <Button variant="ghost" onClick={async () => {
          await copyToClipboard(emailBody);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}>{copied ? 'Copied!' : 'Copy'}</Button>
        <Button variant="success" onClick={() => window.open(generateMailtoLink(emailTo, `Invoice ${store.meta.invoiceNo}`, emailBody), '_blank')}>Open email client</Button>
      </div>
    </Card>
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white', borderRadius: 12, padding: '0.75rem 1.25rem', marginBottom: '0.75rem', border: '1px solid #e8e6e0' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 38, height: 38, background: '#1a2744', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9a84c', fontSize: 11, fontWeight: 700 }}>HNV</div>
          <div style={{ marginLeft: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>HNV Techno Solutions Pvt. Ltd.</div>
            <div style={{ fontSize: 10, color: '#888' }}>Tax Invoice Generator</div>
          </div>
        </div>
      </div>
      <StepperWizard steps={STEPS} current={store.step} />
      <div style={{ maxWidth: 900 }}>
        {store.step === 1 && step1}
        {store.step === 2 && step2}
        {store.step === 3 && step3}
        {store.step === 4 && step4}
        {store.step === 5 && step5}
      </div>
    </div>
  );
}
