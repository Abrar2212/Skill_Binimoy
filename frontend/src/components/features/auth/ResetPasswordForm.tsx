import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { authService } from '../../../services/authService';
import { Input } from '../../common/Input';
import { Button } from '../../common/Button';

export const ResetPasswordForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get('email') || '';

  const [email, setEmail] = useState(emailParam);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.resetPassword(email.trim(), code.trim(), newPassword);
      setMessage(res.message);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Password reset failed. Check the code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-900 rounded-3xl p-7 sm:p-9 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none transition-all">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-[#00D285]/15 text-[#00D285] flex items-center justify-center mx-auto mb-3.5 shadow-sm text-lg font-bold">
          <i className="fa-solid fa-lock" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Set New Password<span className="text-[#00D285]">.</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Enter the reset code sent to your email and choose a new password
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<i className="fa-solid fa-envelope text-xs" />}
          required
        />

        <Input
          label="Reset Code"
          type="text"
          placeholder="123456"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="text-center font-mono tracking-widest text-lg font-bold"
          required
        />

        <Input
          label="New Password"
          type="password"
          placeholder="••••••••"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
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
          Reset Password
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
