import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { to: '/dashboard',      icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>, label: 'Dashboard'     },
  { to: '/vehicles',       icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l2-4h10l2 4h1a2 2 0 012 2v6a2 2 0 01-2 2h-2m-9 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>, label: 'Vehicles'      },
  { to: '/customers',      icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>, label: 'Customers'     },
  { to: '/promotions',     icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>, label: 'Promotions'    },
  { to: '/promo-vehicles', icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>, label: 'Promo Vehicles' },
  { to: '/report',         icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>, label: 'Report'        },
];

export default function Layout({ children, title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => { await logout(); navigate('/login'); };
  const initials = user?.UserName?.slice(0, 2).toUpperCase() || 'SW';

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h1>Swift<span>Wheels</span></h1>
          <span>Promotions &amp; Marketing</span>
        </div>

        <nav className="sidebar-nav">
          {NAV.map(({ to, icon, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              {icon}
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', marginBottom: 6 }}>
            <div className="avatar">{initials}</div>
            <div>
              <div style={{ color: '#fff', fontSize: '.82rem', fontWeight: 600 }}>{user?.UserName}</div>
              <div style={{ color: '#6B7280', fontSize: '.72rem' }}>{user?.Role}</div>
            </div>
          </div>
          <button className="nav-link" onClick={handleLogout} style={{ color: '#fca5a5' }}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ width: 17, height: 17 }}>
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <h2>{title}</h2>
          <div className="topbar-user">
            <div className="avatar">{initials}</div>
            <span style={{ fontSize: '.875rem', fontWeight: 500 }}>{user?.UserName}</span>
          </div>
        </header>
        <main className="page">{children}</main>
      </div>
    </div>
  );
}
