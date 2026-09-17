import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { BookOpen, Target, ShieldCheck } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const doodlePathRef = useRef<SVGPathElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const centerpieceRef = useRef<HTMLDivElement>(null);
  const badgeLeftRef = useRef<HTMLDivElement>(null);
  const badgeRightRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLImageElement>(null);
  const bulbRef = useRef<HTMLImageElement>(null);
  const pencilRightRef = useRef<HTMLImageElement>(null);
  const pencilLeftRef = useRef<HTMLImageElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Setup stroke dash for doodle path
    if (doodlePathRef.current) {
      const length = doodlePathRef.current.getTotalLength();
      gsap.set(doodlePathRef.current, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });
    }

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(
      headlineRef.current,
      { opacity: 0, y: 35 },
      { opacity: 1, y: 0, duration: 0.8 }
    )
      .to(
        doodlePathRef.current,
        { strokeDashoffset: 0, duration: 1, ease: 'power2.out' },
        '-=0.3'
      )
      .fromTo(
        subtextRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.6'
      )
      .fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 },
        '-=0.4'
      )
      .fromTo(
        featuresRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        '-=0.3'
      )
      .fromTo(
        centerpieceRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.9, ease: 'back.out(1.4)' },
        '-=0.8'
      )
      .fromTo(
        [badgeLeftRef.current, badgeRightRef.current],
        { opacity: 0, scale: 0.8, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.15 },
        '-=0.4'
      )
      .fromTo(
        statsRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7 },
        '-=0.3'
      );

    // Continuous floating animations for badges and 3D icons
    gsap.to(badgeLeftRef.current, {
      y: -9,
      duration: 3.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    gsap.to(badgeRightRef.current, {
      y: 9,
      duration: 3.8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 0.4,
    });

    gsap.to(bookRef.current, {
      y: -12,
      rotation: -16,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    gsap.to(bulbRef.current, {
      y: 10,
      duration: 3.4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 0.6,
    });

    gsap.to(pencilRightRef.current, {
      y: -10,
      duration: 3.1,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 0.3,
    });

    gsap.to(pencilLeftRef.current, {
      y: 8,
      duration: 3.6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 0.7,
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Subtle organic background wave contours */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 translate-x-1/4 w-[750px] h-[750px] pointer-events-none -z-10 opacity-35 dark:opacity-15">
        <svg viewBox="0 0 600 600" className="w-full h-full text-[#00D285]" fill="none" stroke="currentColor">
          <circle cx="300" cy="300" r="160" strokeWidth="1.2" strokeDasharray="6 6" />
          <circle cx="300" cy="300" r="220" strokeWidth="1" opacity="0.6" />
          <circle cx="300" cy="300" r="280" strokeWidth="1" opacity="0.35" />
          <circle cx="300" cy="300" r="340" strokeWidth="0.8" opacity="0.2" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Subtitle, CTA & Trust Points */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <h1
              ref={headlineRef}
              className="text-4xl sm:text-5xl lg:text-[56px] font-black text-slate-900 dark:text-white tracking-tight leading-[1.12]"
            >
              Explore thousands <br />
              hands-on creative <br />
              <span className="relative inline-block text-slate-900 dark:text-white pb-1">
                <span>skills.</span>
                {/* Hand-drawn Emerald Green Doodle Circle */}
                <svg
                  className="absolute -inset-x-6 -inset-y-3 w-[calc(100%+3rem)] h-[calc(100%+1.6rem)] pointer-events-none -z-0"
                  viewBox="0 0 250 82"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    ref={doodlePathRef}
                    d="M 28,45 C 24,24 82,14 155,15 C 212,16 244,28 242,46 C 240,64 190,75 116,76 C 50,77 12,65 15,45 C 17,29 58,18 130,17"
                    stroke="#00D285"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </h1>

            <p
              ref={subtextRef}
              className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed"
            >
              Connect with real peers to teach what you know and learn what you need.
              Zero tuition, 100% direct knowledge exchange. Unlock your creative potential.
            </p>

            {/* CTA Button with Playful Hand-Drawn Doodle */}
            <div ref={ctaRef} className="flex items-center gap-4 pt-2">
              <Link
                to="/marketplace"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#00D285] hover:bg-[#00BA76] text-white font-bold text-base shadow-lg shadow-[#00D285]/30 hover:shadow-xl hover:shadow-[#00D285]/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                Explore Classes
              </Link>
              {/* Hand-drawn radiating strokes */}
              <svg
                className="w-6 h-6 text-slate-800 dark:text-slate-200 -rotate-12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <line x1="12" y1="3" x2="12" y2="8" />
                <line x1="5" y1="8" x2="9" y2="12" />
                <line x1="19" y1="8" x2="15" y2="12" />
              </svg>
            </div>

            {/* Micro-features Check Row */}
            <div
              ref={featuresRef}
              className="pt-6 flex flex-wrap items-center gap-6 sm:gap-8 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium"
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-slate-800 dark:text-slate-200" />
                <span>1-on-1 peer mentorship</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Target className="w-4 h-4 text-slate-800 dark:text-slate-200" />
                <span>Personalized feedback</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-slate-800 dark:text-slate-200" />
                <span>1,400+ vetted network</span>
              </div>
            </div>
          </div>

          {/* Right Column: Centerpiece Mentor Cutout with Green Circle & 3D Badges */}
          <div className="lg:col-span-6 relative flex items-center justify-center pt-8 sm:pt-12 lg:pt-0">
            {/* 3D Yellow Notebook (Top Left) */}
            <img
              ref={bookRef}
              src="/images/book.png"
              alt="Notebook"
              className="absolute -top-4 sm:-top-8 left-4 sm:left-12 w-16 sm:w-22 z-20 pointer-events-none drop-shadow-xl -rotate-12"
            />

            {/* 3D Glowing Bulb (Top Right) */}
            <img
              ref={bulbRef}
              src="/images/bulb.png"
              alt="Lightbulb"
              className="absolute top-2 sm:-top-2 right-10 sm:right-20 w-12 sm:w-14 z-20 pointer-events-none drop-shadow-lg rotate-12"
            />

            {/* 3D Pencil (Bottom Right) */}
            <img
              ref={pencilRightRef}
              src="/images/pencil.png"
              alt="Pencil"
              className="absolute bottom-16 sm:bottom-20 right-2 sm:right-6 w-12 sm:w-14 z-20 pointer-events-none drop-shadow-lg -rotate-45"
            />

            {/* Main Centerpiece Composition */}
            <div ref={centerpieceRef} className="relative flex items-center justify-center">
              {/* Emerald Green Circular Backdrop */}
              <div className="w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] rounded-full bg-gradient-to-b from-[#00E59B] via-[#00D285] to-[#00A86B] shadow-[0_25px_60px_-10px_rgba(0,210,133,0.4)] flex items-center justify-center relative overflow-hidden">
                {/* Subtle internal ring contour */}
                <div className="absolute inset-4 rounded-full border border-white/20 pointer-events-none" />
              </div>

              {/* Cutout Mentor Portrait popping out above circle boundary */}
              <img
                src="/images/mentor.png"
                alt="Community Peer Mentor"
                className="absolute -top-14 sm:-top-20 z-10 w-[290px] sm:w-[390px] max-w-none object-contain pointer-events-none drop-shadow-md"
              />

              {/* Left Floating Badge (English / Popular Topic) */}
              <div
                ref={badgeLeftRef}
                className="absolute -left-3 sm:-left-10 bottom-16 sm:bottom-24 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl px-4 py-2.5 shadow-[0_12px_30px_-5px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-slate-800 flex items-center gap-3"
              >
                <span className="text-xl">🇺🇸</span>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                    English
                  </h4>
                  <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                    20 Popular Courses
                  </p>
                </div>
              </div>

              {/* Right Floating Badge (World Best / Top Rated) */}
              <div
                ref={badgeRightRef}
                className="absolute -right-3 sm:-right-8 top-16 sm:top-24 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl px-4 py-2.5 shadow-[0_12px_30px_-5px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-slate-800 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-base shadow-sm">
                  🏆
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                    World Best
                  </h4>
                  <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                    Top 10 popular elearning
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Floating Stats Card */}
        <div
          ref={statsRef}
          className="relative mt-16 sm:mt-20 w-full bg-[#F6F7F9] dark:bg-slate-900/90 rounded-3xl p-6 sm:p-9 shadow-sm border border-slate-200/70 dark:border-slate-800/80"
        >
          {/* Bottom Left 3D Pencil peek */}
          <img
            ref={pencilLeftRef}
            src="/images/pencil.png"
            alt="Pencil"
            className="absolute -bottom-10 -left-6 sm:-left-10 w-16 sm:w-20 z-20 pointer-events-none drop-shadow-xl rotate-45 hidden sm:block"
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-slate-800">
            <div className="pt-3 sm:pt-0">
              <div className="text-3xl sm:text-4xl lg:text-[44px] font-black text-slate-900 dark:text-white tracking-tight">
                21m.
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
                Active Learners
              </div>
            </div>

            <div className="pt-3 sm:pt-0">
              <div className="text-3xl sm:text-4xl lg:text-[44px] font-black text-slate-900 dark:text-white tracking-tight">
                4m.
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
                Graduates Learner
              </div>
            </div>

            <div className="pt-3 sm:pt-0">
              <div className="text-3xl sm:text-4xl lg:text-[44px] font-black text-slate-900 dark:text-white tracking-tight">
                35k+
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
                Video Courses
              </div>
            </div>

            <div className="pt-3 sm:pt-0">
              <div className="text-3xl sm:text-4xl lg:text-[44px] font-black text-slate-900 dark:text-white tracking-tight">
                195
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
                Countries
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
