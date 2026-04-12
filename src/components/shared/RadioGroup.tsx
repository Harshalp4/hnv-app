import styles from './RadioGroup.module.css';

interface RadioOption {
  value: number;
  label: React.ReactNode;
  description?: string;
  right?: React.ReactNode;
}

interface RadioGroupProps {
  options: RadioOption[];
  value: number;
  onChange: (value: number) => void;
}

export function RadioGroup({ options, value, onChange }: RadioGroupProps) {
  return (
    <>
      {options.map((opt) => (
        <div
          key={opt.value}
          className={`${styles.row} ${value === opt.value ? styles.selected : ''}`}
          onClick={() => onChange(opt.value)}
        >
          <div className={`${styles.dot} ${value === opt.value ? styles.dotOn : ''}`} />
          <div className={styles.label}>
            {opt.label}
            {opt.description && <div className={styles.sub}>{opt.description}</div>}
          </div>
          {opt.right}
        </div>
      ))}
    </>
  );
}
