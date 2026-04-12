import styles from './ScopeOfWork.module.css';

interface ScopeOfWorkProps {
  text: string;
}

export function ScopeOfWork({ text }: ScopeOfWorkProps) {
  return <div className={styles.scope}>{text}</div>;
}
