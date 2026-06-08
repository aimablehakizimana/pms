import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../api';

const TITLES = ['New Year Sale', 'Holiday Price Slash', 'Weekend Flash Sale', 'Clearance Discount Offer', 'Seasonal Price Drop'];
const DISCOUNT_TYPES = ['Free', 'Percentage', 'Flat Rate', 'Cashback', 'Buy One Get One', 'Bundle', 'Amount'];
const STATUSES = ['Active', 'Inactive', 'Expired'];
const EMPTY = { Title: '', Description: '', Discount_Type: '', Discount_Value: '', Start_Date: '', End_Date: '', Status: 'Active' };

const statusCls = s => ({ Active: 'bg-emerald-100 text-emerald-700', Inactive: 'bg-amber-100 text-amber-700', Expired: 'bg-red-100 text-red-700' }[s] || 'bg-slate-100 text-slate-600');
const discountCls = 'bg-blue-100 text-blue-700';

export default function Promotions() {
  const [promotions, setPromotions] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const load = (q = '') => api.get(`/promotions${q ? `?q=${q}` : ''}`).then(r => setPromotions(r.data)).catch(() => {});

  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setError(''); setShowModal(true); };
  const openEdit = p => {
    setForm({
      Title: p.Title, Description: p.Description || '', Discount_Type: p.Discount_Type,
      Discount_Value: p.Discount_Value, Start_Date: p.Start_Date?.slice(0, 10), End_Date: p.End_Date?.slice(0, 10), Status: p.Status
    });
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
  const inputCls = 'w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 transition';

  return (
    <Layout title="Promotions" subtitle="Manage marketing promotions">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <p className="font-bold text-slate-800">Promotions</p>
            <p className="text-xs text-slate-400 mt-0.5">{promotions.length} campaigns</p>
          </div>
          <input value={search} onChange={e => { setSearch(e.target.value); load(e.target.value); }}
            placeholder="Search by title, type, status…"
            className="px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 w-full sm:w-64" />
          <button onClick={openAdd}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold hover:from-blue-600 hover:to-indigo-700 transition shadow-sm shrink-0">
            + Add Promotion
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50">
                {['#', 'Title', 'Discount Type', 'Discount Value', 'Start Date', 'End Date', 'Status', 'By', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {promotions.map((p, i) => (
                <tr key={p.PromotionID} className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors">
                  <td className="px-4 py-3 text-slate-400 text-xs">{i + 1}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800 max-w-[160px] truncate">{p.Title}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${discountCls}`}>{p.Discount_Type}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{p.Discount_Value}</td>
                  <td className="px-4 py-3 text-slate-600">{p.Start_Date?.slice(0, 10)}</td>
                  <td className="px-4 py-3 text-slate-600">{p.End_Date?.slice(0, 10)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${statusCls(p.Status)}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />{p.Status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{p.UserName}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition">Edit</button>
                      <button onClick={() => remove(p.PromotionID)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!promotions.length && (
                <tr><td colSpan="9" className="text-center py-16 text-slate-400">
                  <p className="text-4xl mb-2 opacity-30">🎯</p>No promotions found
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="font-bold text-slate-800">{editId ? 'Edit Promotion' : 'Add Promotion'}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
            </div>
            <form onSubmit={submit} className="px-6 py-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Title</label>
                <select name="Title" value={form.Title} onChange={handle} required className={inputCls}>
                  <option value="">Select title</option>
                  {TITLES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
                <textarea name="Description" value={form.Description} onChange={handle} rows={3}
                  className={inputCls + ' resize-none'} placeholder="Optional description…" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Discount Type</label>
                <select name="Discount_Type" value={form.Discount_Type} onChange={handle} required className={inputCls}>
                  <option value="">Select type</option>
                  {DISCOUNT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Discount Value</label>
                <input type="number" name="Discount_Value" value={form.Discount_Value} onChange={handle} required min="0" step="0.01" className={inputCls} />
              </div>
              {[
                { label: 'Start Date', name: 'Start_Date' },
                { label: 'End Date',   name: 'End_Date'   },
              ].map(({ label, name }) => (
                <div key={name}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
                  <input type="date" name={name} value={form[name]} onChange={handle} required className={inputCls} />
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
