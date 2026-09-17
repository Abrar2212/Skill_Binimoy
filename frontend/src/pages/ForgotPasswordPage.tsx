import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { AppLayout } from '../components/layout/AppLayout';
import { ForgotPasswordForm } from '../components/features/auth/ForgotPasswordForm';

export const ForgotPasswordPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from('.forgot-card-reveal', {
        opacity: 0,
        y: 25,
        duration: 0.5,
        ease: 'power3.out',
      });
    },
    { scope: containerRef }
  );

  return (
    <AppLayout showSidebar={false} variant="landing">
      <div
        ref={containerRef}
        className="py-12 sm:py-20 flex items-center justify-center min-h-[calc(100vh-14rem)] relative overflow-hidden px-4"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00D285]/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="forgot-card-reveal w-full max-w-md">
          <ForgotPasswordForm />
        </div>
      </div>
    </AppLayout>
  );
};
