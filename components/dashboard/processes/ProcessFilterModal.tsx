import React from 'react';
import { Modal } from '../../ui/Modal';

interface ProcessFilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    activeFilter: string | null;
    setActiveFilter: (filter: string | null) => void;
}

export const ProcessFilterModal: React.FC<ProcessFilterModalProps> = ({
    isOpen,
    onClose,
    activeFilter,
    setActiveFilter
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Parâmetros de Filtragem">
            <div className="space-y-10">
                <div className="space-y-6">
                    <h4 className="text-[11px] font-black text-slate-400 dark:text-zinc-700 uppercase tracking-widest">Área Jurídica</h4>
                    <div className="flex flex-wrap gap-3">
                        {['Cível', 'Tributário', 'Família', 'Empresarial', 'Condominial'].map(tag => (
                            <button
                                key={tag}
                                onClick={() => setActiveFilter(tag)}
                                className={`px-6 py-3 border rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === tag ? 'bg-gold-500 text-black border-gold-500' : 'bg-slate-100 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-500 hover:border-gold-500'}`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="space-y-6">
                    <h4 className="text-[11px] font-black text-slate-400 dark:text-zinc-700 uppercase tracking-widest">Status do Fluxo</h4>
                    <div className="flex flex-wrap gap-3">
                        {['Active', 'Suspended', 'Done'].map(st => (
                            <button
                                key={st}
                                onClick={() => setActiveFilter(st)}
                                className={`px-6 py-3 border rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === st ? 'bg-gold-500 text-black border-gold-500' : 'bg-slate-100 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-500 hover:border-gold-500'}`}
                            >
                                {st}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => setActiveFilter(null)} className="flex-1 py-6 bg-slate-100 dark:bg-zinc-900 text-slate-400 rounded-3xl font-black uppercase text-[11px] tracking-widest">Limpar</button>
                    <button onClick={onClose} className="flex-[2] py-6 bg-black dark:bg-white text-white dark:text-black rounded-3xl font-black uppercase text-[11px] tracking-widest shadow-2xl transition-all">Sincronizar Visão</button>
                </div>
            </div>
        </Modal>
    );
};
