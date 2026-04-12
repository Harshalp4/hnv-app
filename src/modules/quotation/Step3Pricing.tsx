import { useQuotationStore } from '../../store/useQuotationStore';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';
import { FormField, inputClass, selectClass } from '../../components/shared/FormField';
import { SectionLabel } from '../../components/shared/SectionLabel';
import { PriceRow } from '../../components/shared/PriceRow';
import { Tag } from '../../components/shared/Tag';
import { ChipSelect } from '../../components/shared/ChipSelect';
import { ImageCalcBar } from '../../components/shared/ImageCalcBar';
import { RadioGroup } from '../../components/shared/RadioGroup';
import { ToggleRow } from '../../components/shared/ToggleRow';
import { SmallInput } from '../../components/shared/SmallInput';
import { DOC_TYPES, INDEXING_LABELS, INDEXING_DESCRIPTIONS, DMS_EDITIONS, DMS_PREMISE_USER_COUNTS, DMS_CLOUD_USER_COUNTS, DMS_CLOUD_STORAGE_OPTIONS, getDmsPlanName } from '../../types/quotation';
import type { IndexingLevel, UrgencyTier, DmsDeployment, DmsLicenseValidity, DmsLicenseType } from '../../types/quotation';

export function Step3Pricing() {
  const store = useQuotationStore();
  const showScan = store.serviceMode === 'scan' || store.serviceMode === 'both';
  const showDms = store.serviceMode === 'dms' || store.serviceMode === 'both';
  const images = store.scan.volume * store.scan.sides;

  return (
    <Card title="Configure & pricing" step={3}>
      {showScan && (
        <>
          <SectionLabel first>A — Document scanning & digitization</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <FormField label="Volume (pages)">
              <input className={inputClass} type="number" value={store.scan.volume} min={1} onChange={(e) => store.setScanVolume(parseInt(e.target.value) || 0)} />
            </FormField>
            <FormField label="Document sides">
              <select className={selectClass} value={store.scan.sides} onChange={(e) => store.setScanSides(parseInt(e.target.value) as 1 | 2)}>
                <option value={1}>Single-sided (1 image per page)</option>
                <option value={2}>Double-sided / Duplex (2 images per page)</option>
              </select>
            </FormField>
          </div>
          <ImageCalcBar pages={store.scan.volume} sides={store.scan.sides} images={images} />
          <FormField label="Document types">
            <ChipSelect options={[...DOC_TYPES]} selected={store.scan.docTypes} onChange={store.setScanDocTypes} />
          </FormField>

          <SectionLabel>Core charges — always included in scanning projects</SectionLabel>
          <PriceRow core label="1. Document preparation" sublabel="Destapling, sorting, unbinding, minor repair — billed per PAGE" rate={store.scan.rates.prep} onRateChange={(v) => store.setScanRate('prep', v)} unit="page" />
          <PriceRow core label="2. Scanning / image capture" sublabel="300 DPI — billed per IMAGE (pages × sides)" rate={store.scan.rates.scan} onRateChange={(v) => store.setScanRate('scan', v)} unit="image" tag={<Tag variant="gold">primary unit</Tag>} />
          <PriceRow core label="3. Quality control & verification" sublabel="Visual QC, completeness check, accuracy review" rate={store.scan.rates.qc} onRateChange={(v) => store.setScanRate('qc', v)} unit="image" />

          <SectionLabel>Indexing level</SectionLabel>
          <RadioGroup
            value={store.scan.indexing.level}
            onChange={(v) => store.setIndexingLevel(v as IndexingLevel)}
            options={INDEXING_LABELS.map((label, i) => ({
              value: i,
              label,
              description: INDEXING_DESCRIPTIONS[i],
              right: (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <SmallInput type="number" value={store.scan.indexing.rates[i]} min={0} step={0.25}
                    onChange={(e) => store.setIndexingRate(i as IndexingLevel, parseFloat(e.target.value) || 0)}
                    onClick={(e) => e.stopPropagation()} />
                  <span style={{ fontSize: 10, color: '#888' }}>/doc</span>
                </div>
              ),
            }))}
          />
          <div style={{ marginTop: 8 }}>
            <FormField label="Number of documents (for indexing cost)">
              <input className={inputClass} type="number" value={store.scan.indexing.docCount} min={0} onChange={(e) => store.setIndexingDocCount(parseInt(e.target.value) || 0)} />
            </FormField>
          </div>

          <SectionLabel>Optional add-on services</SectionLabel>
          <ToggleRow name="OCR / full-text extraction" tag={<Tag variant="blue">searchable PDF</Tag>}
            priceLabel={<>₹<SmallInput type="number" value={store.scan.addOns.ocr.rate} step={0.05} onChange={(e) => store.setScanAddOn('ocr', { rate: parseFloat(e.target.value) || 0 })} /> per image</>}
            checked={store.scan.addOns.ocr.enabled} onChange={(v) => store.setScanAddOn('ocr', { enabled: v })} />
          <ToggleRow name="Colour scanning surcharge"
            priceLabel={<>+₹<SmallInput type="number" value={store.scan.addOns.colour.rate} step={0.05} onChange={(e) => store.setScanAddOn('colour', { rate: parseFloat(e.target.value) || 0 })} /> per image</>}
            checked={store.scan.addOns.colour.enabled} onChange={(v) => store.setScanAddOn('colour', { enabled: v })} />
          <ToggleRow name="Secure transport — pickup & delivery"
            priceLabel={<>₹<SmallInput type="number" value={store.scan.addOns.transport.ratePerTrip} onChange={(e) => store.setScanAddOn('transport', { ratePerTrip: parseFloat(e.target.value) || 0 })} /> per trip × <SmallInput type="number" value={store.scan.addOns.transport.trips} min={1} width="40px" onChange={(e) => store.setScanAddOn('transport', { trips: parseInt(e.target.value) || 1 })} /> trips</>}
            checked={store.scan.addOns.transport.enabled} onChange={(v) => store.setScanAddOn('transport', { enabled: v })} />
          <ToggleRow name="On-site mobilisation (work at client premises)"
            priceLabel={<>₹<SmallInput type="number" value={store.scan.addOns.onsite.ratePerDay} onChange={(e) => store.setScanAddOn('onsite', { ratePerDay: parseFloat(e.target.value) || 0 })} /> per day × <SmallInput type="number" value={store.scan.addOns.onsite.days} min={1} width="40px" onChange={(e) => store.setScanAddOn('onsite', { days: parseInt(e.target.value) || 1 })} /> days</>}
            checked={store.scan.addOns.onsite.enabled} onChange={(v) => store.setScanAddOn('onsite', { enabled: v })} />
          <ToggleRow name="Secure destruction with certificate" tag={<Tag variant="green">DPDP compliant</Tag>}
            priceLabel={<>₹<SmallInput type="number" value={store.scan.addOns.destruction.ratePerBox} onChange={(e) => store.setScanAddOn('destruction', { ratePerBox: parseFloat(e.target.value) || 0 })} /> per box × <SmallInput type="number" value={store.scan.addOns.destruction.boxes} min={1} width="40px" onChange={(e) => store.setScanAddOn('destruction', { boxes: parseInt(e.target.value) || 1 })} /> boxes</>}
            checked={store.scan.addOns.destruction.enabled} onChange={(v) => store.setScanAddOn('destruction', { enabled: v })} />
          <ToggleRow name="Output delivery — encrypted HDD / USB"
            priceLabel={<>₹<SmallInput type="number" value={store.scan.addOns.delivery.rate} onChange={(e) => store.setScanAddOn('delivery', { rate: parseFloat(e.target.value) || 0 })} /> flat charge</>}
            checked={store.scan.addOns.delivery.enabled} onChange={(v) => store.setScanAddOn('delivery', { enabled: v })} />

          <SectionLabel>Turnaround urgency</SectionLabel>
          <RadioGroup
            value={store.scan.urgency.tier}
            onChange={(v) => store.setUrgencyTier(v as UrgencyTier)}
            options={[
              { value: 0, label: 'Standard — 15 working days', right: <span style={{ fontSize: 10, color: '#888' }}>No surcharge</span> },
              {
                value: 1, label: 'Priority — 7 working days',
                right: <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 10, color: '#888' }}>+</span>
                  <SmallInput type="number" value={store.scan.urgency.priorityPct} min={0}
                    onChange={(e) => store.setUrgencyPct(1, parseFloat(e.target.value) || 0)}
                    onClick={(e) => e.stopPropagation()} />
                  <span style={{ fontSize: 10, color: '#888' }}>%</span>
                </div>,
              },
              {
                value: 2, label: 'Express — 3 working days',
                right: <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 10, color: '#888' }}>+</span>
                  <SmallInput type="number" value={store.scan.urgency.expressPct} min={0}
                    onChange={(e) => store.setUrgencyPct(2, parseFloat(e.target.value) || 0)}
                    onClick={(e) => e.stopPropagation()} />
                  <span style={{ fontSize: 10, color: '#888' }}>%</span>
                </div>,
              },
            ]}
          />
        </>
      )}

      {showDms && (
        <>
          <SectionLabel first={!showScan}>{store.serviceMode === 'both' ? 'B' : 'A'} — KRYSTAL DMS licensing</SectionLabel>

          {/* Edition selector */}
          <FormField label="DMS Edition">
            <select className={selectClass} value={store.dms.edition}
              onChange={(e) => {
                const ed = DMS_EDITIONS.find((d) => d.value === e.target.value)!;
                store.setDmsEdition(ed.value, ed.rate);
              }}>
              {DMS_EDITIONS.map((ed) => (
                <option key={ed.value} value={ed.value}>{ed.label} — ₹{ed.rate}/user/mo</option>
              ))}
            </select>
          </FormField>

          {/* Deployment type tabs */}
          <div style={{ display: 'flex', marginTop: 16, marginBottom: 0, borderBottom: '2px solid #e0ddd6' }}>
            {([
              { key: 'premise' as DmsDeployment, label: 'On Premise (Self-Hosted)', icon: '🖥' },
              { key: 'cloud' as DmsDeployment, label: 'On Cloud (SaaS)', icon: '☁' },
            ]).map((tab) => (
              <button key={tab.key}
                onClick={() => store.setDmsDeployment(tab.key)}
                style={{
                  padding: '10px 20px',
                  fontSize: 12,
                  fontWeight: store.dms.deploymentType === tab.key ? 700 : 500,
                  color: store.dms.deploymentType === tab.key ? '#1a2332' : '#888',
                  background: store.dms.deploymentType === tab.key ? '#fff' : 'transparent',
                  border: store.dms.deploymentType === tab.key ? '2px solid #e0ddd6' : '2px solid transparent',
                  borderBottom: store.dms.deploymentType === tab.key ? '2px solid #fff' : '2px solid transparent',
                  borderRadius: '8px 8px 0 0',
                  cursor: 'pointer',
                  marginBottom: -2,
                  transition: 'all 0.15s',
                  letterSpacing: 0.3,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content area */}
          <div style={{ border: '2px solid #e0ddd6', borderTop: 'none', borderRadius: '0 0 10px 10px', padding: 16, background: '#fafaf8' }}>
            {store.dms.deploymentType === 'premise' ? (
              <>
                {/* ON PREMISE */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <FormField label="License Validity">
                    <select className={selectClass} value={store.dms.licenseValidity}
                      onChange={(e) => store.setDmsLicenseValidity(e.target.value as DmsLicenseValidity)}>
                      <option value="annual">Annual</option>
                      <option value="perpetual">Perpetual</option>
                    </select>
                  </FormField>
                  <FormField label="License Type">
                    <select className={selectClass} value={store.dms.licenseType}
                      onChange={(e) => store.setDmsLicenseType(e.target.value as DmsLicenseType)}>
                      <option value="named">Named User</option>
                      <option value="concurrent">Concurrent User</option>
                    </select>
                  </FormField>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 8 }}>
                  <FormField label="Number of Users">
                    <select className={selectClass} value={store.dms.users}
                      onChange={(e) => store.setDmsUsers(parseInt(e.target.value))}>
                      {DMS_PREMISE_USER_COUNTS.map((n) => (
                        <option key={n} value={n}>{n} users</option>
                      ))}
                    </select>
                  </FormField>
                  <FormField label="Rate per user / month (₹)">
                    <input className={inputClass} type="number" value={store.dms.ratePerUser} min={0}
                      onChange={(e) => store.setDmsRate(parseFloat(e.target.value) || 0)} />
                  </FormField>
                </div>

                {/* Plan name badge */}
                {(() => {
                  const plan = getDmsPlanName(store.dms.licenseValidity, store.dms.licenseType);
                  const multiplier = store.dms.licenseType === 'concurrent' ? 1.5 : 1;
                  const months = store.dms.licenseValidity === 'annual' ? 12 : 36;
                  const licenseTotal = store.dms.ratePerUser * multiplier * store.dms.users * months;
                  return (
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      marginTop: 12, padding: '10px 14px',
                      background: 'linear-gradient(135deg, #1a2332 0%, #2a3a4f 100%)',
                      borderRadius: 8, color: '#fff',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 11, opacity: 0.7 }}>Plan:</span>
                        <span style={{
                          fontSize: 13, fontWeight: 700, color: plan.color,
                          textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                        }}>{plan.name}</span>
                        <span style={{ fontSize: 10, opacity: 0.5 }}>
                          ({store.dms.licenseValidity === 'annual' ? 'Annual' : 'Perpetual'} + {store.dms.licenseType === 'named' ? 'Named' : 'Concurrent'})
                        </span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#C4962C' }}>
                          ₹{licenseTotal.toLocaleString('en-IN')}
                        </div>
                        <div style={{ fontSize: 9, opacity: 0.6 }}>
                          {store.dms.licenseValidity === 'annual' ? 'per year' : 'one-time'} + GST
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </>
            ) : (
              <>
                {/* ON CLOUD (SaaS) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <FormField label="Number of Users">
                    <select className={selectClass} value={store.dms.users}
                      onChange={(e) => store.setDmsUsers(parseInt(e.target.value))}>
                      {DMS_CLOUD_USER_COUNTS.map((n) => (
                        <option key={n} value={n}>{n} users</option>
                      ))}
                    </select>
                  </FormField>
                  <FormField label="License Type">
                    <select className={selectClass} value={store.dms.licenseType}
                      onChange={(e) => store.setDmsLicenseType(e.target.value as DmsLicenseType)}>
                      <option value="named">Named User</option>
                      <option value="concurrent">Concurrent User</option>
                    </select>
                  </FormField>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 8 }}>
                  <FormField label="Cloud Storage">
                    <select className={selectClass} value={store.dms.storage}
                      onChange={(e) => store.setDmsStorage(parseInt(e.target.value))}>
                      {DMS_CLOUD_STORAGE_OPTIONS.map((gb) => (
                        <option key={gb} value={gb}>{gb} GB</option>
                      ))}
                    </select>
                  </FormField>
                  <FormField label="Rate per user / month (₹)">
                    <input className={inputClass} type="number" value={store.dms.ratePerUser} min={0}
                      onChange={(e) => store.setDmsRate(parseFloat(e.target.value) || 0)} />
                  </FormField>
                </div>

                {/* Monthly price display */}
                {(() => {
                  const multiplier = store.dms.licenseType === 'concurrent' ? 1.5 : 1;
                  const storageCost = (store.dms.storage / 50) * 50;
                  const monthlyTotal = store.dms.ratePerUser * multiplier * store.dms.users + storageCost;
                  return (
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      marginTop: 12, padding: '10px 14px',
                      background: 'linear-gradient(135deg, #1a2332 0%, #2a3a4f 100%)',
                      borderRadius: 8, color: '#fff',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 11, opacity: 0.7 }}>Cloud SaaS</span>
                        <span style={{ fontSize: 10, opacity: 0.5 }}>
                          ({store.dms.licenseType === 'named' ? 'Named' : 'Concurrent'} | {store.dms.storage} GB storage)
                        </span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#C4962C' }}>
                          ₹{monthlyTotal.toLocaleString('en-IN')}/mo
                        </div>
                        <div style={{ fontSize: 9, opacity: 0.6 }}>
                          ₹{(monthlyTotal * 12).toLocaleString('en-IN')}/year + GST
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </>
            )}

            {/* Common: Add-ons */}
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#1a2332', marginBottom: 8, letterSpacing: 0.5, textTransform: 'uppercase' }}>Add-ons</div>
              <ToggleRow name="Document Editor (ONLYOFFICE)" tag={<Tag variant="blue">editor</Tag>}
                priceLabel={<>₹<SmallInput type="number" value={store.dms.addOns.documentEditor.rate}
                  onChange={(e) => store.setDmsAddOn('documentEditor', { rate: parseFloat(e.target.value) || 0 })} />/user/mo</>}
                checked={store.dms.addOns.documentEditor.enabled}
                onChange={(v) => store.setDmsAddOn('documentEditor', { enabled: v })} />
              <ToggleRow name="E-Signature" tag={<Tag variant="green">sign</Tag>}
                priceLabel={<>₹<SmallInput type="number" value={store.dms.addOns.eSignature.rate}
                  onChange={(e) => store.setDmsAddOn('eSignature', { rate: parseFloat(e.target.value) || 0 })} />/user/mo</>}
                checked={store.dms.addOns.eSignature.enabled}
                onChange={(v) => store.setDmsAddOn('eSignature', { enabled: v })} />
              <ToggleRow name="AI — ChatGPT Integration" tag={<Tag variant="gold">AI</Tag>}
                priceLabel={<>₹<SmallInput type="number" value={store.dms.addOns.aiIntegration.rate}
                  onChange={(e) => store.setDmsAddOn('aiIntegration', { rate: parseFloat(e.target.value) || 0 })} />/user/mo</>}
                checked={store.dms.addOns.aiIntegration.enabled}
                onChange={(v) => store.setDmsAddOn('aiIntegration', { enabled: v })} />
            </div>

            {/* Info note */}
            <div style={{
              marginTop: 12, padding: '8px 12px', fontSize: 10, color: '#666',
              background: '#f0eee8', borderRadius: 6, lineHeight: 1.5,
            }}>
              Includes 1 year free support & upgrades. 18% GST applicable for Indian customers.
            </div>
          </div>
        </>
      )}

      <SectionLabel>GST & discount</SectionLabel>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
        <span style={{ fontSize: 11, color: '#666' }}>GST rate:</span>
        <SmallInput type="number" value={store.gstRate} min={0} max={28} width="60px" onChange={(e) => store.setGstRate(parseFloat(e.target.value) || 0)} />
        <span style={{ fontSize: 10, color: '#888' }}>%</span>
        <span style={{ fontSize: 11, color: '#666', marginLeft: 6 }}>Type:</span>
        <select value={store.gstType} onChange={(e) => store.setGstType(e.target.value as 'split' | 'igst')}
          style={{ fontSize: 11, padding: '5px 8px', border: '1px solid #e0ddd6', borderRadius: 6, background: 'white' }}>
          <option value="split">CGST + SGST (intra-state)</option>
          <option value="igst">IGST (inter-state)</option>
        </select>
        <span style={{ fontSize: 9, color: '#bbb' }}>SAC 998314 @ 18%</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 11, color: '#666' }}>Overall discount:</span>
        <SmallInput type="number" value={store.discountPct} min={0} max={50} width="60px" onChange={(e) => store.setDiscountPct(parseFloat(e.target.value) || 0)} />
        <span style={{ fontSize: 10, color: '#888' }}>%</span>
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: '1rem' }}>
        <Button variant="ghost" onClick={() => store.setStep(2)}>← Back</Button>
        <Button onClick={() => store.setStep(4)}>Preview quotation →</Button>
      </div>
    </Card>
  );
}
