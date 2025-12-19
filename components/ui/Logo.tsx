
import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textColor?: string;
  animate?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = "",
  size = 64,
  showText = true,
  textColor = "text-white",
  animate = true
}) => {
  return (
    <div className={`flex items-center gap-6 ${className}`}>
      <div className="relative group">
        {/* Aura pulsante de autoridade */}
        <div className="absolute inset-0 bg-gold-500 rounded-full blur-3xl opacity-20 animate-aura-pulse" />

        <img
          src="/favicon.png"
          alt="StarJus Logo"
          width={size}
          height={size}
          className={`relative z-10 rounded-xl transition-all duration-1000 ${animate ? 'group-hover:scale-110 group-hover:rotate-[5deg]' : ''}`}
        />
      </div>

      {showText && (
        <div className="flex flex-col animate-text-reveal">
          <div className="flex items-baseline gap-2">
            <span className={`text-4xl font-black tracking-tighter ${textColor} leading-none uppercase`}>
              STAR<span className="gold-gradient-text font-serif italic drop-shadow-[0_2px_10px_rgba(212,175,55,0.3)]">JUS</span>
            </span>
          </div>
          <div className="h-[2px] w-full bg-gradient-to-r from-gold-600 via-gold-400/20 to-transparent mt-2" />
          <span className="text-[9px] font-black tracking-[0.6em] uppercase text-gold-600/60 mt-2 block">
            Absolute Legal Intelligence
          </span>
        </div>
      )}
    </div>
  );
};
