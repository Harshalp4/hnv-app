import styles from './SignatureBlock.module.css';

interface SignatureBlockProps {
  clientName: string;
}

export function SignatureBlock({ clientName }: SignatureBlockProps) {
  return (
    <div className={styles.row}>
      <div className={styles.box}>
        <div className={styles.line} />
        <div className={styles.name}>Client acceptance</div>
        <div className={styles.sub}>{clientName || '—'}</div>
      </div>
      <div className={styles.box}>
        <div className={styles.line} />
        <div className={styles.name}>For HNV Techno Solutions Pvt. Ltd.</div>
        <div className={styles.sub}>Authorized Signatory</div>
      </div>
    </div>
  );
}
