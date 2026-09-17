import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  animateHover?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  animateHover = true,
  className = '',
  disabled,
  ...props
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);

  useGSAP(() => {
    if (!animateHover || !btnRef.current || disabled || isLoading) return;

    const btn = btnRef.current;
    const enterTween = gsap.to(btn, {
      scale: 1.02,
      duration: 0.2,
      paused: true,
      ease: 'power2.out',
    });

    const onMouseEnter = () => enterTween.play();
    const onMouseLeave = () => enterTween.reverse();

    btn.addEventListener('mouseenter', onMouseEnter);
    btn.addEventListener('mouseleave', onMouseLeave);

    return () => {
      btn.removeEventListener('mouseenter', onMouseEnter);
      btn.removeEventListener('mouseleave', onMouseLeave);
      enterTween.kill();
    };
  }, { scope: btnRef, dependencies: [animateHover, disabled, isLoading] });

  // Size styling
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs font-medium rounded-lg gap-1.5',
    md: 'px-4 py-2 text-sm font-medium rounded-xl gap-2',
    lg: 'px-6 py-3 text-base font-semibold rounded-xl gap-2.5',
  }[size];

  // Variant styling
  const variantClasses = {
    primary:
      'bg-[#00D285] hover:bg-[#00BA76] text-white font-bold shadow-md shadow-[#00D285]/25 active:scale-95',
    secondary:
      'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60 active:scale-95',
    outline:
      'bg-transparent border border-brand/40 text-brand hover:bg-brand/10 active:scale-95',
    ghost:
      'bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-white',
    danger:
      'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 active:scale-95',
  }[variant];

  return (
    <button
      ref={btnRef}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
