import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  step?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function Card({ children, title, step, className, style }: CardProps) {
  return (
    <div className={`${styles.card} ${className || ''}`} style={style}>
      {title && (
        <div className={styles.title}>
          {step !== undefined && <div className={styles.icon}>{step}</div>}
          {title}
        </div>
      )}
      {children}
    </div>
  );
}
