import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../api';

const EMPTY = { Plate_Number: '', Brand: '', Model: '', Year: '', Vehicle_Type: '', Purchase_Price: '', Status: 'Available' };
const STATUSES = ['Available', 'Rented', 'Sold', 'Maintenance'];
const TYPES = ['Sedan', 'SUV', 'Truck', 'Van', 'Bus', 'Motorcycle', 'Pickup'];
const badgeCls = s => ({ Available: 'badge-green', Rented: 'badge-blue', Sold: 'badge-gray', Maintenance: 'badge-gold' }[s] || 'badge-gray');

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const load = (q = '') => api.get(`/vehicles${q ? `?q=${q}` : ''}`).then(r => setVehicles(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const openAdd  = () => { setForm(EMPTY); setEditId(null); setError(''); setShowModal(true); };
  const openEdit = v => { setForm({ Plate_Number: v.Plate_Number, Brand: v.Brand, Model: v.Model, Year: v.Year, Vehicle_Type: v.Vehicle_Type, Purchase_Price: v.Purchase_Price, Status: v.Status }); setEditId(v.VehicleID); setError(''); setShowModal(true); };

  const submit = async e => {
    e.preventDefault(); setError('');
    try {
      if (editId) await api.put(`/vehicles/${editId}`, form);
      else await api.post('/vehicles', form);
      setShowModal(false); load(search);
    } catch (err) { setError(err.response?.data?.message || 'Error saving vehicle'); }
  };

  const remove = async id => {
    if (!confirm('Delete this vehicle?')) return;
    await api.delete(`/vehicles/${id}`); load(search);
  };

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <Layout title="Vehicles">
      <div className="card">
        <div className="section-header">
          <h3>Vehicle Fleet <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '.85rem' }}>({vehicles.length})</span></h3>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input className="search-input" value={search}
              onChange={e => { setSearch(e.target.value); load(e.target.value); }}
              placeholder="Search plate, brand, model…" />
            <button className="btn btn-primary" onClick={openAdd}>+ Add Vehicle</button>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {['#', 'Plate No.', 'Brand', 'Model', 'Year', 'Type', 'Price (RWF)', 'Status', 'By', 'Actions'].map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v, i) => (
                <tr key={v.VehicleID}>
                  <td style={{ color: 'var(--text-muted)', fontSize: '.78rem' }}>{i + 1}</td>
                  <td style={{ fontWeight: 600 }}>{v.Plate_Number}</td>
                  <td>{v.Brand}</td>
                  <td>{v.Model}</td>
                  <td>{v.Year}</td>
                  <td>{v.Vehicle_Type}</td>
                  <td>{Number(v.Purchase_Price).toLocaleString()}</td>
                  <td><span className={`badge ${badgeCls(v.Status)}`}>{v.Status}</span></td>
                  <td style={{ fontSize: '.78rem', color: 'var(--text-muted)' }}>{v.UserName}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(v)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => remove(v.VehicleID)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!vehicles.length && (
                <tr><td colSpan="10" style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>No vehicles found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editId ? 'Edit Vehicle' : 'Add Vehicle'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={submit}>
              <div className="modal-body">
                {[
                  { label: 'Plate Number',       name: 'Plate_Number',   type: 'text'   },
                  { label: 'Brand',              name: 'Brand',          type: 'text'   },
                  { label: 'Model',              name: 'Model',          type: 'text'   },
                  { label: 'Year',               name: 'Year',           type: 'number' },
                  { label: 'Purchase Price (RWF)', name: 'Purchase_Price', type: 'number' },
                ].map(({ label, name, type }) => (
                  <div className="form-group" key={name}>
                    <label>{label}</label>
                    <input type={type} name={name} value={form[name]} onChange={handle} required />
                  </div>
                ))}
                <div className="form-group">
                  <label>Vehicle Type</label>
                  <select name="Vehicle_Type" value={form.Vehicle_Type} onChange={handle} required>
                    <option value="">Select type</option>
                    {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
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
