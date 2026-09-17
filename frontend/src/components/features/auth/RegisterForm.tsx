import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../../services/authService';
import { Input } from '../../common/Input';
import { Button } from '../../common/Button';

export const RegisterForm: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Backend specifically enforces gmail
    if (!email.toLowerCase().endsWith('@gmail.com')) {
      setError('Only @gmail.com addresses are supported by the backend system.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await authService.register(fullName.trim(), email.trim(), password);
      // Pass email to verification page
      navigate(`/verify-email?email=${encodeURIComponent(email.trim())}`);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registration failed. Try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-900 rounded-3xl p-7 sm:p-9 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none transition-all">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-[#00D285]/15 text-[#00D285] flex items-center justify-center mx-auto mb-3.5 shadow-sm text-lg font-bold">
          <i className="fa-solid fa-user-plus" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Create Account<span className="text-[#00D285]">.</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Start exchanging your expertise with peers worldwide
        </p>
      </div>

      {error && (
        <div className="p-3.5 mb-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2 font-semibold">
          <i className="fa-solid fa-circle-exclamation text-sm shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="e.g. Tanvir Ahmed"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          leftIcon={<i className="fa-solid fa-user text-xs" />}
          required
        />

        <Input
          label="Gmail Address"
          type="email"
          placeholder="yourname@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<i className="fa-solid fa-envelope text-xs" />}
          helperText="Backend requires an @gmail.com address"
          required
        />

        <Input
          label="Password (min 6 characters)"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<i className="fa-solid fa-lock text-xs" />}
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={loading}
          className="w-full !rounded-xl !bg-[#00D285] hover:!bg-[#00BA76] !text-white font-bold shadow-md shadow-[#00D285]/30 hover:shadow-lg hover:shadow-[#00D285]/40 mt-2"
        >
          Create Free Account
        </Button>
      </form>

      <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/80">
        Already have an account?{' '}
        <Link to="/login" className="font-extrabold text-[#00D285] hover:underline transition-colors">
          Sign In
        </Link>
      </p>
    </div>
  );
};
