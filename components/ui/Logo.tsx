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
  size = 72,
  showText = true,
  textColor = "text-white",
  animate = true
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      {/* Logo Image - Usando o favicon/logomarca original */}
      <div className="relative group shrink-0">
        <img
          src="/favicon.png"
          alt="StarJus Logo"
          width={size}
          height={size}
          className={`relative z-10 rounded-2xl transition-all duration-300 ${animate ? 'hover:scale-105' : ''}`}
        />
        {/* Brilho sutil atrás da logo */}
        <div className="absolute inset-0 bg-gold-500/10 blur-xl rounded-full -z-10" />
      </div>

      {showText && (
        <div className="flex flex-col ml-4">
          <div className="flex items-baseline gap-2">
            <span className={`text-4xl font-black tracking-tighter ${textColor} leading-none uppercase`}>
              STAR<span className="gold-gradient-text font-serif italic">JUS</span>
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
