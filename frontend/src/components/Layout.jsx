import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { to: '/dashboard',   emoji: '🏠', label: 'Dashboard'         },
  { to: '/vehicles',    emoji: '🚗', label: 'Vehicles'           },
  { to: '/customers',   emoji: '👥', label: 'Customers'          },
  { to: '/promotions',  emoji: '🎯', label: 'Promotions'         },
  { to: '/promo-vehicles', emoji: '🔗', label: 'Promo Vehicles'  },
  { to: '/report',      emoji: '📊', label: 'Report'             },
];

export default function Layout({ children, title, subtitle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => { await logout(); navigate('/login'); };
  const initials = user?.UserName?.slice(0, 2).toUpperCase() || 'SW';
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="flex min-h-screen bg-[#f0f4f8]">

      {/* Sidebar */}
      <aside className="w-60 shrink-0 sticky top-0 h-screen flex flex-col bg-white border-r border-slate-100 scrollbar-hide overflow-y-auto">
        <div className="px-5 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-base shadow-md">🚀</div>
            <div>
              <p className="text-[13px] font-bold text-slate-800 leading-none">SwiftWheels</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Promotions & Marketing</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 mb-2">Main Menu</p>
          {NAV.map(({ to, emoji, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-colors ${isActive ? 'bg-blue-100' : 'bg-slate-100'}`}>
                    {emoji}
                  </span>
                  {label}
                  {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 pb-4 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-50 mb-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-slate-800 truncate">{user?.UserName}</p>
              <p className="text-[10px] text-slate-400">{user?.Role}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-[12px] font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors border border-slate-100">
            ← Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-10 h-[60px] flex items-center justify-between px-7 bg-white border-b border-slate-100 shadow-sm">
          <div>
            <h1 className="text-[15px] font-bold text-slate-900">{title}</h1>
            {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[12px] text-slate-500 bg-slate-50 border border-slate-200 rounded-full px-4 py-1.5">
            🗓 {today}
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
