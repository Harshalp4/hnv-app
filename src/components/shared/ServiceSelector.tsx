import type { ServiceMode } from '../../types/quotation';
import styles from './ServiceSelector.module.css';

const SERVICES: { mode: ServiceMode; icon: string; name: string; desc: string; features: string[] }[] = [
  {
    mode: 'scan', icon: '\uD83D\uDCC4', name: 'Scanning only',
    desc: 'Document digitization, indexing & archival',
    features: ['Prep + Scan + QC', 'Multi-level indexing', 'OCR / searchable PDF', 'Secure transport & destruction'],
  },
  {
    mode: 'dms', icon: '\uD83D\uDCBD', name: 'DMS software only',
    desc: 'KRYSTAL DMS licensing & deployment',
    features: ['On-premise or Cloud', 'Named / concurrent users', 'E-signature & editor add-ons', 'AI integration available'],
  },
  {
    mode: 'both', icon: '\uD83D\uDCE6', name: 'Scanning + DMS',
    desc: 'Full digitization project + DMS platform',
    features: ['Complete end-to-end solution', 'Scanning services + DMS license', 'Single quotation, dual sections', 'Best value for large projects'],
  },
];

interface ServiceSelectorProps {
  value: ServiceMode | null;
  onChange: (mode: ServiceMode) => void;
}

export function ServiceSelector({ value, onChange }: ServiceSelectorProps) {
  return (
    <div className={styles.buttons}>
      {SERVICES.map((svc) => (
        <button
          key={svc.mode}
          type="button"
          className={`${styles.btn} ${value === svc.mode ? styles.selected : ''}`}
          onClick={() => onChange(svc.mode)}
        >
          <div className={styles.icon}>{svc.icon}</div>
          <div className={styles.name}>{svc.name}</div>
          <div className={styles.desc}>{svc.desc}</div>
          <div className={styles.features}>
            {svc.features.map((f, i) => (
              <div key={i} className={styles.feature}>{f}</div>
            ))}
          </div>
        </button>
      ))}
    </div>
  );
}
