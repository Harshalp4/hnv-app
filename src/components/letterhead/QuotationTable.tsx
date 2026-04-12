import { formatINR, formatDecimal } from '../../lib/indianFormat';
import styles from './QuotationTable.module.css';

export interface TableLine {
  section: string;
  description: string;
  sac: string;
  qty: number;
  unit: string;
  rate: number;
  amount: number;
}

interface QuotationTableProps {
  lines: TableLine[];
  showSections?: boolean;
}

export function QuotationTable({ lines, showSections }: QuotationTableProps) {
  let sn = 1;
  let lastSection = '';

  return (
    <div className={styles.scrollWrap}>
    <table className={styles.table}>
      <thead>
        <tr>
          <th style={{ width: 22 }}>#</th>
          <th>Description of service</th>
          <th style={{ width: 44 }}>SAC</th>
          <th style={{ width: 50, textAlign: 'right' }}>Qty</th>
          <th style={{ width: 38, textAlign: 'center' }}>Unit</th>
          <th style={{ width: 56, textAlign: 'right' }}>Rate (₹)</th>
          <th style={{ width: 68, textAlign: 'right' }}>Amount (₹)</th>
        </tr>
      </thead>
      <tbody>
        {lines.length === 0 ? (
          <tr>
            <td colSpan={7} style={{ textAlign: 'center', color: '#ccc', padding: 14 }}>
              No items — configure pricing first
            </td>
          </tr>
        ) : (
          lines.map((line, i) => {
            const rows: React.ReactNode[] = [];
            if (showSections && line.section && line.section !== lastSection) {
              lastSection = line.section;
              rows.push(
                <tr key={`grp-${i}`} className={styles.groupRow}>
                  <td colSpan={7}>
                    {line.section === 'A'
                      ? 'Section A — Scanning & Digitization Services'
                      : 'Section B — DMS Software Licensing'}
                  </td>
                </tr>
              );
            }
            rows.push(
              <tr key={i}>
                <td>{sn++}</td>
                <td>{line.description}</td>
                <td className={styles.center}>{line.sac}</td>
                <td className={styles.right}>{formatINR(line.qty)}</td>
                <td className={styles.center}>{line.unit}</td>
                <td className={styles.right}>{formatDecimal(line.rate)}</td>
                <td className={styles.right}>{formatINR(line.amount)}</td>
              </tr>
            );
            return rows;
          })
        )}
      </tbody>
    </table>
    </div>
  );
}
