import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { adminLogin } from '../../api/authApi.js';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import Logo from '../../components/ui/Logo.jsx';

const AdminLoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await adminLogin(form);
      login(res.data.user, res.data.token);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-tc-bg flex items-center justify-center px-6 font-[var(--font-body)]">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-10">
          <Logo size="lg" className="justify-center" />
        </div>
        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 text-sm mb-6">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <Button type="submit" disabled={loading} className="w-full mt-2">{loading ? 'Signing in...' : 'Sign In'}</Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
