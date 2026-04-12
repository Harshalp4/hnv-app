import { useRef } from 'react';
import { useQuotationStore } from '../../store/useQuotationStore';
import { useQuotationCalc } from './useQuotationCalc';
import { Button } from '../../components/shared/Button';
import { Letterhead } from '../../components/letterhead/Letterhead';
import { QuotationTable } from '../../components/letterhead/QuotationTable';
import { TotalsBox } from '../../components/letterhead/TotalsBox';
import { ScopeOfWork } from '../../components/letterhead/ScopeOfWork';
import { TermsConditions } from '../../components/letterhead/TermsConditions';
import { SignatureBlock } from '../../components/letterhead/SignatureBlock';
import { generatePdf } from '../../lib/pdf';
import { formatINR } from '../../lib/indianFormat';
import { useClientHistoryStore } from '../../store/useClientHistoryStore';
import { generateRefNumber } from '../../lib/refNumber';

export function Step4Preview() {
  const store = useQuotationStore();
  const calc = useQuotationCalc();
  const addEntry = useClientHistoryStore((s) => s.addEntry);
  const lhRef = useRef<HTMLDivElement>(null);

  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  const subjectMap: Record<string, string> = {
    scan: 'Document Scanning & Digitization Services',
    dms: 'DMS Software Licensing',
    both: 'Document Scanning & DMS Platform',
  };

  const scopeText = (() => {
    let sc = '';
    if (store.serviceMode === 'scan' || store.serviceMode === 'both') {
      sc += `Scope — scanning: ${formatINR(calc.totalPages)} pages × ${calc.sides} side(s) = ${formatINR(calc.totalImages)} images. Document types: ${store.scan.docTypes.join(', ') || 'A4 standard'}. `;
    }
    if (store.serviceMode === 'dms' || store.serviceMode === 'both') {
      const edLabel = store.dms.edition.charAt(0).toUpperCase() + store.dms.edition.slice(1);
      sc += `DMS: ${edLabel} for ${store.dms.users} users.`;
    }
    return sc || 'Configure services to populate scope of work.';
  })();

  const handlePdf = async () => {
    if (lhRef.current) {
      await generatePdf(lhRef.current, `${store.meta.refNumber}_Quotation.pdf`);
    }
  };

  const handleNext = () => {
    // Save to history
    addEntry({
      clientName: store.client.companyName,
      contactPerson: store.client.contactPerson,
      email: store.client.email,
      date: store.meta.date,
      docType: 'quotation',
      refNumber: store.meta.refNumber || generateRefNumber('HNV'),
      amount: calc.grandTotal,
    });
    store.setStep(5);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.75rem' }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#1a2744', color: '#c9a84c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>4</div>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#1a2744' }}>Quotation preview — ready to print / PDF</span>
      </div>
      <Letterhead
        ref={lhRef}
        address={store.meta.letterheadAddress}
        title="Commercial Quotation"
        billTo={{
          companyName: store.client.companyName,
          contactPerson: store.client.contactPerson,
          email: store.client.email,
          city: store.client.city,
          gstin: store.client.gstin,
        }}
        details={[
          { label: 'Ref. No.', value: store.meta.refNumber },
          { label: 'Date', value: formatDate(store.meta.date) },
          { label: 'Valid', value: formatDate(store.meta.validUntil) },
          { label: 'Subject', value: subjectMap[store.serviceMode || ''] || '—' },
        ]}
      >
        <QuotationTable lines={calc.lines} showSections={store.serviceMode === 'both'} />
        <TotalsBox
          subtotal={calc.subtotal}
          discountPct={store.discountPct}
          discountAmount={calc.discountAmount}
          taxableAmount={calc.taxableAmount}
          gstRate={store.gstRate}
          gstType={store.gstType}
          gstAmount={calc.gstAmount}
          grandTotal={calc.grandTotal}
        />
        <ScopeOfWork text={scopeText} />
        <TermsConditions value={store.termsConditions} onChange={store.setTerms} />
        <SignatureBlock clientName={store.client.companyName} />
      </Letterhead>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: '0.9rem' }}>
        <Button variant="ghost" onClick={() => store.setStep(3)}>← Back</Button>
        <Button variant="ghost" onClick={handlePdf}>🖨 Print / PDF</Button>
        <Button onClick={handleNext}>Compose & send email →</Button>
      </div>
    </div>
  );
}
