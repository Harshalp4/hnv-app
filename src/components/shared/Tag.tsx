import styles from './Tag.module.css';

interface TagProps {
  variant: 'gold' | 'blue' | 'green';
  children: React.ReactNode;
}

export function Tag({ variant, children }: TagProps) {
  return <span className={`${styles.tag} ${styles[variant]}`}>{children}</span>;
}
