import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../api';

const EMPTY = { FirstName: '', LastName: '', Email: '', PhoneNumber: '', Status: 'Active' };
const STATUSES = ['Active', 'Inactive', 'Blocked'];
const badgeCls = s => ({ Active: 'badge-green', Inactive: 'badge-gold', Blocked: 'badge-red' }[s] || 'badge-gray');

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const load = (q = '') => api.get(`/customers${q ? `?q=${q}` : ''}`).then(r => setCustomers(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const openAdd  = () => { setForm(EMPTY); setEditId(null); setError(''); setShowModal(true); };
  const openEdit = c => { setForm({ FirstName: c.FirstName, LastName: c.LastName, Email: c.Email, PhoneNumber: c.PhoneNumber, Status: c.Status }); setEditId(c.CustomerID); setError(''); setShowModal(true); };

  const submit = async e => {
    e.preventDefault(); setError('');
    try {
      if (editId) await api.put(`/customers/${editId}`, form);
      else await api.post('/customers', form);
      setShowModal(false); load(search);
    } catch (err) { setError(err.response?.data?.message || 'Error saving customer'); }
  };

  const remove = async id => {
    if (!confirm('Delete this customer?')) return;
    await api.delete(`/customers/${id}`); load(search);
  };

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <Layout title="Customers">
      <div className="card">
        <div className="section-header">
          <h3>Customers <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '.85rem' }}>({customers.length})</span></h3>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input className="search-input" value={search}
              onChange={e => { setSearch(e.target.value); load(e.target.value); }}
              placeholder="Search name, email, phone…" />
            <button className="btn btn-primary" onClick={openAdd}>+ Add Customer</button>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {['#', 'First Name', 'Last Name', 'Email', 'Phone', 'Status', 'Registered', 'By', 'Actions'].map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {customers.map((c, i) => (
                <tr key={c.CustomerID}>
                  <td style={{ color: 'var(--text-muted)', fontSize: '.78rem' }}>{i + 1}</td>
                  <td style={{ fontWeight: 600 }}>{c.FirstName}</td>
                  <td>{c.LastName}</td>
                  <td>{c.Email}</td>
                  <td>{c.PhoneNumber}</td>
                  <td><span className={`badge ${badgeCls(c.Status)}`}>{c.Status}</span></td>
                  <td style={{ fontSize: '.78rem', color: 'var(--text-muted)' }}>{new Date(c.CreatedAt).toLocaleDateString()}</td>
                  <td style={{ fontSize: '.78rem', color: 'var(--text-muted)' }}>{c.UserName}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(c)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => remove(c.CustomerID)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!customers.length && (
                <tr><td colSpan="9" style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>No customers found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editId ? 'Edit Customer' : 'Add Customer'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={submit}>
              <div className="modal-body">
                {[
                  { label: 'First Name',   name: 'FirstName',   type: 'text'  },
                  { label: 'Last Name',    name: 'LastName',    type: 'text'  },
                  { label: 'Email',        name: 'Email',       type: 'email' },
                  { label: 'Phone Number', name: 'PhoneNumber', type: 'tel'   },
                ].map(({ label, name, type }) => (
                  <div className="form-group" key={name}>
                    <label>{label}</label>
                    <input type={type} name={name} value={form[name]} onChange={handle} required />
                  </div>
                ))}
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
