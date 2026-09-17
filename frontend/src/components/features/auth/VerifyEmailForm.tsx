import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { authService } from '../../../services/authService';
import { Input } from '../../common/Input';
import { Button } from '../../common/Button';

export const VerifyEmailForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get('email') || '';

  const [email, setEmail] = useState(emailParam);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const navigate = useNavigate();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await authService.verifyEmail(email.trim(), code.trim());
      setMessage(res.message);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed. Check the 6-digit code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    setError('');
    try {
      const res = await authService.resendCode(email.trim());
      setMessage(res.message);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend code.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-900 rounded-3xl p-7 sm:p-9 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none transition-all">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-[#00D285]/15 text-[#00D285] flex items-center justify-center mx-auto mb-3.5 shadow-sm text-lg font-bold">
          <i className="fa-solid fa-shield-halved" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Verify Your Email<span className="text-[#00D285]">.</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Enter the 6-digit code sent to your Gmail inbox
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

      <form onSubmit={handleVerify} className="space-y-4">
        <Input
          label="Gmail Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<i className="fa-solid fa-envelope text-xs" />}
          required
        />

        <Input
          label="6-Digit Verification Code"
          type="text"
          placeholder="123456"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="text-center text-lg tracking-widest font-mono font-bold"
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={loading}
          className="w-full !rounded-xl !bg-[#00D285] hover:!bg-[#00BA76] !text-white font-bold shadow-md shadow-[#00D285]/30 hover:shadow-lg hover:shadow-[#00D285]/40 mt-2"
        >
          Verify & Sign In
        </Button>

        <button
          type="button"
          onClick={handleResend}
          disabled={resending || !email}
          className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700/80 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          <i className="fa-solid fa-paper-plane text-xs text-[#00D285]" />
          <span>{resending ? 'Sending Code...' : "Didn't receive? Resend Code"}</span>
        </button>
      </form>

      <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/80">
        Back to{' '}
        <Link to="/login" className="font-extrabold text-[#00D285] hover:underline transition-colors">
          Sign In
        </Link>
      </p>
    </div>
  );
};
