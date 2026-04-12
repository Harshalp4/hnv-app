import { useQuotationStore } from '../../store/useQuotationStore';
import { useQuotationCalc } from './useQuotationCalc';
import { StepperWizard } from '../../components/shared/StepperWizard';
import { Card } from '../../components/shared/Card';
import { LiveEstimate } from '../../components/shared/LiveEstimate';
import { GrandTotalCard } from '../../components/shared/GrandTotalCard';
import { Step1ClientInfo } from './Step1ClientInfo';
import { Step2Services } from './Step2Services';
import { Step3Pricing } from './Step3Pricing';
import { Step4Preview } from './Step4Preview';
import { Step5Email } from './Step5Email';
import css from './QuotationPage.module.css';

const STEPS = ['Client info', 'Services', 'Configure & pricing', 'Preview', 'Send email'];

export function QuotationPage() {
  const step = useQuotationStore((s) => s.step);
  const serviceMode = useQuotationStore((s) => s.serviceMode);
  const gstRate = useQuotationStore((s) => s.gstRate);
  const discountPct = useQuotationStore((s) => s.discountPct);
  const calc = useQuotationCalc();

  const estimateItems = calc.lines.map((l) => ({ label: l.description, amount: l.amount }));

  return (
    <div>
      <div className={css.headerBar}>
        <div className={css.headerLeft}>
          <div className={css.headerLogo}>HNV</div>
          <div className={css.headerInfo}>
            <div className={css.headerTitle}>HNV Techno Solutions Pvt. Ltd.</div>
            <div className={css.headerSub}>Commercial Quotation Generator — Document Scanning & DMS</div>
          </div>
        </div>
        <span className={css.versionBadge}>v3.0</span>
      </div>
      <StepperWizard steps={STEPS} current={step} />
      {step <= 3 ? (
        <div className={css.twoCol}>
          <div>
            {step === 1 && <Step1ClientInfo />}
            {step === 2 && <Step2Services />}
            {step === 3 && <Step3Pricing />}
          </div>
          <div>
            {/* Quick stats */}
            <div className={css.quickStats}>
              <div className={css.statBox}>
                <div className={css.statValue}>{calc.lines.length}</div>
                <div className={css.statLabel}>Line items</div>
              </div>
              <div className={css.statBox}>
                <div className={css.statValue}>{serviceMode === 'both' ? 2 : serviceMode ? 1 : 0}</div>
                <div className={css.statLabel}>Sections</div>
              </div>
            </div>

            {/* Live estimate */}
            <Card style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#1a2744' }}>Live estimate</div>
                <div style={{ fontSize: 9, color: '#0f6e56', fontWeight: 600 }}>
                  {calc.lines.length > 0 ? 'LIVE' : ''}
                </div>
              </div>
              <LiveEstimate
                items={estimateItems}
                discountPct={discountPct}
                discountAmount={calc.discountAmount}
                taxableAmount={calc.taxableAmount}
                gstRate={gstRate}
                gstAmount={calc.gstAmount}
              />
            </Card>

            {/* Grand total */}
            <div style={{ marginBottom: '0.75rem' }}>
              <GrandTotalCard total={calc.grandTotal} gstRate={gstRate} discountPct={discountPct} />
            </div>

            {/* Industry reference tip */}
            {serviceMode && (
              <div className={css.tipCard}>
                <div className={css.tipTitle}>
                  Industry standard (Iron Mountain)
                </div>
                Billing unit = <strong style={{ color: '#1a2744' }}>per image</strong><br />
                {'\u2022'} Single-sided: 1 image/page<br />
                {'\u2022'} Duplex: 2 images/page<br />
                {'\u2022'} SAC 998314 @ 18% GST<br />
                {'\u2022'} Core: prep + scan + QC<br />
                {'\u2022'} Optional: indexing, OCR,<br />&nbsp;&nbsp;transport, shredding, delivery
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={css.fullWidth}>
          {step === 4 && <Step4Preview />}
          {step === 5 && <Step5Email />}
        </div>
      )}
    </div>
  );
}
