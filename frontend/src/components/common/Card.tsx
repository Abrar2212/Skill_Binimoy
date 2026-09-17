import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverTilt?: boolean;
  glowOnHover?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  hoverTilt = false,
  glowOnHover = true,
  className = '',
  children,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!hoverTilt || !cardRef.current) return;
    const card = cardRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(card, {
        rotateY: x * 0.04,
        rotateX: -y * 0.04,
        transformPerspective: 800,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.5,
        ease: 'power2.out',
      });
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, { scope: cardRef, dependencies: [hoverTilt] });

  return (
    <div
      ref={cardRef}
      className={`glass-card rounded-2xl p-6 transition-all duration-300 ${
        glowOnHover ? 'hover:border-brand/40 hover:shadow-glow' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
