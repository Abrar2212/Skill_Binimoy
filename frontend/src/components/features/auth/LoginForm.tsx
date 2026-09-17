import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Input } from '../../common/Input';
import { Button } from '../../common/Button';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setUnverifiedEmail(null);
    setLoading(true);

    try {
      await login(email.trim(), password);
      navigate('/dashboard');
    } catch (err: any) {
      const data = err.response?.data;
      const msg = data?.message || 'Login failed. Please verify your credentials.';
      setError(msg);

      if (data?.email || (typeof msg === 'string' && msg.toLowerCase().includes('verify'))) {
        setUnverifiedEmail(data?.email || email.trim());
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('abrarjunaed22@gmail.com');
    setPassword('password123');
    setError('');
    setUnverifiedEmail(null);
    setLoading(true);
    try {
      await login('abrarjunaed22@gmail.com', 'password123');
      navigate('/dashboard');
    } catch {
      setError('Demo login failed. Please enter your credentials manually.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-900 rounded-3xl p-7 sm:p-9 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none transition-all">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-[#00D285]/15 text-[#00D285] flex items-center justify-center mx-auto mb-3.5 shadow-sm text-lg font-bold">
          <i className="fa-solid fa-arrow-right-to-bracket" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Welcome Back<span className="text-[#00D285]">.</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Sign in to access your skills, barter proposals, and video rooms
        </p>
      </div>

      {/* Error Message Alert */}
      {error && (
        <div className="p-3.5 mb-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-400 space-y-2">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-circle-exclamation text-sm shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
          {unverifiedEmail && (
            <div className="pt-1.5 border-t border-rose-500/20">
              <Link
                to={`/verify-email?email=${encodeURIComponent(unverifiedEmail)}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00D285] hover:underline"
              >
                <span>Enter Verification Code</span>
                <i className="fa-solid fa-arrow-right text-[10px]" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="yourname@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<i className="fa-solid fa-envelope text-xs" />}
          required
        />

        <div>
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<i className="fa-solid fa-lock text-xs" />}
            required
          />
          <div className="flex items-center justify-between mt-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400 select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-700 text-[#00D285] focus:ring-[#00D285] accent-[#00D285]"
              />
              <span>Remember me</span>
            </label>

            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-[#00D285] hover:underline transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={loading}
          className="w-full !rounded-xl !bg-[#00D285] hover:!bg-[#00BA76] !text-white font-bold shadow-md shadow-[#00D285]/30 hover:shadow-lg hover:shadow-[#00D285]/40 mt-2"
        >
          Sign In
        </Button>

        {/* 1-Click Demo Login */}
        <button
          type="button"
          onClick={handleDemoLogin}
          className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-bold border border-slate-200 dark:border-slate-700/80 transition-all flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-wand-magic-sparkles text-[#00D285] text-xs" />
          <span>Quick 1-Click Demo Login</span>
        </button>
      </form>

      {/* Footer */}
      <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/80">
        Don't have an account?{' '}
        <Link to="/register" className="font-extrabold text-[#00D285] hover:underline transition-colors">
          Create Account
        </Link>
      </p>
    </div>
  );
};
