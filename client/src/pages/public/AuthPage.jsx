import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { publicLogin, publicRegister, publicGoogleLogin } from '../../api/authApi.js';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => {
      window.google?.accounts?.id?.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
        callback: async (response) => {
          try {
            const res = await publicGoogleLogin({ credential: response.credential });
            login(res.data.user, res.data.token);
            navigate(redirect);
          } catch (err) {
            setError(err.response?.data?.error?.message || 'Google login failed');
          }
        },
      });
    };
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, []);

  const handleGoogleLogin = () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    } else {
      setError('Google Sign-In not available. Please try email login.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = isLogin ? await publicLogin(form) : await publicRegister(form);
      login(res.data.user, res.data.token);
      navigate(redirect);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-center mb-2">{isLogin ? 'Sign In' : 'Create Account'}</h1>
        <p className="text-center text-tc-muted mb-8">{isLogin ? 'Welcome back' : 'Join TriCore Events'}</p>
        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 text-sm mb-6">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />}
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          {!isLogin && <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />}
          <Button type="submit" disabled={loading} className="w-full mt-2">{loading ? 'Loading...' : isLogin ? 'Sign In' : 'Create Account'}</Button>
        </form>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-tc-border"></div></div>
          <div className="relative flex justify-center text-xs"><span className="bg-tc-bg px-4 text-tc-dim">or continue with</span></div>
        </div>
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 px-5 py-2.5 border border-tc-border text-tc-muted hover:border-tc-primary hover:text-white transition-colors text-sm"
        >
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Google
        </button>
        <p className="text-center text-sm text-tc-muted mt-6">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => setIsLogin(!isLogin)} className="text-tc-primary font-semibold">{isLogin ? 'Sign Up' : 'Sign In'}</button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
