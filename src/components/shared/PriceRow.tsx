import styles from './PriceRow.module.css';

interface PriceRowProps {
  label: string;
  sublabel?: string;
  rate: number;
  onRateChange: (rate: number) => void;
  unit: string;
  core?: boolean;
  tag?: React.ReactNode;
}

export function PriceRow({ label, sublabel, rate, onRateChange, unit, core, tag }: PriceRowProps) {
  return (
    <div className={`${styles.row} ${core ? styles.core : ''}`}>
      <div className={styles.label}>
        {label} {tag}
        {sublabel && <div className={styles.sub}>{sublabel}</div>}
      </div>
      <span className={styles.unit}>{'\u20B9'}</span>
      <input
        className={styles.rateInput}
        type="number"
        value={rate}
        min={0}
        step={0.05}
        onChange={(e) => onRateChange(parseFloat(e.target.value) || 0)}
      />
      <span className={styles.unit}>/{unit}</span>
    </div>
  );
}
