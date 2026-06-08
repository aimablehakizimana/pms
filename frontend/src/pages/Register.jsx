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

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <h1>Swift<span>Wheels</span></h1>
          <p>Create your account</p>
        </div>

        {error   && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" name="UserName" value={form.UserName} onChange={handle}
              placeholder="Choose a username" required autoFocus />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="Password" value={form.Password} onChange={handle}
              placeholder="Create a password" required />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" name="confirm" value={form.confirm} onChange={handle}
              placeholder="Repeat your password" required />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select name="Role" value={form.Role} onChange={handle}>
              <option value="Staff">Staff</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <button className="btn btn-primary" type="submit"
            style={{ marginTop: 8, justifyContent: 'center', padding: '13px' }}>
            Create Account
          </button>
        </form>

        <div className="divider" />
        <p style={{ textAlign: 'center', fontSize: '.875rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
