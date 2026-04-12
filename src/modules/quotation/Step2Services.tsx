import { useQuotationStore } from '../../store/useQuotationStore';
import { Card } from '../../components/shared/Card';
import { ServiceSelector } from '../../components/shared/ServiceSelector';
import { Button } from '../../components/shared/Button';

const SCOPE_HINTS: Record<string, { text: string; color: string; bg: string; border: string }> = {
  scan: {
    text: 'Scanning only — quotation will include: document preparation (per page), scanning (per image), QC (per image), indexing (per doc), and optional OCR, transport, secure destruction, output delivery. Billing unit = per image.',
    color: '#0c447c', bg: '#e6f1fb', border: '#b8d6f0',
  },
  dms: {
    text: 'DMS only — quotation will include software license (per user/month), edition selection, license term, deployment type, and optional add-on modules. SAC 997331.',
    color: '#1b5e20', bg: '#e8f5e9', border: '#a5d6a7',
  },
  both: {
    text: 'Scanning + DMS — both sections included in one quotation. Section A for scanning services, Section B for DMS licensing. Best suited for end-to-end digitization projects.',
    color: '#4a3700', bg: '#fff8e1', border: '#ffe082',
  },
};

export function Step2Services() {
  const { serviceMode, setServiceMode, setStep } = useQuotationStore();

  const hint = serviceMode ? SCOPE_HINTS[serviceMode] : null;

  return (
    <Card title="What are you quoting?" step={2}>
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
        Choose the type of service to quote. Each option configures different pricing sections and line items on the final quotation.
      </div>
      <ServiceSelector value={serviceMode} onChange={setServiceMode} />
      {hint ? (
        <div style={{
          background: hint.bg, border: `1px solid ${hint.border}`, borderRadius: 10,
          padding: '12px 16px', fontSize: 11, color: hint.color, lineHeight: 1.6, marginBottom: '0.75rem',
        }}>
          <strong>Scope:</strong> {hint.text}
        </div>
      ) : (
        <div style={{
          background: '#f8f7f4', border: '1px dashed #d0ccc4', borderRadius: 10,
          padding: '14px 16px', fontSize: 11, color: '#aaa', lineHeight: 1.6,
          marginBottom: '0.75rem', textAlign: 'center',
        }}>
          Select a service type above to see what will be configured
        </div>
      )}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: '1rem' }}>
        <Button variant="ghost" onClick={() => setStep(1)}>← Back</Button>
        <Button onClick={() => setStep(3)} disabled={!serviceMode}>Configure pricing →</Button>
      </div>
    </Card>
  );
}
