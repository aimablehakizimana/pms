import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../api';

const statusBadge = s => ({ Active: 'badge-green', Inactive: 'badge-gold', Expired: 'badge-red', Available: 'badge-blue', Rented: 'badge-blue', Sold: 'badge-gray', Maintenance: 'badge-gold', Blocked: 'badge-red' }[s] || 'badge-gray');

export default function Report() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');

  const load = (q = '') => api.get(`/report${q ? `?q=${q}` : ''}`).then(r => setRows(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  return (
    <Layout title="Promotion Report">
      <div className="card">
        <div className="section-header no-print">
          <h3>Promotion Performance Report <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '.85rem' }}>({rows.length} records)</span></h3>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input className="search-input" value={search}
              onChange={e => { setSearch(e.target.value); load(e.target.value); }}
              placeholder="Search name, brand, model, title…" />
            <button className="btn btn-primary no-print" onClick={() => window.print()}>🖨️ Print</button>
          </div>
        </div>

        {/* Print-only header */}
        <div style={{ display: 'none' }} className="print-header">
          <h2 style={{ fontWeight: 800, fontSize: '1.1rem' }}>SwiftWheels Enterprises</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '.855rem' }}>Huye City, Southern Province, Rwanda</p>
          <p style={{ fontWeight: 700, marginTop: 8 }}>Promotion Performance Report</p>
          <p style={{ fontSize: '.78rem', color: 'var(--text-muted)' }}>Generated: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <hr style={{ margin: '12px 0', borderColor: 'var(--border)' }} />
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {['#', 'Customer Name', 'Cust. Status', 'Vehicle Brand', 'Vehicle Model', 'Plate No.', 'Promo Title', 'Discount Type', 'Discount Value', 'Promo Status', 'Performance'].map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td style={{ color: 'var(--text-muted)', fontSize: '.78rem' }}>{i + 1}</td>
                  <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{r.CustomerName}</td>
                  <td><span className={`badge ${statusBadge(r.CustomerStatus)}`}>{r.CustomerStatus}</span></td>
                  <td>{r.VehicleBrand}</td>
                  <td>{r.VehicleModel}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '.82rem' }}>{r.Plate_Number}</td>
                  <td style={{ fontWeight: 600, maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.PromotionTitle}</td>
                  <td><span className="badge badge-blue">{r.Discount_Type}</span></td>
                  <td style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>{r.Discount_Value}</td>
                  <td><span className={`badge ${statusBadge(r.PromotionStatus)}`}>{r.PromotionStatus}</span></td>
                  <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.Performance || '—'}</td>
                </tr>
              ))}
              {!rows.length && (
                <tr><td colSpan="11" style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>No report data yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
