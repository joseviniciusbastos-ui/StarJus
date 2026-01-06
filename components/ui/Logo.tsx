import React from 'react';
import { Scale } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textColor?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = "",
  size = 72,
  showText = true,
  textColor = "text-white",
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      {/* Ícone sem imagem de fundo */}
      <div className="relative group shrink-0">
        <div
          className="relative z-10 bg-gradient-to-br from-gold-500 to-gold-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-gold-500/30 transition-all duration-300 group-hover:scale-105"
          style={{ width: size, height: size }}
        >
          <Scale className="text-black" size={size * 0.55} strokeWidth={2.5} />
        </div>
        <div className="absolute inset-0 bg-gold-500/20 blur-xl rounded-full -z-10 group-hover:bg-gold-500/30 transition-all" />
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
