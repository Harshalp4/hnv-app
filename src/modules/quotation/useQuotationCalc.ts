import { useMemo } from 'react';
import { useQuotationStore } from '../../store/useQuotationStore';
import type { QuotationCalcResult, QuotationLineItem } from '../../types/quotation';

export function useQuotationCalc(): QuotationCalcResult {
  const { serviceMode, scan, dms, gstRate, discountPct } = useQuotationStore();

  return useMemo(() => {
    const lines: QuotationLineItem[] = [];
    let subtotal = 0;

    const pages = scan.volume;
    const sides = scan.sides;
    const images = pages * sides;
    const docs = scan.indexing.docCount;

    if (serviceMode === 'scan' || serviceMode === 'both') {
      const urgMultipliers = [1, 1 + scan.urgency.priorityPct / 100, 1 + scan.urgency.expressPct / 100];
      const urgM = urgMultipliers[scan.urgency.tier];
      const urgSuffix = scan.urgency.tier === 1
        ? ` [priority +${scan.urgency.priorityPct}%]`
        : scan.urgency.tier === 2
          ? ` [express +${scan.urgency.expressPct}%]`
          : '';
      const sec = serviceMode === 'both' ? 'A' : '';

      // Core charges
      const prepA = pages * scan.rates.prep * urgM;
      lines.push({ section: sec, description: 'Document preparation — destapling, sorting, repair' + urgSuffix, sac: '998314', qty: pages, unit: 'pages', rate: scan.rates.prep, amount: prepA });

      const scanA = images * scan.rates.scan * urgM;
      lines.push({ section: sec, description: 'Scanning / image capture @ 300 DPI' + urgSuffix, sac: '998314', qty: images, unit: 'images', rate: scan.rates.scan, amount: scanA });

      const qcA = images * scan.rates.qc * urgM;
      lines.push({ section: sec, description: 'Quality control & verification' + urgSuffix, sac: '998314', qty: images, unit: 'images', rate: scan.rates.qc, amount: qcA });

      subtotal += prepA + scanA + qcA;

      // Indexing
      if (docs > 0) {
        const iRate = scan.indexing.rates[scan.indexing.level];
        const iLabels = [
          'No indexing (batch filename)',
          'Basic indexing — 2–3 fields',
          'Standard indexing — 5–7 fields',
          'Detailed indexing — 10+ fields (double-keyed)',
        ];
        if (iRate > 0) {
          const iA = docs * iRate;
          lines.push({ section: sec, description: iLabels[scan.indexing.level], sac: '998314', qty: docs, unit: 'docs', rate: iRate, amount: iA });
          subtotal += iA;
        }
      }

      // Add-ons
      if (scan.addOns.ocr.enabled) {
        const v = images * scan.addOns.ocr.rate * urgM;
        lines.push({ section: sec, description: 'OCR / full-text extraction (searchable PDF)' + urgSuffix, sac: '998314', qty: images, unit: 'images', rate: scan.addOns.ocr.rate, amount: v });
        subtotal += v;
      }
      if (scan.addOns.colour.enabled) {
        const v = images * scan.addOns.colour.rate * urgM;
        lines.push({ section: sec, description: 'Colour scanning surcharge' + urgSuffix, sac: '998314', qty: images, unit: 'images', rate: scan.addOns.colour.rate, amount: v });
        subtotal += v;
      }
      if (scan.addOns.transport.enabled) {
        const v = scan.addOns.transport.ratePerTrip * scan.addOns.transport.trips;
        lines.push({ section: sec, description: 'Secure transport — pickup & delivery', sac: '996811', qty: scan.addOns.transport.trips, unit: 'trips', rate: scan.addOns.transport.ratePerTrip, amount: v });
        subtotal += v;
      }
      if (scan.addOns.onsite.enabled) {
        const v = scan.addOns.onsite.ratePerDay * scan.addOns.onsite.days;
        lines.push({ section: sec, description: 'On-site mobilisation at client premises', sac: '998314', qty: scan.addOns.onsite.days, unit: 'days', rate: scan.addOns.onsite.ratePerDay, amount: v });
        subtotal += v;
      }
      if (scan.addOns.destruction.enabled) {
        const v = scan.addOns.destruction.ratePerBox * scan.addOns.destruction.boxes;
        lines.push({ section: sec, description: 'Secure document destruction with certificate', sac: '998314', qty: scan.addOns.destruction.boxes, unit: 'boxes', rate: scan.addOns.destruction.ratePerBox, amount: v });
        subtotal += v;
      }
      if (scan.addOns.delivery.enabled) {
        const v = scan.addOns.delivery.rate;
        lines.push({ section: sec, description: 'Output delivery — encrypted HDD / USB', sac: '998314', qty: 1, unit: 'lot', rate: v, amount: v });
        subtotal += v;
      }
    }

    if (serviceMode === 'dms' || serviceMode === 'both') {
      const sec = serviceMode === 'both' ? 'B' : '';
      const users = dms.users;
      const rpu = dms.ratePerUser;
      const edLabel = dms.edition.charAt(0).toUpperCase() + dms.edition.slice(1);
      const typeMultiplier = dms.licenseType === 'concurrent' ? 1.5 : 1;
      const typeLabel = dms.licenseType === 'named' ? 'Named User' : 'Concurrent User';

      if (dms.deploymentType === 'premise') {
        // On Premise pricing
        const planNames: Record<string, string> = {
          'annual-named': 'Bronze', 'annual-concurrent': 'Silver',
          'perpetual-named': 'Gold', 'perpetual-concurrent': 'Platinum',
        };
        const planName = planNames[`${dms.licenseValidity}-${dms.licenseType}`];
        const months = dms.licenseValidity === 'annual' ? 12 : 36;
        const licA = rpu * typeMultiplier * users * months;
        const validLabel = dms.licenseValidity === 'annual' ? 'Annual' : 'Perpetual';

        lines.push({
          section: sec,
          description: `KRYSTAL DMS ${edLabel} — ${planName} plan (${validLabel} ${typeLabel}, ${users} users, On Premise)`,
          sac: '997331', qty: users, unit: 'users',
          rate: Math.round(rpu * typeMultiplier * months),
          amount: licA,
        });
        subtotal += licA;
      } else {
        // On Cloud (SaaS) pricing — annualized (12 months)
        const monthlyUserCost = rpu * typeMultiplier * users;
        const storageCost = (dms.storage / 50) * 50; // ₹50 per 50GB/month
        const monthlyTotal = monthlyUserCost + storageCost;
        const annualTotal = monthlyTotal * 12;

        lines.push({
          section: sec,
          description: `KRYSTAL DMS ${edLabel} — Cloud SaaS (${typeLabel}, ${users} users, ${dms.storage} GB storage)`,
          sac: '997331', qty: 12, unit: 'months',
          rate: Math.round(monthlyTotal),
          amount: annualTotal,
        });
        subtotal += annualTotal;
      }

      // Add-ons — per user per month, annualized
      if (dms.addOns.documentEditor.enabled) {
        const months = dms.deploymentType === 'premise'
          ? (dms.licenseValidity === 'annual' ? 12 : 36)
          : 12;
        const v = dms.addOns.documentEditor.rate * users * months;
        lines.push({
          section: sec,
          description: 'Document Editor (ONLYOFFICE)',
          sac: '997331', qty: users, unit: 'users',
          rate: dms.addOns.documentEditor.rate * months,
          amount: v,
        });
        subtotal += v;
      }
      if (dms.addOns.eSignature.enabled) {
        const months = dms.deploymentType === 'premise'
          ? (dms.licenseValidity === 'annual' ? 12 : 36)
          : 12;
        const v = dms.addOns.eSignature.rate * users * months;
        lines.push({
          section: sec,
          description: 'E-Signature',
          sac: '997331', qty: users, unit: 'users',
          rate: dms.addOns.eSignature.rate * months,
          amount: v,
        });
        subtotal += v;
      }
      if (dms.addOns.aiIntegration.enabled) {
        const months = dms.deploymentType === 'premise'
          ? (dms.licenseValidity === 'annual' ? 12 : 36)
          : 12;
        const v = dms.addOns.aiIntegration.rate * users * months;
        lines.push({
          section: sec,
          description: 'AI — ChatGPT Integration',
          sac: '997331', qty: users, unit: 'users',
          rate: dms.addOns.aiIntegration.rate * months,
          amount: v,
        });
        subtotal += v;
      }
    }

    const discountAmount = subtotal * discountPct / 100;
    const taxableAmount = subtotal - discountAmount;
    const gstAmount = taxableAmount * gstRate / 100;
    const grandTotal = taxableAmount + gstAmount;

    return {
      lines,
      subtotal,
      discountAmount,
      taxableAmount,
      gstAmount,
      grandTotal,
      totalImages: images,
      totalPages: pages,
      sides,
    };
  }, [serviceMode, scan, dms, gstRate, discountPct]);
}
