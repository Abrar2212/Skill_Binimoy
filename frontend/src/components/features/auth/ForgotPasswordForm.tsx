import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../../services/authService';
import { Input } from '../../common/Input';
import { Button } from '../../common/Button';

export const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await authService.forgotPassword(email.trim());
      setMessage(res.message);
      setTimeout(() => {
        navigate(`/reset-password?email=${encodeURIComponent(email.trim())}`);
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error processing request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-900 rounded-3xl p-7 sm:p-9 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none transition-all">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center mx-auto mb-3.5 shadow-sm text-lg font-bold">
          <i className="fa-solid fa-key" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Forgot Password<span className="text-[#00D285]">.</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Enter your registered Gmail to receive a password reset code
        </p>
      </div>

      {error && (
        <div className="p-3.5 mb-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2 font-semibold">
          <i className="fa-solid fa-circle-exclamation text-sm shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {message && (
        <div className="p-3.5 mb-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-[#00D285] flex items-center gap-2 font-semibold">
          <i className="fa-solid fa-circle-check text-sm shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Gmail Address"
          type="email"
          placeholder="yourname@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<i className="fa-solid fa-envelope text-xs" />}
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={loading}
          className="w-full !rounded-xl !bg-[#00D285] hover:!bg-[#00BA76] !text-white font-bold shadow-md shadow-[#00D285]/30 hover:shadow-lg hover:shadow-[#00D285]/40 mt-2"
        >
          Send Reset Code
        </Button>
      </form>

      <div className="text-center mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/80">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-[#00D285] transition-colors"
        >
          <i className="fa-solid fa-arrow-left text-[11px]" />
          <span>Back to Login</span>
        </Link>
      </div>
    </div>
  );
};
