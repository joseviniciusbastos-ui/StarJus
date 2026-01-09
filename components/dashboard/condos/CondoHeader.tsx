import React from 'react';
import { Plus } from 'lucide-react';

interface CondoHeaderProps {
    onRegister: () => void;
}

export const CondoHeader: React.FC<CondoHeaderProps> = ({ onRegister }) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="space-y-2">
                <h1 className="text-4xl font-black tracking-tighter text-slate-950 dark:text-white italic font-serif gold-gradient-text leading-none uppercase">Ativos.</h1>
                <p className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-[0.4em]">Gestão de Unidades Gestoras & Habitacionais</p>
            </div>
            <button
                onClick={onRegister}
                className="w-full sm:w-auto bg-black dark:bg-white text-white dark:text-black px-10 py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-3xl transition-all flex items-center justify-center gap-3 active:scale-95"
            >
                <Plus size={18} /> Registrar Unidade Gestora
            </button>
        </div>
    );
};
