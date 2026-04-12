import { useState } from 'react';
import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import styles from './AppShell.module.css';

export function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={styles.shell}>
      {/* Mobile header */}
      <div className={styles.mobileHeader}>
        <button className={styles.hamburger} onClick={() => setMenuOpen(true)}>
          <span /><span /><span />
        </button>
        <div className={styles.mobileTitle}>HNV Techno Solutions</div>
      </div>

      {/* Sidebar overlay for mobile */}
      {menuOpen && <div className={styles.overlay} onClick={() => setMenuOpen(false)} />}
      <div className={`${styles.sidebarWrap} ${menuOpen ? styles.sidebarOpen : ''}`}>
        <Sidebar onNavigate={() => setMenuOpen(false)} />
      </div>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
