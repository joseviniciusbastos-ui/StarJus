import React from 'react';
import { LayoutList, Plus, ChevronRight } from 'lucide-react';
import { Unit } from '../../../types';

interface UnitListProps {
    condoName: string;
    units: Unit[];
    onAddUnit: () => void;
    onSelectUnit: (unit: Unit) => void;
}

export const UnitList: React.FC<UnitListProps> = ({
    condoName,
    units,
    onAddUnit,
    onSelectUnit
}) => {
    return (
        <div className="premium-card rounded-[3rem] md:rounded-[4rem] overflow-hidden animate-in slide-in-from-top-4 duration-700 shadow-3xl">
            <div className="p-10 md:p-14 border-b border-slate-100 dark:border-zinc-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-slate-50/50 dark:bg-zinc-950/50 backdrop-blur-xl shrink-0">
                <div className="flex items-center gap-6">
                    <div className="p-4 bg-black dark:bg-white rounded-3xl text-white dark:text-black shadow-3xl"><LayoutList size={28} /></div>
                    <div>
                        <h2 className="text-3xl font-black text-slate-950 dark:text-white tracking-tighter leading-none mb-2 uppercase">{condoName}</h2>
                        <p className="text-[10px] font-black text-slate-500 dark:text-zinc-600 uppercase tracking-[0.4em]">Sub-Painel: Unidades Habitacionais</p>
                    </div>
                </div>
                <button
                    onClick={onAddUnit}
                    className="w-full md:w-auto bg-white dark:bg-black text-slate-950 dark:text-white border border-slate-200 dark:border-zinc-800 px-8 py-4.5 rounded-3xl font-black text-[11px] uppercase tracking-widest hover:border-gold-500 transition-all flex items-center justify-center gap-3 shadow-sm active:scale-95"
                >
                    <Plus size={16} /> Registrar Unidade
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-slate-50 dark:bg-zinc-950 border-b border-slate-100 dark:border-zinc-900">
                        <tr>
                            <th className="px-12 py-7 text-[10px] font-black text-slate-400 dark:text-zinc-700 uppercase tracking-widest text-left">Identificação</th>
                            <th className="px-12 py-7 text-[10px] font-black text-slate-400 dark:text-zinc-700 uppercase tracking-widest text-left">Titularidade Jurídica</th>
                            <th className="px-12 py-7 text-[10px] font-black text-slate-400 dark:text-zinc-700 uppercase tracking-widest text-left">Governança Fiscal</th>
                            <th className="px-12 py-7 text-right"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-zinc-900 bg-white dark:bg-black">
                        {units.map(unit => (
                            <tr
                                key={unit.id}
                                onClick={() => onSelectUnit(unit)}
                                className="hover:bg-slate-50 dark:hover:bg-zinc-900/50 group cursor-pointer transition-all"
                            >
                                <td className="px-12 py-8">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-[1.8rem] flex items-center justify-center text-slate-950 dark:text-zinc-500 font-black text-sm shadow-xl group-hover:bg-gold-600 group-hover:text-black group-hover:border-gold-500 transition-all">
                                            {unit.block}{unit.number}
                                        </div>
                                        <span className="text-base font-black text-slate-950 dark:text-zinc-300 group-hover:text-gold-600 transition-colors uppercase font-mono">B.{unit.block} • UN.{unit.number}</span>
                                    </div>
                                </td>
                                <td className="px-12 py-8 text-sm font-bold text-slate-500 dark:text-zinc-600 group-hover:text-slate-950 dark:group-hover:text-zinc-300 transition-colors">{unit.owner}</td>
                                <td className="px-12 py-8">
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-5 py-2 rounded-full border shadow-sm ${unit.status === 'Debt' ? 'bg-orange-500/10 text-orange-600 border-orange-500/20' :
                                        unit.status === 'LegalAction' ? 'bg-red-500/10 text-red-600 border-red-500/20' :
                                            'bg-gold-600/10 text-gold-600 border-gold-600/20'
                                        }`}>
                                        {unit.status === 'Debt' ? 'Protocolo: Inadimplente' : unit.status === 'LegalAction' ? 'Litígio Ativo' : 'Compliance: OK'}
                                    </span>
                                </td>
                                <td className="px-12 py-8 text-right">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-100 dark:bg-zinc-950 text-slate-400 group-hover:bg-gold-600 group-hover:text-black shadow-xl transition-all">
                                        <ChevronRight size={22} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
