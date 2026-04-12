import { useState, useMemo } from 'react';
import { useClientHistoryStore } from '../../store/useClientHistoryStore';
import type { HistoryEntry } from '../../store/useClientHistoryStore';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';
import { FormField, inputClass, selectClass } from '../../components/shared/FormField';
import { formatINR } from '../../lib/indianFormat';

export function ClientHistoryPage() {
  const { entries, removeEntry } = useClientHistoryStore();
  const [search, setSearch] = useState('');
  const [docTypeFilter, setDocTypeFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortKey, setSortKey] = useState<keyof HistoryEntry>('date');
  const [sortAsc, setSortAsc] = useState(false);

  const filtered = useMemo(() => {
    let list = entries;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((e) =>
        e.clientName.toLowerCase().includes(q) ||
        e.contactPerson.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.refNumber.toLowerCase().includes(q)
      );
    }
    if (docTypeFilter !== 'all') {
      list = list.filter((e) => e.docType === docTypeFilter);
    }
    if (dateFrom) list = list.filter((e) => e.date >= dateFrom);
    if (dateTo) list = list.filter((e) => e.date <= dateTo);

    return [...list].sort((a, b) => {
      const av = a[sortKey] as string | number, bv = b[sortKey] as string | number;
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortAsc ? cmp : -cmp;
    });
  }, [entries, search, docTypeFilter, dateFrom, dateTo, sortKey, sortAsc]);

  const toggleSort = (key: keyof HistoryEntry) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const sortArrow = (key: keyof HistoryEntry) => sortKey === key ? (sortAsc ? ' ▲' : ' ▼') : '';

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white', borderRadius: 12, padding: '0.75rem 1.25rem', marginBottom: '0.75rem', border: '1px solid #e8e6e0' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 38, height: 38, background: '#1a2744', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9a84c', fontSize: 11, fontWeight: 700 }}>HNV</div>
          <div style={{ marginLeft: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Client History</div>
            <div style={{ fontSize: 10, color: '#888' }}>All generated documents</div>
          </div>
        </div>
        <span style={{ fontSize: 10, color: '#888' }}>{entries.length} records</span>
      </div>

      <Card style={{ marginBottom: '0.75rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 10, alignItems: 'end' }}>
          <FormField label="Search">
            <input className={inputClass} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Client name, email, ref #..." />
          </FormField>
          <FormField label="Document type">
            <select className={selectClass} value={docTypeFilter} onChange={(e) => setDocTypeFilter(e.target.value)}>
              <option value="all">All types</option>
              <option value="quotation">Quotation</option>
              <option value="invoice">Invoice</option>
              <option value="proposal">Proposal</option>
            </select>
          </FormField>
          <FormField label="Date from">
            <input className={inputClass} type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          </FormField>
          <FormField label="Date to">
            <input className={inputClass} type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </FormField>
        </div>
      </Card>

      <Card>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#ccc', fontSize: 12 }}>
            {entries.length === 0 ? 'No documents generated yet. Create a quotation or invoice to see it here.' : 'No matching records found.'}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e8e6e0' }}>
                  <th onClick={() => toggleSort('clientName')} style={{ cursor: 'pointer', padding: '8px 6px', textAlign: 'left', fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.3, color: '#666', fontWeight: 700 }}>Client{sortArrow('clientName')}</th>
                  <th onClick={() => toggleSort('contactPerson')} style={{ cursor: 'pointer', padding: '8px 6px', textAlign: 'left', fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.3, color: '#666', fontWeight: 700 }}>Contact{sortArrow('contactPerson')}</th>
                  <th onClick={() => toggleSort('date')} style={{ cursor: 'pointer', padding: '8px 6px', textAlign: 'left', fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.3, color: '#666', fontWeight: 700 }}>Date{sortArrow('date')}</th>
                  <th onClick={() => toggleSort('docType')} style={{ cursor: 'pointer', padding: '8px 6px', textAlign: 'left', fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.3, color: '#666', fontWeight: 700 }}>Type{sortArrow('docType')}</th>
                  <th onClick={() => toggleSort('refNumber')} style={{ cursor: 'pointer', padding: '8px 6px', textAlign: 'left', fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.3, color: '#666', fontWeight: 700 }}>Ref #{sortArrow('refNumber')}</th>
                  <th onClick={() => toggleSort('amount')} style={{ cursor: 'pointer', padding: '8px 6px', textAlign: 'right', fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.3, color: '#666', fontWeight: 700 }}>Amount{sortArrow('amount')}</th>
                  <th style={{ padding: '8px 6px', textAlign: 'center', fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.3, color: '#666', fontWeight: 700 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry) => (
                  <tr key={entry.id} style={{ borderBottom: '1px solid #f0ede8' }}>
                    <td style={{ padding: '8px 6px', fontWeight: 500 }}>{entry.clientName || '—'}</td>
                    <td style={{ padding: '8px 6px', color: '#666' }}>{entry.contactPerson || '—'}</td>
                    <td style={{ padding: '8px 6px', color: '#666' }}>{entry.date ? new Date(entry.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</td>
                    <td style={{ padding: '8px 6px' }}>
                      <span style={{
                        fontSize: 9, padding: '2px 8px', borderRadius: 12, fontWeight: 600,
                        background: entry.docType === 'quotation' ? '#e6f1fb' : entry.docType === 'invoice' ? '#e8f5e9' : '#fff3cd',
                        color: entry.docType === 'quotation' ? '#0c447c' : entry.docType === 'invoice' ? '#1b5e20' : '#856404',
                      }}>
                        {entry.docType}
                      </span>
                    </td>
                    <td style={{ padding: '8px 6px', fontFamily: 'monospace', fontSize: 10 }}>{entry.refNumber}</td>
                    <td style={{ padding: '8px 6px', textAlign: 'right', fontWeight: 600, color: '#1a2744' }}>₹{formatINR(entry.amount)}</td>
                    <td style={{ padding: '8px 6px', textAlign: 'center' }}>
                      <Button variant="danger" onClick={() => removeEntry(entry.id)} style={{ padding: '3px 8px', fontSize: 10 }}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
