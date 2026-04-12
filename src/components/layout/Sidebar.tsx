import { NavLink } from 'react-router';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { to: '/quotation', icon: '📄', label: 'Quotation' },
  { to: '/invoice', icon: '🧾', label: 'Invoice' },
  { to: '/proposal', icon: '📋', label: 'Proposal' },
  { to: '/profile', icon: '🏢', label: 'Company Profile' },
  { to: '/history', icon: '📚', label: 'Client History' },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.logo}>HNV</div>
        <div>
          <div className={styles.brandName}>HNV Techno Solutions</div>
          <div className={styles.brandSub}>Document Management Platform</div>
        </div>
      </div>
      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
            onClick={onNavigate}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className={styles.footer}>
        HNV Techno Solutions Pvt. Ltd.<br />
        ISO 9001:2015 Certified
      </div>
    </aside>
  );
}
