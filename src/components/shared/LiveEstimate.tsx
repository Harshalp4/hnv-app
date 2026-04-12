import { formatINR } from '../../lib/indianFormat';
import styles from './LiveEstimate.module.css';

interface EstimateItem {
  label: string;
  amount: number;
}

interface LiveEstimateProps {
  items: EstimateItem[];
  discountPct: number;
  discountAmount: number;
  taxableAmount: number;
  gstRate: number;
  gstAmount: number;
}

export function LiveEstimate({ items, discountPct, discountAmount, taxableAmount, gstRate, gstAmount }: LiveEstimateProps) {
  if (!items.length) {
    return <div className={styles.empty}>Configure pricing to see breakdown</div>;
  }
  return (
    <>
      {items.map((item, i) => (
        <div key={i} className={styles.row}>
          <span style={{ flex: 1, paddingRight: 6 }}>{item.label}</span>
          <span className={styles.amount}>{'\u20B9'}{formatINR(item.amount)}</span>
        </div>
      ))}
      {discountPct > 0 && (
        <div className={`${styles.row} ${styles.discount}`}>
          <span>Discount ({discountPct}%)</span>
          <span className={`${styles.amount} ${styles.discount}`}>{'\u2212\u20B9'}{formatINR(discountAmount)}</span>
        </div>
      )}
      <div className={`${styles.row} ${styles.bold}`}>
        <span>Taxable</span>
        <span className={styles.amount}>{'\u20B9'}{formatINR(taxableAmount)}</span>
      </div>
      <div className={styles.row}>
        <span>GST @ {gstRate}%</span>
        <span className={styles.amount}>{'\u20B9'}{formatINR(gstAmount)}</span>
      </div>
    </>
  );
}
