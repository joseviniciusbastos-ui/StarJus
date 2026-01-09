import React from 'react';
import { Plus, Search, Filter } from 'lucide-react';

interface ProcessHeaderProps {
    onNewProcess: () => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    onOpenFilter: () => void;
    activeFilter: string | null;
}

export const ProcessHeader: React.FC<ProcessHeaderProps> = ({
    onNewProcess,
    searchTerm,
    setSearchTerm,
    onOpenFilter,
    activeFilter,
}) => {
    return (
        <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black tracking-tighter text-slate-950 dark:text-white uppercase leading-none italic font-serif gold-gradient-text">Litígios Ativos.</h1>
                    <p className="text-slate-500 dark:text-zinc-500 font-black uppercase text-[10px] tracking-[0.4em]">Gestão de Processos Monitorados</p>
                </div>
                <button
                    onClick={onNewProcess}
                    className="w-full sm:w-auto bg-black dark:bg-white text-white dark:text-black px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-[11px] shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                    <Plus size={18} /> Novo Registro
                </button>
            </div>

            <div className="premium-card p-6 rounded-[2.5rem] flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-6 top-4.5 h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-16 pr-6 py-4.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900 rounded-3xl outline-none text-slate-950 dark:text-white font-black text-sm shadow-inner"
                        placeholder="Buscar por número CNJ ou Cliente..."
                    />
                </div>
                <button
                    onClick={onOpenFilter}
                    className={`px-8 py-4.5 bg-white dark:bg-black border rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-3 ${activeFilter ? 'border-gold-500 text-gold-600' : 'border-slate-200 dark:border-zinc-800 text-slate-500 hover:text-gold-600'}`}
                >
                    <Filter size={18} /> {activeFilter || 'Filtros'}
                </button>
            </div>
        </>
    );
};
