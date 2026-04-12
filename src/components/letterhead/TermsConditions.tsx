import styles from './TermsConditions.module.css';

interface TermsConditionsProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
}

export function TermsConditions({ value, onChange, readOnly }: TermsConditionsProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.label}>Terms &amp; conditions</div>
      {readOnly ? (
        <div className={styles.text}>{value}</div>
      ) : (
        <textarea
          className={styles.textarea}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
      )}
    </div>
  );
}
