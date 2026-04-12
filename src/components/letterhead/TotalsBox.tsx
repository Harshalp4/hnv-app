import { formatINR } from '../../lib/indianFormat';
import { numberToWordsIndian } from '../../lib/indianFormat';
import type { GstType } from '../../types/quotation';
import styles from './TotalsBox.module.css';

interface TotalsBoxProps {
  subtotal: number;
  discountPct: number;
  discountAmount: number;
  taxableAmount: number;
  gstRate: number;
  gstType: GstType;
  gstAmount: number;
  grandTotal: number;
}

export function TotalsBox({
  subtotal, discountPct, discountAmount, taxableAmount,
  gstRate, gstType, gstAmount, grandTotal,
}: TotalsBoxProps) {
  const half = gstRate / 2;
  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.box}>
          <div className={styles.row}><span>Sub-total</span><span>₹{formatINR(subtotal)}</span></div>
          {discountPct > 0 && (
            <div className={`${styles.row} ${styles.discount}`}>
              <span>Discount @ {discountPct}%</span>
              <span>−₹{formatINR(discountAmount)}</span>
            </div>
          )}
          <div className={styles.row}><span>Taxable amount</span><span>₹{formatINR(taxableAmount)}</span></div>
          {gstType === 'igst' ? (
            <div className={styles.row}><span>IGST @ {gstRate}%</span><span>₹{formatINR(gstAmount)}</span></div>
          ) : (
            <>
              <div className={styles.row}><span>CGST @ {half}%</span><span>₹{formatINR(gstAmount / 2)}</span></div>
              <div className={styles.row}><span>SGST @ {half}%</span><span>₹{formatINR(gstAmount / 2)}</span></div>
            </>
          )}
          <div className={`${styles.row} ${styles.grand}`}>
            <span>Grand total</span><span>₹{formatINR(grandTotal)}</span>
          </div>
        </div>
      </div>
      <div className={styles.words}>
        Amount in words: {numberToWordsIndian(grandTotal)}
      </div>
    </>
  );
}
