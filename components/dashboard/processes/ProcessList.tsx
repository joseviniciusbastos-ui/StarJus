import React from 'react';
import { Scale, Edit2, ChevronRight } from 'lucide-react';
import { Process } from '../../../types';

interface ProcessListProps {
    processes: Process[];
    onSelect: (process: Process) => void;
    onEdit: (process: Process, e: React.MouseEvent) => void;
}

export const ProcessList: React.FC<ProcessListProps> = ({ processes, onSelect, onEdit }) => {
    return (
        <div className="grid grid-cols-1 gap-8">
            {processes.map((p) => (
                <div key={p.id} onClick={() => onSelect(p)} className="premium-card p-8 md:p-12 rounded-[3rem] group cursor-pointer hover:border-gold-500 flex flex-col xl:flex-row items-center gap-10">
                    <div className="flex items-center gap-8 flex-1 w-full">
                        <div className="p-6 bg-slate-50 dark:bg-zinc-950 rounded-[2.5rem] border border-slate-200 dark:border-zinc-800 text-gold-600 group-hover:bg-gold-500 group-hover:text-black transition-all shadow-xl">
                            <Scale size={36} />
                        </div>
                        <div className="space-y-2 flex-1 min-w-0">
                            <h3 className="text-2xl font-black text-slate-950 dark:text-white leading-none truncate group-hover:gold-gradient-text transition-all">{p.title}</h3>
                            <p className="text-sm font-bold text-slate-400 dark:text-zinc-600 font-mono tracking-tight">{p.number}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 w-full xl:w-auto">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black text-slate-400 dark:text-zinc-700 uppercase tracking-widest">Clientela</span>
                            <p className="text-sm font-black text-slate-700 dark:text-zinc-300 truncate">{p.client}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] font-black text-slate-400 dark:text-zinc-700 uppercase tracking-widest">Exposure</span>
                            <p className="text-sm font-black text-slate-950 dark:text-white">{p.value}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] font-black text-slate-400 dark:text-zinc-700 uppercase tracking-widest">Vara/Tribunal</span>
                            <p className="text-sm font-black text-slate-600 dark:text-zinc-400">{p.court}</p>
                        </div>
                        <div className="flex items-center justify-end gap-6">
                            <span className="px-5 py-2 text-[10px] font-black rounded-full bg-gold-600/10 text-gold-600 border border-gold-600/20 uppercase tracking-widest whitespace-nowrap">Status: Ativo</span>
                            <button onClick={(e) => onEdit(p, e)} className="p-3 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl text-slate-400 hover:text-gold-500 opacity-0 group-hover:opacity-100 transition-all"><Edit2 size={16} /></button>
                        </div>
                    </div>
                    <ChevronRight className="text-slate-200 dark:text-zinc-800 group-hover:text-gold-500 transition-all hidden xl:block" size={28} />
                </div>
            ))}
        </div>
    );
};
