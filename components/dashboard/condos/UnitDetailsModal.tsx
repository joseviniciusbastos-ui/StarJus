import React from 'react';
import { History, Sparkles, Building2 } from 'lucide-react';
import { Modal } from '../../ui/Modal';
import { Unit } from '../../../types';

interface UnitDetailsModalProps {
    unit: Unit | null;
    onClose: () => void;
}

export const UnitDetailsModal: React.FC<UnitDetailsModalProps> = ({ unit, onClose }) => {
    if (!unit) return null;

    return (
        <Modal isOpen={!!unit} onClose={onClose} title={`Dossiê: Unidade ${unit.block}${unit.number}`}>
            <div className="space-y-10">
                <div className="p-10 bg-black dark:bg-zinc-950 rounded-[3rem] border border-gold-500/10 shadow-3xl flex flex-col md:flex-row items-center gap-10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gold-600/5 rounded-full blur-[60px]" />
                    <div className="p-6 bg-zinc-900 rounded-[2.5rem] border border-zinc-800 text-gold-500 shadow-2xl relative z-10 group-hover:bg-gold-600 group-hover:text-black transition-all">
                        <Building2 size={42} />
                    </div>
                    <div className="space-y-2 relative z-10 text-center md:text-left">
                        <h4 className="text-3xl font-black italic font-serif gold-gradient-text leading-none">{unit.owner}</h4>
                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Torre {unit.block} • Apartamento {unit.number}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <h5 className="text-[11px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-[0.4em] flex items-center gap-3">
                            <History size={18} className="text-gold-600" /> Histórico Operacional
                        </h5>
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                            {unit.logs.map(log => (
                                <div key={log.id} className="p-6 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[9px] font-black text-gold-600 uppercase tracking-widest">{log.action}</span>
                                        <span className="text-[9px] font-black text-slate-400 font-mono italic">{log.timestamp}</span>
                                    </div>
                                    <p className="text-sm font-bold text-slate-700 dark:text-zinc-400 leading-relaxed">{log.details}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-8">
                        <div className="p-10 bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-[2.5rem] shadow-sm space-y-6">
                            <div className="flex items-center gap-3">
                                <Sparkles className="text-gold-500" size={24} />
                                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-gold-600">AI Prediction</span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-zinc-500 leading-relaxed font-bold">
                                Unidade com alta probabilidade de adimplemento espontâneo. Recomendamos notificação consultiva amigável.
                            </p>
                        </div>
                        <button onClick={onClose} className="w-full py-6 bg-black dark:bg-white text-white dark:text-black rounded-3xl font-black uppercase text-[11px] tracking-widest active:scale-95 transition-all shadow-2xl">Fechar Dossiê</button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
