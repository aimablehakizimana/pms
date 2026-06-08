import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../api';

const EMPTY = { Plate_Number: '', Brand: '', Model: '', Year: '', Vehicle_Type: '', Purchase_Price: '', Status: 'Available' };
const STATUSES = ['Available', 'Rented', 'Sold', 'Maintenance'];
const TYPES = ['Sedan', 'SUV', 'Truck', 'Van', 'Bus', 'Motorcycle', 'Pickup'];

const statusCls = s => ({ Available: 'bg-emerald-100 text-emerald-700', Rented: 'bg-blue-100 text-blue-700', Sold: 'bg-slate-100 text-slate-700', Maintenance: 'bg-amber-100 text-amber-700' }[s] || 'bg-slate-100 text-slate-600');

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const load = (q = '') => api.get(`/vehicles${q ? `?q=${q}` : ''}`).then(r => setVehicles(r.data)).catch(() => {});

  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setError(''); setShowModal(true); };
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

  const inputCls = 'w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 transition';

  return (
    <Layout title="Vehicles" subtitle="Manage vehicle fleet">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <p className="font-bold text-slate-800">Vehicle Fleet</p>
            <p className="text-xs text-slate-400 mt-0.5">{vehicles.length} vehicles</p>
          </div>
          <input value={search} onChange={e => { setSearch(e.target.value); load(e.target.value); }}
            placeholder="Search by plate, brand, model…"
            className="px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 w-full sm:w-64" />
          <button onClick={openAdd}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold hover:from-blue-600 hover:to-indigo-700 transition shadow-sm shrink-0">
            + Add Vehicle
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50">
                {['#', 'Plate', 'Brand', 'Model', 'Year', 'Type', 'Price (RWF)', 'Status', 'By', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v, i) => (
                <tr key={v.VehicleID} className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors">
                  <td className="px-4 py-3 text-slate-400 text-xs">{i + 1}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800">{v.Plate_Number}</td>
                  <td className="px-4 py-3 text-slate-700">{v.Brand}</td>
                  <td className="px-4 py-3 text-slate-700">{v.Model}</td>
                  <td className="px-4 py-3 text-slate-600">{v.Year}</td>
                  <td className="px-4 py-3 text-slate-600">{v.Vehicle_Type}</td>
                  <td className="px-4 py-3 text-slate-700">{Number(v.Purchase_Price).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${statusCls(v.Status)}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />{v.Status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{v.UserName}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(v)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition">Edit</button>
                      <button onClick={() => remove(v.VehicleID)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!vehicles.length && (
                <tr><td colSpan="10" className="text-center py-16 text-slate-400">
                  <p className="text-4xl mb-2 opacity-30">🚗</p>No vehicles found
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
              <h2 className="font-bold text-slate-800">{editId ? 'Edit Vehicle' : 'Add Vehicle'}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
            </div>
            <form onSubmit={submit} className="px-6 py-4 space-y-3">
              {[
                { label: 'Plate Number', name: 'Plate_Number', type: 'text' },
                { label: 'Brand',        name: 'Brand',        type: 'text' },
                { label: 'Model',        name: 'Model',        type: 'text' },
                { label: 'Year',         name: 'Year',         type: 'number' },
                { label: 'Purchase Price (RWF)', name: 'Purchase_Price', type: 'number' },
              ].map(({ label, name, type }) => (
                <div key={name}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
                  <input type={type} name={name} value={form[name]} onChange={handle} required className={inputCls} />
                </div>
              ))}

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Vehicle Type</label>
                <select name="Vehicle_Type" value={form.Vehicle_Type} onChange={handle} required className={inputCls}>
                  <option value="">Select type</option>
                  {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
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
