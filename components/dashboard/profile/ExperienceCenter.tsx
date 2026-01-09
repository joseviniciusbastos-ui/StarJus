import React from 'react';
import { Zap, BellRing, Music } from 'lucide-react';
import { useNotification } from '../../../lib/hooks/useNotification';

interface ExperienceCenterProps {
    theme: string | null;
    handleThemeChange: (id: string) => void;
    notifSound: boolean;
    setNotifSound: (val: boolean) => void;
    notifEmail: boolean;
    setNotifEmail: (val: boolean) => void;
    pomodoroSound: string;
    setPomodoroSound: (val: string) => void;
}

const THEMES = [
    { id: 'midnight-gold', name: 'Midnight Gold', desc: 'Dark & Premium', color: '#D4AF37' },
    { id: 'ivory-business', name: 'Ivory Business', desc: 'Light & Executive', color: '#8B7355' },
    { id: 'ocean-deep', name: 'Ocean Deep', desc: 'Cyan & Tech', color: '#00AFB9' },
    { id: 'forest-legal', name: 'Forest Legal', desc: 'Organic & Secure', color: '#10B981' },
    { id: 'cyber-justice', name: 'Cyber Justice', desc: 'Neon & Future', color: '#D946EF' },
    { id: 'royal-velvet', name: 'Royal Velvet', desc: 'Bordeaux & Class', color: '#DC2626' },
    { id: 'minimalist-slate', name: 'Slate Minimal', desc: 'Pure & Simple', color: '#334155' },
    { id: 'sunrise-law', name: 'Sunrise Law', desc: 'Warm & Active', color: '#F59E0B' },
    { id: 'amethyst-legal', name: 'Amethyst', desc: 'Purple & Wise', color: '#8B5CF6' },
    { id: 'terra-cotta', name: 'Terra Cotta', desc: 'Earthy & Strong', color: '#EA580C' },
];

export const ExperienceCenter: React.FC<ExperienceCenterProps> = ({
    theme,
    handleThemeChange,
    notifSound,
    setNotifSound,
    notifEmail,
    setNotifEmail,
    pomodoroSound,
    setPomodoroSound
}) => {
    const { playSound } = useNotification();

    return (
        <div className="space-y-12 animate-in slide-in-from-right-5 duration-500">
            {/* Themes Grid */}
            <div className="premium-card p-12 rounded-[3.5rem] space-y-10">
                <h3 className="text-2xl font-black text-slate-950 dark:text-white uppercase italic tracking-tighter">Experience Center • Temas.</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {THEMES.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => handleThemeChange(t.id)}
                            className={`flex flex-col items-center gap-4 p-6 rounded-[2.5rem] border-2 transition-all hover:scale-105 active:scale-95 ${theme === t.id ? 'border-gold-500 bg-gold-500/5' : 'border-slate-100 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-900/30'}`}
                        >
                            <div
                                className="w-12 h-12 rounded-2xl shadow-xl border border-white/10"
                                style={{ backgroundColor: t.color }}
                            />
                            <div className="text-center">
                                <p className="text-[10px] font-black uppercase tracking-tighter text-slate-950 dark:text-white">{t.name}</p>
                                <p className="text-[8px] font-bold text-zinc-500 mt-1 uppercase tracking-widest">{t.desc}</p>
                            </div>
                            {theme === t.id && <Zap size={10} className="text-gold-500 fill-gold-500 animate-pulse" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Notifications Center */}
            <div className="premium-card p-12 rounded-[3.5rem] space-y-10">
                <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-black text-slate-950 dark:text-white uppercase italic tracking-tighter">Alertas & Sonoplastia.</h3>
                    <BellRing size={24} className="text-gold-500" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="flex items-center justify-between p-8 bg-slate-50 dark:bg-zinc-900 rounded-[2rem] border border-slate-100 dark:border-zinc-800">
                        <div className="space-y-2">
                            <p className="text-xs font-black text-slate-950 dark:text-white uppercase">Sons de Alerta</p>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Feedback sonoro em tempo real</p>
                        </div>
                        <button
                            onClick={() => setNotifSound(!notifSound)}
                            className={`w-14 h-8 rounded-full relative transition-all ${notifSound ? 'bg-gold-500' : 'bg-zinc-700'}`}
                        >
                            <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${notifSound ? 'right-1' : 'left-1'}`} />
                        </button>
                    </div>
                    <div className="flex items-center justify-between p-8 bg-slate-50 dark:bg-zinc-900 rounded-[2rem] border border-slate-100 dark:border-zinc-800">
                        <div className="space-y-2">
                            <p className="text-xs font-black text-slate-950 dark:text-white uppercase">Relatórios por E-mail</p>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Balanço diário de atividades</p>
                        </div>
                        <button
                            onClick={() => setNotifEmail(!notifEmail)}
                            className={`w-14 h-8 rounded-full relative transition-all ${notifEmail ? 'bg-emerald-500' : 'bg-zinc-700'}`}
                        >
                            <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${notifEmail ? 'right-1' : 'left-1'}`} />
                        </button>
                    </div>
                    <div className="md:col-span-2 space-y-4">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Sonoridade do Pomodoro (Timer Gongo)</label>
                        <div className="flex gap-4">
                            {['gongo', 'modern', 'digital'].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => { setPomodoroSound(s); playSound('pomodoro'); }}
                                    className={`flex-1 py-4 rounded-2xl border transition-all text-[10px] font-black uppercase tracking-widest ${pomodoroSound === s ? 'bg-black dark:bg-white text-white dark:text-black border-transparent' : 'bg-slate-50 dark:bg-zinc-900 text-zinc-500 border-slate-200 dark:border-zinc-800'}`}
                                >
                                    <Music size={12} className="inline mr-2" /> {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
