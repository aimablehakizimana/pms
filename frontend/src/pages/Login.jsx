import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ UserName: '', Password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    try { await login(form.UserName, form.Password); navigate('/dashboard'); }
    catch (err) { setError(err.response?.data?.message || 'Login failed.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex w-[45%] flex-col items-center justify-center p-12 relative overflow-hidden bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, #fff 0%, transparent 50%), radial-gradient(circle at 80% 20%, #fff 0%, transparent 50%)' }} />
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl mx-auto mb-6 shadow-xl">🚀</div>
          <h1 className="text-3xl font-extrabold text-white mb-3 leading-tight">SwiftWheels<br/>Promotions & Marketing</h1>
          <p className="text-blue-100 text-sm max-w-xs mx-auto leading-relaxed">Manage vehicle promotions, customers, and marketing campaigns all in one place.</p>
          <div className="flex gap-6 justify-center mt-10">
            {[['🚗','Vehicles'],['🎯','Promotions'],['📊','Reports']].map(([e, l]) => (
              <div key={l} className="flex flex-col items-center gap-1.5">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-lg">{e}</div>
                <span className="text-blue-100 text-[11px] font-medium">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-[#f8fafc]">
        <div className="w-full max-w-sm">
          <div className="lg:hidden w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xl mb-6 shadow-lg">🚀</div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Welcome back!</h2>
          <p className="text-slate-500 text-sm mb-8">Sign in to SwiftWheels PMS.</p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Username</label>
              <input name="UserName" value={form.UserName} onChange={handle} placeholder="Enter username" required autoFocus
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 transition shadow-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Password</label>
              <input type="password" name="Password" value={form.Password} onChange={handle} placeholder="Enter password" required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 transition shadow-sm" />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                ⚠️ {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-white text-sm font-bold mt-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-200 hover:-translate-y-0.5 transition-all duration-150 disabled:opacity-60">
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            No account?{' '}
            <Link to="/register" className="text-blue-600 font-semibold hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
