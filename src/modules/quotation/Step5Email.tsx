import { useState, useEffect } from 'react';
import { useQuotationStore } from '../../store/useQuotationStore';
import { useQuotationCalc } from './useQuotationCalc';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';
import { FormField, inputClass, textareaClass } from '../../components/shared/FormField';
import { formatINR } from '../../lib/indianFormat';
import { generateMailtoLink, copyToClipboard } from '../../lib/emailHelper';

function generateEmailBody(store: ReturnType<typeof useQuotationStore.getState>, calc: ReturnType<typeof useQuotationCalc>) {
  const cp = store.client.contactPerson || "Sir/Ma'am";
  const cn = store.client.companyName || 'your organisation';
  const qr = store.meta.refNumber;
  const grand = formatINR(calc.grandTotal);
  const items = calc.lines.map((l) => `  • ${l.description}: ₹${formatINR(l.amount)}`).join('\n') || '  (no items configured)';
  const desc: Record<string, string> = {
    scan: 'document scanning and digitization',
    dms: 'DMS software licensing',
    both: 'document scanning, digitization, and DMS software',
  };

  return `Dear ${cp},

Thank you for your enquiry regarding our ${desc[store.serviceMode || ''] || 'services'} services.

Please find attached our commercial quotation ${qr} for ${cn}.

Quotation summary:
${items}

${store.discountPct > 0 ? `Discount @ ${store.discountPct}% applied.\n` : ''}Grand Total (inclusive of GST): ₹${grand}

This quotation is valid for 30 days. All physical documents are handled under strict chain of custody and DPDP-compliant data handling throughout.

We are happy to schedule a site visit for document assessment or to discuss the scope. Please feel free to reach out.

Warm regards,
HNV Techno Solutions Pvt. Ltd.
Mahape, Navi Mumbai — 400 710
info@hnvtechno.com | +91 XXXXX XXXXX`;
}

export function Step5Email() {
  const store = useQuotationStore();
  const calc = useQuotationCalc();
  const [to, setTo] = useState('');
  const [cc, setCc] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setTo(store.client.email);
    const subs: Record<string, string> = {
      scan: 'Document Scanning & Digitization',
      dms: 'DMS Software Licensing',
      both: 'Scanning & DMS Services',
    };
    setSubject(`Quotation ${store.meta.refNumber} — ${subs[store.serviceMode || ''] || 'Services'} | HNV Techno Solutions Pvt. Ltd.`);
    setBody(generateEmailBody(store, calc));
  }, []);

  const regenerate = () => setBody(generateEmailBody(store, calc));

  const handleMailto = () => {
    window.open(generateMailtoLink(to, subject, body, cc), '_blank');
  };

  const handleCopy = async () => {
    const text = `To: ${to}\n${cc ? `CC: ${cc}\n` : ''}Subject: ${subject}\n\n${body}`;
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card title="Send quotation to client" step={5}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#eaf3de', border: '1px solid #c0dd97', borderRadius: 8, marginBottom: '0.75rem', fontSize: 11, color: '#27500a' }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#27500a', flexShrink: 0 }} />
        Opens your default email client — or copy email content to clipboard
      </div>
      <FormField label="To *">
        <input className={inputClass} type="email" value={to} onChange={(e) => setTo(e.target.value)} />
      </FormField>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <FormField label="CC">
          <input className={inputClass} type="email" value={cc} onChange={(e) => setCc(e.target.value)} placeholder="optional" />
        </FormField>
        <FormField label="BCC">
          <input className={inputClass} type="email" placeholder="optional" />
        </FormField>
      </div>
      <FormField label="Subject">
        <input className={inputClass} value={subject} onChange={(e) => setSubject(e.target.value)} />
      </FormField>
      <FormField label="Email body">
        <textarea className={textareaClass} value={body} onChange={(e) => setBody(e.target.value)} style={{ height: 200, fontSize: 11, lineHeight: 1.6 }} />
      </FormField>
      <div style={{ border: '2px dashed #e0ddd6', borderRadius: 8, padding: 10, textAlign: 'center', fontSize: 11, color: '#888', marginBottom: '0.75rem' }}>
        📎 Quotation PDF will be attached — <strong>{store.meta.refNumber}_Quotation.pdf</strong>
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: '1rem' }}>
        <Button variant="ghost" onClick={() => store.setStep(4)}>← Back</Button>
        <Button variant="ghost" onClick={regenerate}>↺ Regenerate body</Button>
        <Button variant="ghost" onClick={handleCopy}>{copied ? '✓ Copied!' : '📋 Copy to clipboard'}</Button>
        <Button variant="success" onClick={handleMailto}>✉ Open email client</Button>
      </div>
    </Card>
  );
}
