import { Toggle } from './Toggle';
import styles from './ToggleRow.module.css';

interface ToggleRowProps {
  name: string;
  priceLabel: React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  tag?: React.ReactNode;
}

export function ToggleRow({ name, priceLabel, checked, onChange, tag }: ToggleRowProps) {
  return (
    <div className={styles.row}>
      <div className={styles.left}>
        <div className={styles.name}>{name} {tag}</div>
        <div className={styles.price}>{priceLabel}</div>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}
