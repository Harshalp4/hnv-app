import React from 'react';
import styles from './Letterhead.module.css';

interface LetterheadProps {
  address: string;
  title: string;
  billTo: {
    companyName: string;
    contactPerson: string;
    email: string;
    city: string;
    gstin?: string;
  };
  details: { label: string; value: string }[];
  children: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
}

export const Letterhead = React.forwardRef<HTMLDivElement, LetterheadProps>(
  function Letterhead({ address, title, billTo, details, children }, ref) {
    const addressLines = address.split('\n');
    return (
      <div className={styles.letterhead} ref={ref}>
        <div className={styles.header}>
          <div>
            <div className={styles.company}>HNV TECHNO SOLUTIONS PVT. LTD.</div>
            <div className={styles.tagline}>Document Digitization &amp; Information Management Solutions</div>
          </div>
          <div className={styles.contact}>
            {addressLines.map((line, i) => (
              <React.Fragment key={i}>{line}<br /></React.Fragment>
            ))}
          </div>
        </div>
        <div className={styles.bar} />
        <div className={styles.body}>
          <div className={styles.meta}>
            <div>
              <div className={styles.metaHeader}>Bill to</div>
              <strong>{billTo.companyName || '—'}</strong><br />
              Attn: {billTo.contactPerson || '—'}<br />
              {billTo.email || '—'}<br />
              {billTo.city ? `${billTo.city}, India` : '—'}<br />
              {billTo.gstin && (
                <span style={{ color: '#aaa', fontSize: '8px' }}>GSTIN: {billTo.gstin}</span>
              )}
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className={styles.metaHeader}>Document details</div>
              {details.map((d, i) => (
                <React.Fragment key={i}>
                  {d.label}: <strong>{d.value}</strong><br />
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className={styles.docTitle}>{title}</div>
          {children}
        </div>
        <div className={styles.footer}>
          HNV Techno Solutions Pvt. Ltd. &nbsp;|&nbsp; Mahape, Navi Mumbai — 400 710 &nbsp;|&nbsp; GSTIN: 27AABCH1234N1ZX &nbsp;|&nbsp; CIN: U72900MH2020PTC000000 &nbsp;|&nbsp; ISO 9001:2015 Certified
        </div>
      </div>
    );
  }
);
