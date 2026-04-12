import { formatINR } from '../../lib/indianFormat';
import styles from './ImageCalcBar.module.css';

interface ImageCalcBarProps {
  pages: number;
  sides: number;
  images: number;
}

export function ImageCalcBar({ pages, sides, images }: ImageCalcBarProps) {
  return (
    <div className={styles.bar}>
      <div style={{ textAlign: 'center' }}>
        <div className={styles.value}>{formatINR(pages)}</div>
        <div className={styles.label}>Pages</div>
      </div>
      <div className={styles.sep}>{'\u00D7'}</div>
      <div style={{ textAlign: 'center' }}>
        <div className={styles.value}>{sides}</div>
        <div className={styles.label}>Sides</div>
      </div>
      <div className={styles.sep}>=</div>
      <div style={{ textAlign: 'center' }}>
        <div className={styles.value}>{formatINR(images)}</div>
        <div className={styles.label}>Total images <span style={{ fontSize: 9, padding: '1px 6px', borderRadius: 4, fontWeight: 600, background: '#fff3cd', color: '#856404' }}>billing unit</span></div>
      </div>
    </div>
  );
}
