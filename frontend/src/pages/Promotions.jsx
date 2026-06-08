import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../api';

const TITLES = ['New Year Sale', 'Holiday Price Slash', 'Weekend Flash Sale', 'Clearance Discount Offer', 'Seasonal Price Drop'];
const DISCOUNT_TYPES = ['Free', 'Percentage', 'Flat Rate', 'Cashback', 'Buy One Get One', 'Bundle', 'Amount'];
const STATUSES = ['Active', 'Inactive', 'Expired'];
const EMPTY = { Title: '', Description: '', Discount_Type: '', Discount_Value: '', Start_Date: '', End_Date: '', Status: 'Active' };
const statusBadge = s => ({ Active: 'badge-green', Inactive: 'badge-gold', Expired: 'badge-red' }[s] || 'badge-gray');

export default function Promotions() {
  const [promotions, setPromotions] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const load = (q = '') => api.get(`/promotions${q ? `?q=${q}` : ''}`).then(r => setPromotions(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const openAdd  = () => { setForm(EMPTY); setEditId(null); setError(''); setShowModal(true); };
  const openEdit = p => {
    setForm({ Title: p.Title, Description: p.Description || '', Discount_Type: p.Discount_Type, Discount_Value: p.Discount_Value, Start_Date: p.Start_Date?.slice(0, 10), End_Date: p.End_Date?.slice(0, 10), Status: p.Status });
    setEditId(p.PromotionID); setError(''); setShowModal(true);
  };

  const submit = async e => {
    e.preventDefault(); setError('');
    try {
      if (editId) await api.put(`/promotions/${editId}`, form);
      else await api.post('/promotions', form);
      setShowModal(false); load(search);
    } catch (err) { setError(err.response?.data?.message || 'Error saving promotion'); }
  };

  const remove = async id => {
    if (!confirm('Delete this promotion?')) return;
    await api.delete(`/promotions/${id}`); load(search);
  };

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <Layout title="Promotions">
      <div className="card">
        <div className="section-header">
          <h3>Promotions <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '.85rem' }}>({promotions.length})</span></h3>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input className="search-input" value={search}
              onChange={e => { setSearch(e.target.value); load(e.target.value); }}
              placeholder="Search title, type, status…" />
            <button className="btn btn-primary" onClick={openAdd}>+ Add Promotion</button>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {['#', 'Title', 'Discount Type', 'Discount Value', 'Start Date', 'End Date', 'Status', 'By', 'Actions'].map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {promotions.map((p, i) => (
                <tr key={p.PromotionID}>
                  <td style={{ color: 'var(--text-muted)', fontSize: '.78rem' }}>{i + 1}</td>
                  <td style={{ fontWeight: 600, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.Title}</td>
                  <td><span className="badge badge-blue">{p.Discount_Type}</span></td>
                  <td>{p.Discount_Value}</td>
                  <td style={{ fontSize: '.82rem' }}>{p.Start_Date?.slice(0, 10)}</td>
                  <td style={{ fontSize: '.82rem' }}>{p.End_Date?.slice(0, 10)}</td>
                  <td><span className={`badge ${statusBadge(p.Status)}`}>{p.Status}</span></td>
                  <td style={{ fontSize: '.78rem', color: 'var(--text-muted)' }}>{p.UserName}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => remove(p.PromotionID)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!promotions.length && (
                <tr><td colSpan="9" style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>No promotions found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editId ? 'Edit Promotion' : 'Add Promotion'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={submit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Title</label>
                  <select name="Title" value={form.Title} onChange={handle} required>
                    <option value="">Select title</option>
                    {TITLES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea name="Description" value={form.Description} onChange={handle} rows={3} placeholder="Optional…" />
                </div>
                <div className="form-group">
                  <label>Discount Type</label>
                  <select name="Discount_Type" value={form.Discount_Type} onChange={handle} required>
                    <option value="">Select type</option>
                    {DISCOUNT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Discount Value</label>
                  <input type="number" name="Discount_Value" value={form.Discount_Value} onChange={handle} required min="0" step="0.01" />
                </div>
                <div className="form-group">
                  <label>Start Date</label>
                  <input type="date" name="Start_Date" value={form.Start_Date} onChange={handle} required />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input type="date" name="End_Date" value={form.End_Date} onChange={handle} required />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select name="Status" value={form.Status} onChange={handle}>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                {error && <div className="alert alert-error">{error}</div>}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editId ? 'Update' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
