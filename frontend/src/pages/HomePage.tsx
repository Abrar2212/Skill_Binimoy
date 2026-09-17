import React from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { HeroSection } from '../components/features/home/HeroSection';
import { HowItWorks } from '../components/features/home/HowItWorks';
import { TrendingSkillsSection } from '../components/features/home/TrendingSkillsSection';
import { TestimonialsSection } from '../components/features/home/TestimonialsSection';
import { CTASection } from '../components/features/home/CTASection';

export const HomePage: React.FC = () => {
  return (
    <AppLayout variant="landing">
      <div className="space-y-12 pb-16">
        <HeroSection />
        <HowItWorks />
        <TrendingSkillsSection />
        <TestimonialsSection />
        <CTASection />
      </div>
    </AppLayout>
  );
};
