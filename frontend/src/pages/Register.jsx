import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ UserName: '', Password: '', confirm: '', Role: 'Staff' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault(); setError('');
    if (form.Password !== form.confirm) return setError('Passwords do not match.');
    try {
      await api.post('/auth/register', { UserName: form.UserName, Password: form.Password, Role: form.Role });
      setSuccess('Account created! Redirecting…');
      setTimeout(() => navigate('/login'), 1600);
    } catch (err) { setError(err.response?.data?.message || 'Registration failed.'); }
  };

  const inputCls = 'w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 transition shadow-sm';

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex w-[45%] flex-col items-center justify-center p-12 relative overflow-hidden bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, #fff 0%, transparent 50%), radial-gradient(circle at 80% 20%, #fff 0%, transparent 50%)' }} />
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl mx-auto mb-6 shadow-xl">🚀</div>
          <h1 className="text-3xl font-extrabold text-white mb-3">Join SwiftWheels PMS</h1>
          <p className="text-blue-100 text-sm max-w-xs mx-auto">Create your account to manage promotions and marketing campaigns.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-[#f8fafc]">
        <div className="w-full max-w-sm">
          <div className="lg:hidden w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xl mb-6 shadow-lg">🚀</div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Create Account</h2>
          <p className="text-slate-500 text-sm mb-8">Fill in the details below to get started.</p>

          <form onSubmit={submit} className="space-y-4">
            {[
              { label: 'Username',         name: 'UserName',  type: 'text',     ph: 'Choose a username'   },
              { label: 'Password',         name: 'Password',  type: 'password', ph: 'Create a password'   },
              { label: 'Confirm Password', name: 'confirm',   type: 'password', ph: 'Repeat your password' },
            ].map(({ label, name, type, ph }) => (
              <div key={name}>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">{label}</label>
                <input type={type} name={name} value={form[name]} onChange={handle} placeholder={ph} required autoFocus={name === 'UserName'} className={inputCls} />
              </div>
            ))}

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Role</label>
              <select name="Role" value={form.Role} onChange={handle} className={inputCls}>
                <option value="Staff">Staff</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            {error   && <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-200 rounded-xl px-4 py-3">⚠️ {error}</div>}
            {success && <div className="flex items-center gap-2 text-blue-700 text-xs bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">✅ {success}</div>}

            <button type="submit"
              className="w-full py-3 rounded-xl text-white text-sm font-bold mt-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-200 hover:-translate-y-0.5 transition-all duration-150">
              Create Account →
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
