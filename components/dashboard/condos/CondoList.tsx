import React from 'react';
import { Building2, Edit2, MapPin } from 'lucide-react';
import { Condominium } from '../../../types';

interface CondoListProps {
    condos: Condominium[];
    selectedCondoId: string | undefined;
    onSelect: (condo: Condominium) => void;
    onEdit: (condo: Condominium, e: React.MouseEvent) => void;
}

export const CondoList: React.FC<CondoListProps> = ({
    condos,
    selectedCondoId,
    onSelect,
    onEdit
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {condos.map(condo => (
                <div
                    key={condo.id}
                    onClick={() => onSelect(condo)}
                    className={`premium-card p-10 rounded-[3rem] border transition-all cursor-pointer group hover:shadow-3xl hover:-translate-y-2 relative overflow-hidden ${selectedCondoId === condo.id ? 'border-gold-500 bg-slate-100 dark:bg-zinc-900 ring-4 ring-gold-500/5 shadow-2xl' : 'shadow-sm'}`}
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gold-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="flex justify-between items-start mb-10 relative z-10">
                        <div className="p-6 bg-white dark:bg-zinc-950 text-gold-600 border border-slate-200 dark:border-zinc-800 rounded-3xl group-hover:bg-gold-600 group-hover:text-black transition-all shadow-xl">
                            <Building2 size={36} />
                        </div>
                        <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={(e) => onEdit(condo, e)} className="p-3 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-400 hover:text-gold-500 shadow-sm transition-all"><Edit2 size={18} /></button>
                        </div>
                    </div>
                    <h3 className="text-2xl font-black text-slate-950 dark:text-white tracking-tight mb-4 group-hover:gold-gradient-text transition-all leading-none">{condo.name}</h3>
                    <div className="space-y-6 relative z-10">
                        <div className="flex items-center gap-3 text-xs font-bold text-slate-500 dark:text-zinc-500">
                            <MapPin size={16} className="text-gold-600 shrink-0" /> <span className="truncate">{condo.address}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-100 dark:border-zinc-800">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-400 dark:text-zinc-700 uppercase tracking-widest mb-1">Unidades</span>
                                <span className="text-xl font-black text-slate-950 dark:text-white group-hover:text-gold-600 transition-colors">{condo.totalUnits}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-400 dark:text-zinc-700 uppercase tracking-widest mb-1">Dossiês Ativos</span>
                                <span className="text-xl font-black text-gold-600">{condo.activeProcesses} Litígios</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
