import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../api';

export default function Report() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');

  const load = (q = '') => api.get(`/report${q ? `?q=${q}` : ''}`).then(r => setRows(r.data)).catch(() => {});

  useEffect(() => { load(); }, []);

  const print = () => window.print();

  const statusCls = s => ({ Active: 'bg-emerald-100 text-emerald-700', Inactive: 'bg-amber-100 text-amber-700', Expired: 'bg-red-100 text-red-700', Available: 'bg-blue-100 text-blue-700', Rented: 'bg-violet-100 text-violet-700', Sold: 'bg-slate-100 text-slate-700', Maintenance: 'bg-orange-100 text-orange-700', Blocked: 'bg-red-100 text-red-700' }[s] || 'bg-slate-100 text-slate-600');

  return (
    <Layout title="Promotion Report" subtitle="Customer × Vehicle × Promotion performance overview">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center gap-3 print:hidden">
          <div className="flex-1">
            <p className="font-bold text-slate-800">Promotion Performance Report</p>
            <p className="text-xs text-slate-400 mt-0.5">{rows.length} records</p>
          </div>
          <input value={search} onChange={e => { setSearch(e.target.value); load(e.target.value); }}
            placeholder="Search by name, brand, model, title…"
            className="px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 w-full sm:w-64" />
          <button onClick={print}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold hover:from-blue-600 hover:to-indigo-700 transition shadow-sm shrink-0">
            🖨️ Print Report
          </button>
        </div>

        {/* Print header */}
        <div className="hidden print:block px-6 pt-6 pb-4 border-b border-slate-200">
          <h1 className="text-xl font-extrabold text-slate-900">SwiftWheels Enterprises</h1>
          <p className="text-sm text-slate-500">Huye City, Southern Province, Rwanda</p>
          <h2 className="text-lg font-bold text-slate-800 mt-2">Promotion Performance Report</h2>
          <p className="text-xs text-slate-400">Generated: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50">
                {['#', 'Customer Name', 'Customer Status', 'Vehicle Brand', 'Vehicle Model', 'Plate No.', 'Promo Title', 'Discount Type', 'Discount Value', 'Promo Status', 'Performance'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors">
                  <td className="px-4 py-3 text-slate-400 text-xs">{i + 1}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">{r.CustomerName}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${statusCls(r.CustomerStatus)}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />{r.CustomerStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{r.VehicleBrand}</td>
                  <td className="px-4 py-3 text-slate-700">{r.VehicleModel}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">{r.Plate_Number}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800 max-w-[160px] truncate">{r.PromotionTitle}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">{r.Discount_Type}</span>
                  </td>
                  <td className="px-4 py-3 font-bold text-indigo-700">{r.Discount_Value}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${statusCls(r.PromotionStatus)}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />{r.PromotionStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 max-w-[180px] truncate">{r.Performance || '—'}</td>
                </tr>
              ))}
              {!rows.length && (
                <tr><td colSpan="11" className="text-center py-16 text-slate-400">
                  <p className="text-4xl mb-2 opacity-30">📊</p>No report data yet
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`@media print { .print\\:hidden { display: none !important; } .print\\:block { display: block !important; } }`}</style>
    </Layout>
  );
}
