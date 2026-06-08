import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../api';

const EMPTY = { FirstName: '', LastName: '', Email: '', PhoneNumber: '', Status: 'Active' };
const STATUSES = ['Active', 'Inactive', 'Blocked'];
const statusCls = s => ({ Active: 'bg-emerald-100 text-emerald-700', Inactive: 'bg-amber-100 text-amber-700', Blocked: 'bg-red-100 text-red-700' }[s] || 'bg-slate-100 text-slate-600');

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const load = (q = '') => api.get(`/customers${q ? `?q=${q}` : ''}`).then(r => setCustomers(r.data)).catch(() => {});

  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setError(''); setShowModal(true); };
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
  const inputCls = 'w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 transition';

  return (
    <Layout title="Customers" subtitle="Manage customer records">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <p className="font-bold text-slate-800">Customers</p>
            <p className="text-xs text-slate-400 mt-0.5">{customers.length} records</p>
          </div>
          <input value={search} onChange={e => { setSearch(e.target.value); load(e.target.value); }}
            placeholder="Search by name, email, phone…"
            className="px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 w-full sm:w-64" />
          <button onClick={openAdd}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold hover:from-blue-600 hover:to-indigo-700 transition shadow-sm shrink-0">
            + Add Customer
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50">
                {['#', 'First Name', 'Last Name', 'Email', 'Phone', 'Status', 'Registered', 'By', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.map((c, i) => (
                <tr key={c.CustomerID} className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors">
                  <td className="px-4 py-3 text-slate-400 text-xs">{i + 1}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800">{c.FirstName}</td>
                  <td className="px-4 py-3 text-slate-700">{c.LastName}</td>
                  <td className="px-4 py-3 text-slate-600">{c.Email}</td>
                  <td className="px-4 py-3 text-slate-600">{c.PhoneNumber}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${statusCls(c.Status)}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />{c.Status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{new Date(c.CreatedAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{c.UserName}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(c)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition">Edit</button>
                      <button onClick={() => remove(c.CustomerID)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!customers.length && (
                <tr><td colSpan="9" className="text-center py-16 text-slate-400">
                  <p className="text-4xl mb-2 opacity-30">👥</p>No customers found
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-800">{editId ? 'Edit Customer' : 'Add Customer'}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
            </div>
            <form onSubmit={submit} className="px-6 py-4 space-y-3">
              {[
                { label: 'First Name',    name: 'FirstName',   type: 'text'  },
                { label: 'Last Name',     name: 'LastName',    type: 'text'  },
                { label: 'Email',         name: 'Email',       type: 'email' },
                { label: 'Phone Number',  name: 'PhoneNumber', type: 'tel'   },
              ].map(({ label, name, type }) => (
                <div key={name}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
                  <input type={type} name={name} value={form[name]} onChange={handle} required className={inputCls} />
                </div>
              ))}

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
                <select name="Status" value={form.Status} onChange={handle} className={inputCls}>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {error && <p className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">⚠️ {error}</p>}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition">Cancel</button>
                <button type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-bold hover:from-blue-600 hover:to-indigo-700 transition">
                  {editId ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
