import { formatINR } from '../../lib/indianFormat';
import styles from './GrandTotalCard.module.css';

interface GrandTotalCardProps {
  total: number;
  gstRate: number;
  discountPct: number;
}

export function GrandTotalCard({ total, gstRate, discountPct }: GrandTotalCardProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.label}>Grand total (incl. GST)</div>
      <div className={styles.amount}>{'\u20B9'}{formatINR(total)}</div>
      <div className={styles.sub}>
        {total > 0 ? `GST ${gstRate}% incl. | Discount ${discountPct}%` : 'Configure services above'}
      </div>
    </div>
  );
}
