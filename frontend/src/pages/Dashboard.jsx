import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../api';

export default function Dashboard() {
  const [stats, setStats] = useState({ totalVehicles: 0, totalCustomers: 0, activePromotions: 0, linkedVehicles: 0 });

  useEffect(() => { api.get('/report/stats').then(r => setStats(r.data)).catch(() => {}); }, []);

  const cards = [
    { label: 'Total Vehicles',      value: stats.totalVehicles,     icon: '🚗', from: 'from-blue-400',    to: 'to-indigo-500',  sub: 'Registered vehicles'      },
    { label: 'Total Customers',     value: stats.totalCustomers,    icon: '👥', from: 'from-violet-400',  to: 'to-purple-500',  sub: 'Registered customers'     },
    { label: 'Active Promotions',   value: stats.activePromotions,  icon: '🎯', from: 'from-orange-400',  to: 'to-amber-500',   sub: 'Running campaigns'        },
    { label: 'Promo Vehicles',      value: stats.linkedVehicles,    icon: '🔗', from: 'from-emerald-400', to: 'to-teal-500',    sub: 'Vehicle-promo links'      },
  ];

  return (
    <Layout title="Dashboard" subtitle="SwiftWheels Promotions & Marketing — Live Overview">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {cards.map(({ label, value, icon, from, to, sub }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${from} ${to} flex items-center justify-center text-xl shadow-md`}>{icon}</div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</p>
            <p className="text-xs text-slate-400 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <p className="font-bold text-slate-800 mb-1">SwiftWheels Enterprises</p>
        <p className="text-sm text-slate-500">Huye City, Southern Province, Rwanda</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: '🚗', title: 'Fleet Management',    desc: 'Track all vehicles registered in the system.' },
            { icon: '🎯', title: 'Active Promotions',   desc: 'Manage and monitor ongoing marketing campaigns.' },
            { icon: '📊', title: 'Performance Reports', desc: 'Generate detailed promotion performance reports.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="flex gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-2xl">{icon}</span>
              <div>
                <p className="text-sm font-semibold text-slate-800">{title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
