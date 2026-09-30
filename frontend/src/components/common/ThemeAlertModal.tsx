import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  X,
  LogIn,
  UserPlus,
  Lock,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Info,
  XCircle,
  ArrowRight,
  MessageSquareCode
} from 'lucide-react';

export type AlertVariant = 'auth' | 'info' | 'warning' | 'error' | 'success';

export interface ThemeAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  variant?: AlertVariant;
  primaryActionText?: string;
  onPrimaryAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
  showCancelButton?: boolean;
  cancelText?: string;
}

export const ThemeAlertModal: React.FC<ThemeAlertModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  variant = 'auth',
  primaryActionText,
  onPrimaryAction,
  secondaryActionText,
  onSecondaryAction,
  showCancelButton = true,
  cancelText = 'Maybe later',
}) => {
  const navigate = useNavigate();
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // GSAP animation for smooth theme-aware entrance
  useGSAP(() => {
    if (!isOpen) return;

    if (overlayRef.current && cardRef.current) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.22, ease: 'power2.out' }
      );

      gsap.fromTo(
        cardRef.current,
        { opacity: 0, scale: 0.88, y: 16 },
        { opacity: 1, scale: 1, y: 0, duration: 0.32, ease: 'back.out(1.5)' }
      );
    }
  }, { dependencies: [isOpen] });

  if (!isOpen) return null;

  // Default configuration per variant
  const isAuth = variant === 'auth';

  const defaultTitles: Record<AlertVariant, string> = {
    auth: 'Sign In Required',
    info: 'Notice',
    warning: 'Please Note',
    error: 'Action Failed',
    success: 'Success',
  };

  const finalTitle = title || defaultTitles[variant];
  const finalMessage = message || (isAuth ? 'Please sign in to ask problems or participate in discussions!' : '');

  // Handle primary action
  const handlePrimaryClick = () => {
    if (onPrimaryAction) {
      onPrimaryAction();
    } else if (isAuth) {
      onClose();
      navigate('/login');
    } else {
      onClose();
    }
  };

  // Handle secondary action
  const handleSecondaryClick = () => {
    if (onSecondaryAction) {
      onSecondaryAction();
    } else if (isAuth) {
      onClose();
      navigate('/register');
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Blurred Backdrop with theme adaptation */}
      <div
        ref={overlayRef}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 dark:bg-black/80 backdrop-blur-md transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="theme-alert-title"
        className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 z-10 my-8 text-slate-900 dark:text-white transition-all overflow-hidden"
      >
        {/* Ambient Emerald Glow Accent */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-44 h-44 bg-[#00D285]/20 dark:bg-[#00D285]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-2xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Dynamic Icon Header */}
        <div className="flex flex-col items-center text-center">
          {variant === 'auth' && (
            <div className="w-16 h-16 rounded-3xl mb-4 flex items-center justify-center bg-gradient-to-br from-emerald-500/20 via-[#00D285]/15 to-teal-500/10 border border-[#00D285]/30 text-[#00D285] shadow-lg shadow-[#00D285]/15">
              <Lock className="w-7 h-7" />
            </div>
          )}

          {variant === 'info' && (
            <div className="w-16 h-16 rounded-3xl mb-4 flex items-center justify-center bg-blue-500/10 border border-blue-500/20 text-blue-500 dark:text-blue-400 shadow-lg shadow-blue-500/10">
              <Info className="w-7 h-7" />
            </div>
          )}

          {variant === 'warning' && (
            <div className="w-16 h-16 rounded-3xl mb-4 flex items-center justify-center bg-amber-500/10 border border-amber-500/20 text-amber-500 dark:text-amber-400 shadow-lg shadow-amber-500/10">
              <AlertTriangle className="w-7 h-7" />
            </div>
          )}

          {variant === 'error' && (
            <div className="w-16 h-16 rounded-3xl mb-4 flex items-center justify-center bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-400 shadow-lg shadow-rose-500/10">
              <XCircle className="w-7 h-7" />
            </div>
          )}

          {variant === 'success' && (
            <div className="w-16 h-16 rounded-3xl mb-4 flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20 text-[#00D285] shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-7 h-7" />
            </div>
          )}

          {/* Title */}
          <h3
            id="theme-alert-title"
            className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight"
          >
            {finalTitle}
          </h3>

          {/* Description / Message */}
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed max-w-sm">
            {finalMessage}
          </p>

          {/* Feature Perks (when variant is auth) */}
          {isAuth && (
            <div className="w-full my-5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800/80 space-y-2 text-left">
              <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="w-5 h-5 rounded-lg bg-[#00D285]/15 text-[#00D285] flex items-center justify-center shrink-0">
                  <MessageSquareCode className="w-3 h-3" />
                </div>
                <span>Post technical coding problems & bug questions</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="w-5 h-5 rounded-lg bg-[#00D285]/15 text-[#00D285] flex items-center justify-center shrink-0">
                  <Sparkles className="w-3 h-3" />
                </div>
                <span>Exchange answers & earn reputation badges</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="w-full space-y-2.5 mt-2">
            {/* Primary Action Button */}
            <button
              type="button"
              onClick={handlePrimaryClick}
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-[#00D285] hover:bg-[#00ba76] text-white font-bold text-sm shadow-lg shadow-[#00D285]/25 hover:shadow-xl hover:shadow-[#00D285]/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              {isAuth ? (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>{primaryActionText || 'Sign In to Continue'}</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </>
              ) : (
                <span>{primaryActionText || 'Understood'}</span>
              )}
            </button>

            {/* Secondary Action Button (Register for Auth) */}
            {isAuth && (
              <button
                type="button"
                onClick={handleSecondaryClick}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm border border-slate-200/80 dark:border-slate-700/60 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-[#00D285]" />
                <span>{secondaryActionText || 'Create Free Account'}</span>
              </button>
            )}

            {/* Cancel / Dismiss Button */}
            {showCancelButton && (
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer"
              >
                {cancelText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeAlertModal;
