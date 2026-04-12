import styles from './SectionLabel.module.css';

interface SectionLabelProps {
  children: React.ReactNode;
  first?: boolean;
}

export function SectionLabel({ children, first }: SectionLabelProps) {
  return (
    <div className={`${styles.sec} ${first ? styles.first : ''}`}>
      {children}
    </div>
  );
}
