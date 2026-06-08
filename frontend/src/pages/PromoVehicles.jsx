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

  const loadLinks = (promoId) => {
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
      setShowModal(false);
      loadLinks(selectedPromo);
    } catch (err) { setError(err.response?.data?.message || 'Error saving link'); }
  };

  const remove = async id => {
    if (!confirm('Remove this vehicle from the promotion?')) return;
    await api.delete(`/promotion-vehicles/${id}`); loadLinks(selectedPromo);
  };

  const inputCls = 'w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 transition';

  return (
    <Layout title="Promotion Vehicles" subtitle="Link vehicles to promotions and track performance">
      {error && !showModal && (
        <div className="mb-4 flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          ⚠️ {error} <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-600">✕</button>
        </div>
      )}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <p className="font-bold text-slate-800">Promotion → Vehicle Links</p>
            <p className="text-xs text-slate-400 mt-0.5">Select a promotion to view linked vehicles</p>
          </div>
          <select value={selectedPromo} onChange={e => { setSelectedPromo(e.target.value); loadLinks(e.target.value); }}
            className="px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/40 w-full sm:w-64">
            <option value="">— Select Promotion —</option>
            {promotions.map(p => <option key={p.PromotionID} value={p.PromotionID}>{p.Title}</option>)}
          </select>
          <button onClick={openAdd}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold hover:from-blue-600 hover:to-indigo-700 transition shadow-sm shrink-0">
            + Link Vehicle
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50">
                {['#', 'Plate Number', 'Brand', 'Model', 'Year', 'Type', 'Vehicle Status', 'Performance', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {links.map((l, i) => (
                <tr key={l.ID} className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors">
                  <td className="px-4 py-3 text-slate-400 text-xs">{i + 1}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800">{l.Plate_Number}</td>
                  <td className="px-4 py-3 text-slate-700">{l.Brand}</td>
                  <td className="px-4 py-3 text-slate-700">{l.Model}</td>
                  <td className="px-4 py-3 text-slate-600">{l.Year}</td>
                  <td className="px-4 py-3 text-slate-600">{l.Vehicle_Type}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">{l.Status}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 max-w-[180px] truncate">{l.Performance || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(l)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition">Edit</button>
                      <button onClick={() => remove(l.ID)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition">Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!links.length && (
                <tr><td colSpan="9" className="text-center py-16 text-slate-400">
                  <p className="text-4xl mb-2 opacity-30">🔗</p>
                  {selectedPromo ? 'No vehicles linked to this promotion' : 'Select a promotion to view linked vehicles'}
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
              <h2 className="font-bold text-slate-800">{editId ? 'Edit Performance' : 'Link Vehicle to Promotion'}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
            </div>
            <form onSubmit={submit} className="px-6 py-4 space-y-3">
              {!editId && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Promotion</label>
                    <select name="PromotionID" value={form.PromotionID} onChange={e => setForm({ ...form, PromotionID: e.target.value })} required className={inputCls}>
                      <option value="">Select promotion</option>
                      {promotions.map(p => <option key={p.PromotionID} value={p.PromotionID}>{p.Title}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Vehicle</label>
                    <select name="VehicleID" value={form.VehicleID} onChange={e => setForm({ ...form, VehicleID: e.target.value })} required className={inputCls}>
                      <option value="">Select vehicle</option>
                      {vehicles.map(v => <option key={v.VehicleID} value={v.VehicleID}>{v.Plate_Number} — {v.Brand} {v.Model}</option>)}
                    </select>
                  </div>
                </>
              )}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Performance Notes</label>
                <textarea name="Performance" value={form.Performance} onChange={e => setForm({ ...form, Performance: e.target.value })}
                  rows={3} className={inputCls + ' resize-none'} placeholder="e.g. High bookings, 30% revenue increase…" />
              </div>

              {error && <p className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">⚠️ {error}</p>}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition">Cancel</button>
                <button type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-bold hover:from-blue-600 hover:to-indigo-700 transition">
                  {editId ? 'Update' : 'Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
