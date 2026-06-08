import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../api';

export default function PromoVehicles() {
  const [promotions, setPromotions] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [links, setLinks] = useState([]);
  const [selectedPromo, setSelectedPromo] = useState('');
  const [form, setForm] = useState({ PromotionID: '', VehicleID: '', Performance: '' });
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/promotions').then(r => setPromotions(r.data)).catch(() => {});
    api.get('/vehicles').then(r => setVehicles(r.data)).catch(() => {});
  }, []);

  const loadLinks = promoId => {
    if (!promoId) { setLinks([]); return; }
    api.get(`/promotion-vehicles/${promoId}`)
      .then(r => setLinks(r.data))
      .catch(err => setError(err.response?.data?.message || 'Failed to load linked vehicles'));
  };

  const openAdd = () => {
    setForm({ PromotionID: selectedPromo || '', VehicleID: '', Performance: '' });
    setEditId(null); setError(''); setShowModal(true);
  };

  const openEdit = link => {
    setForm({ PromotionID: selectedPromo, VehicleID: link.VehicleID, Performance: link.Performance || '' });
    setEditId(link.ID); setError(''); setShowModal(true);
  };

  const submit = async e => {
    e.preventDefault(); setError('');
    try {
      if (editId) {
        await api.put(`/promotion-vehicles/${editId}`, { Performance: form.Performance });
      } else {
        await api.post('/promotion-vehicles', {
          PromotionID: Number(form.PromotionID),
          VehicleID: Number(form.VehicleID),
          Performance: form.Performance
        });
      }
      setShowModal(false); loadLinks(selectedPromo);
    } catch (err) { setError(err.response?.data?.message || 'Error saving link'); }
  };

  const remove = async id => {
    if (!confirm('Remove this vehicle from the promotion?')) return;
    await api.delete(`/promotion-vehicles/${id}`); loadLinks(selectedPromo);
  };

  return (
    <Layout title="Promotion Vehicles">
      {error && !showModal && (
        <div className="alert alert-error" style={{ marginBottom: 16 }}>
          {error} <button onClick={() => setError('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>✕</button>
        </div>
      )}

      <div className="card">
        <div className="section-header">
          <h3>Promotion → Vehicle Links <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '.85rem' }}>({links.length})</span></h3>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <select value={selectedPromo}
              onChange={e => { setSelectedPromo(e.target.value); loadLinks(e.target.value); }}
              style={{ padding: '9px 14px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: '.855rem', fontFamily: 'inherit', outline: 'none', minWidth: 220 }}>
              <option value="">— Select Promotion —</option>
              {promotions.map(p => <option key={p.PromotionID} value={p.PromotionID}>{p.Title}</option>)}
            </select>
            <button className="btn btn-primary" onClick={openAdd}>+ Link Vehicle</button>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {['#', 'Plate No.', 'Brand', 'Model', 'Year', 'Type', 'Status', 'Performance', 'Actions'].map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {links.map((l, i) => (
                <tr key={l.ID}>
                  <td style={{ color: 'var(--text-muted)', fontSize: '.78rem' }}>{i + 1}</td>
                  <td style={{ fontWeight: 600 }}>{l.Plate_Number}</td>
                  <td>{l.Brand}</td>
                  <td>{l.Model}</td>
                  <td>{l.Year}</td>
                  <td>{l.Vehicle_Type}</td>
                  <td><span className="badge badge-gray">{l.Status}</span></td>
                  <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.Performance || '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(l)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => remove(l.ID)}>Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!links.length && (
                <tr><td colSpan="9" style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
                  {selectedPromo ? 'No vehicles linked to this promotion' : 'Select a promotion to view linked vehicles'}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editId ? 'Edit Performance' : 'Link Vehicle to Promotion'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={submit}>
              <div className="modal-body">
                {!editId && (
                  <>
                    <div className="form-group">
                      <label>Promotion</label>
                      <select value={form.PromotionID} onChange={e => setForm({ ...form, PromotionID: e.target.value })} required>
                        <option value="">Select promotion</option>
                        {promotions.map(p => <option key={p.PromotionID} value={p.PromotionID}>{p.Title}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Vehicle</label>
                      <select value={form.VehicleID} onChange={e => setForm({ ...form, VehicleID: e.target.value })} required>
                        <option value="">Select vehicle</option>
                        {vehicles.map(v => <option key={v.VehicleID} value={v.VehicleID}>{v.Plate_Number} — {v.Brand} {v.Model}</option>)}
                      </select>
                    </div>
                  </>
                )}
                <div className="form-group">
                  <label>Performance Notes</label>
                  <textarea value={form.Performance} onChange={e => setForm({ ...form, Performance: e.target.value })}
                    rows={3} placeholder="e.g. High bookings, 30% revenue increase…" />
                </div>
                {error && <div className="alert alert-error">{error}</div>}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editId ? 'Update' : 'Link'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
