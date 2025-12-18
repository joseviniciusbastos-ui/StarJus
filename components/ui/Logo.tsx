
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
        
        <svg 
          width={size} 
          height={size} 
          viewBox="0 0 40 40" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className={`relative z-10 transition-all duration-1000 ${animate ? 'group-hover:scale-110 group-hover:rotate-[5deg]' : ''}`}
        >
          {/* Pilar Esquerdo - Símbolo de Lei e Suporte */}
          <rect x="6" y="2" width="8" height="36" fill="url(#premiumGold)" rx="2" />
          
          {/* Pilar Direito com Base - O J Curvo da Justiça */}
          <rect x="26" y="2" width="8" height="26" fill="url(#premiumGold)" rx="2" />
          <rect x="16" y="30" width="18" height="8" fill="url(#premiumGold)" rx="2" />
          
          {/* Elemento de Balança Central - Simbolizando Equilíbrio */}
          <path d="M14 18H26" stroke="url(#premiumGold)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          
          <defs>
            <linearGradient id="premiumGold" x1="6" y1="2" x2="34" y2="38" gradientUnits="userSpaceOnUse">
              <stop stopColor="#bf953f" />
              <stop offset="0.25" stopColor="#fcf6ba" />
              <stop offset="0.5" stopColor="#b38728" />
              <stop offset="0.75" stopColor="#fbf5b7" />
              <stop offset="1" stopColor="#aa771c" />
            </linearGradient>
          </defs>
        </svg>
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
