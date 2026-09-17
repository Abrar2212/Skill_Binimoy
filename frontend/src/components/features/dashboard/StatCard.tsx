import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: any;
  iconClass?: string;
  trend?: string;
  colorGradient?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClass,
  trend,
  colorGradient = 'from-[#00D285] to-emerald-600',
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      if (!numberRef.current) return;
      const strVal = String(value);
      const numMatch = strVal.match(/([\d.]+)/);
      const hasStar = strVal.includes('★');

      if (numMatch) {
        const targetNum = parseFloat(numMatch[1]);
        const isFloat = numMatch[1].includes('.');
        const obj = { val: 0 };
        gsap.to(obj, {
          val: targetNum,
          duration: 1.2,
          ease: 'power2.out',
          onUpdate: () => {
            if (numberRef.current) {
              const formatted = isFloat ? obj.val.toFixed(1) : Math.round(obj.val).toString();
              numberRef.current.innerText = hasStar ? `${formatted} ★` : formatted;
            }
          },
        });
      }
    },
    { scope: cardRef, dependencies: [value] }
  );

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md group ${
        onClick
          ? 'cursor-pointer hover:border-amber-400/50 hover:bg-amber-50/20 dark:hover:bg-amber-950/10'
          : 'hover:border-[#00D285]/50'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div
          className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${colorGradient} flex items-center justify-center text-white shadow-md shadow-[#00D285]/20 group-hover:scale-110 transition-transform duration-300 text-base`}
        >
          {iconClass ? (
            <i className={iconClass} />
          ) : typeof Icon === 'string' ? (
            <i className={Icon} />
          ) : Icon ? (
            <Icon className="w-5 h-5" />
          ) : (
            <i className="fa-solid fa-chart-simple" />
          )}
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <p ref={numberRef} className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          {value}
        </p>
        {trend && (
          <span className="text-[11px] font-bold text-[#00D285] bg-[#00D285]/10 px-2.5 py-0.5 rounded-full">
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium">{subtitle}</p>
      )}
    </div>
  );
};
