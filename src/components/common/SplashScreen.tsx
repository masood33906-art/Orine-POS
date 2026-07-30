import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinished?: () => void;
}

// Fixed display duration — no progress bar, no status text, just the brand.
const DISPLAY_DURATION_MS = 4000;

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinished }) => {
  const [mounted, setMounted] = useState(false);

  // Trigger the entrance animation on the next frame after mount.
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Hold the splash for exactly 4 seconds, then hand control back to the app.
  useEffect(() => {
    if (!onFinished) return;
    const timer = setTimeout(onFinished, DISPLAY_DURATION_MS);
    return () => clearTimeout(timer);
  }, [onFinished]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex items-center justify-center overflow-hidden select-none font-sans">

      {/* Ambient background glow */}
      <div className="absolute -top-32 -left-24 w-96 h-96 bg-red-600/25 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute -bottom-32 -right-20 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: '1.2s' }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.04),transparent_60%)]" />

      {/* Brand */}
      <div
        className={`relative flex flex-col items-center text-center transition-all duration-700 ease-out ${
          mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-3 scale-95'
        }`}
      >
        {/* Logo mark */}
        {/* Logo mark — actual brand logo image */}
        <div className="relative mb-7">
          <div className="absolute -inset-3 bg-gradient-to-br from-red-600 to-orange-500 rounded-[2rem] blur-2xl opacity-40 animate-pulse" />
          <div className="relative w-24 h-24 rounded-[1.5rem] bg-white shadow-2xl shadow-red-950/50 flex items-center justify-center border border-white/10 overflow-hidden p-3">
            <img
              src="/apple-touch-icon.png"
              alt="Orine POS"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Wordmark */}
        <h1 className="text-4xl font-black tracking-tight text-white">
          Orine{' '}
          <span className="bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
            POS
          </span>
        </h1>
        <p className="mt-2.5 text-sm text-slate-400 font-medium tracking-wide">
          Smart POS &amp; Business Management Suite
        </p>

        {/* Subtle decorative pulse dots — purely aesthetic, not a progress indicator */}
        <div className="mt-9 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="w-1.5 h-1.5 rounded-full bg-red-500/60 animate-pulse" style={{ animationDelay: '0.25s' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-red-500/30 animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-7 text-[11px] text-slate-600 font-medium tracking-wide">
        Powered by Orine Technologies
      </div>
    </div>
  );
};
