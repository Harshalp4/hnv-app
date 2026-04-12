import { useQuotationStore } from '../../store/useQuotationStore';
import { Card } from '../../components/shared/Card';
import { FormField, inputClass, selectClass, textareaClass } from '../../components/shared/FormField';
import { Button } from '../../components/shared/Button';
import { SectionLabel } from '../../components/shared/SectionLabel';
import { INDUSTRIES } from '../../types/client';

export function Step1ClientInfo() {
  const { client, meta, setClient, setMeta, setStep } = useQuotationStore();

  return (
    <Card title="Client information" step={1}>
      <div style={{
        background: 'linear-gradient(135deg, #f0f3fa 0%, #e8ecf6 100%)',
        border: '1px solid #dce3f5',
        borderRadius: 10,
        padding: '12px 16px',
        marginBottom: '1rem',
        fontSize: 11,
        color: '#444',
        lineHeight: 1.6,
      }}>
        Fill in the client details below. Fields marked with <strong>*</strong> are required for the quotation letterhead.
      </div>

      <SectionLabel first>Client details</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <FormField label="Company name *">
          <input className={inputClass} value={client.companyName} onChange={(e) => setClient({ companyName: e.target.value })} placeholder="ABC Corp Pvt. Ltd." />
        </FormField>
        <FormField label="Contact person *">
          <input className={inputClass} value={client.contactPerson} onChange={(e) => setClient({ contactPerson: e.target.value })} placeholder="Full name" />
        </FormField>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <FormField label="Email *">
          <input className={inputClass} type="email" value={client.email} onChange={(e) => setClient({ email: e.target.value })} placeholder="name@company.com" />
        </FormField>
        <FormField label="Phone">
          <input className={inputClass} value={client.phone} onChange={(e) => setClient({ phone: e.target.value })} placeholder="+91 XXXXX XXXXX" />
        </FormField>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <FormField label="City">
          <input className={inputClass} value={client.city} onChange={(e) => setClient({ city: e.target.value })} placeholder="Navi Mumbai" />
        </FormField>
        <FormField label="Industry">
          <select className={selectClass} value={client.industry} onChange={(e) => setClient({ industry: e.target.value })}>
            {INDUSTRIES.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
          </select>
        </FormField>
      </div>
      <FormField label="Client GSTIN (optional)">
        <input className={inputClass} value={client.gstin} onChange={(e) => setClient({ gstin: e.target.value })} placeholder="27XXXXX0000X1Z0" />
      </FormField>

      <SectionLabel>Quotation metadata</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        <FormField label="Quotation date">
          <input className={inputClass} type="date" value={meta.date} onChange={(e) => setMeta({ date: e.target.value })} />
        </FormField>
        <FormField label="Valid until">
          <input className={inputClass} type="date" value={meta.validUntil} onChange={(e) => setMeta({ validUntil: e.target.value })} />
        </FormField>
        <FormField label="Reference #">
          <input className={inputClass} value={meta.refNumber} onChange={(e) => setMeta({ refNumber: e.target.value })} />
        </FormField>
      </div>
      <FormField label="HNV letterhead address">
        <textarea className={textareaClass} value={meta.letterheadAddress} onChange={(e) => setMeta({ letterheadAddress: e.target.value })} />
      </FormField>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <Button onClick={() => setStep(2)}>Next — Select services →</Button>
      </div>
    </Card>
  );
}
