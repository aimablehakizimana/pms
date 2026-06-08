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
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <h1>Swift<span>Wheels</span></h1>
          <p>Promotions &amp; Marketing System</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" name="UserName" value={form.UserName} onChange={handle}
              placeholder="Enter username" required autoFocus />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="Password" value={form.Password} onChange={handle}
              placeholder="Enter password" required />
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}
            style={{ marginTop: 8, justifyContent: 'center', padding: '13px' }}>
            {loading ? <span className="spinner" /> : 'Sign In'}
          </button>
        </form>

        <div className="divider" />
        <p style={{ textAlign: 'center', fontSize: '.875rem', color: 'var(--text-muted)' }}>
          No account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Create one</Link>
        </p>
      </div>
    </div>
  );
}
