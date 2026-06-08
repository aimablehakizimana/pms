import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../api';

export default function Dashboard() {
  const [stats, setStats] = useState({ totalVehicles: 0, totalCustomers: 0, activePromotions: 0, linkedVehicles: 0 });

  useEffect(() => { api.get('/report/stats').then(r => setStats(r.data)).catch(() => {}); }, []);

  const cards = [
    { label: 'Total Vehicles',    value: stats.totalVehicles,    icon: '🚗', sub: 'Registered vehicles'   },
    { label: 'Total Customers',   value: stats.totalCustomers,   icon: '👥', sub: 'Registered customers'  },
    { label: 'Active Promotions', value: stats.activePromotions, icon: '🎯', sub: 'Running campaigns'     },
    { label: 'Promo Vehicles',    value: stats.linkedVehicles,   icon: '🔗', sub: 'Vehicle-promo links'   },
  ];

  return (
    <Layout title="Dashboard">
      <div className="stat-grid">
        {cards.map(({ label, value, icon, sub }) => (
          <div key={label} className="stat-card">
            <div className="stat-icon">{icon}</div>
            <div>
              <div className="stat-label">{label}</div>
              <div className="stat-value">{value}</div>
              <div style={{ fontSize: '.72rem', color: 'var(--text-muted)', marginTop: 2 }}>{sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>SwiftWheels Enterprises</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '.855rem', marginTop: 4 }}>Huye City, Southern Province, Rwanda</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
          {[
            { icon: '🚗', title: 'Fleet Management',    desc: 'Track all vehicles registered in the system.' },
            { icon: '🎯', title: 'Active Promotions',   desc: 'Manage and monitor ongoing marketing campaigns.' },
            { icon: '📊', title: 'Performance Reports', desc: 'Generate detailed promotion performance reports.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{ display: 'flex', gap: 12, padding: '14px 16px', borderRadius: 10, background: 'var(--bg)', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: '1.4rem' }}>{icon}</span>
              <div>
                <p style={{ fontWeight: 600, fontSize: '.875rem' }}>{title}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '.78rem', marginTop: 3 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
