import React from 'react';
import { Modal } from '../../ui/Modal';

interface UnitModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    isSaving: boolean;
}

export const UnitModal: React.FC<UnitModalProps> = ({ isOpen, onClose, onSubmit, isSaving }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Nova Unidade Habitacional">
            <form className="space-y-8" onSubmit={onSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest ml-1">Torre / Bloco</label>
                        <input name="block" required className="w-full px-8 py-5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl outline-none text-slate-950 dark:text-white font-black transition-all focus:border-gold-500 shadow-inner" placeholder="Ex: Torre A" />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest ml-1">Número da Unidade</label>
                        <input name="number" required className="w-full px-8 py-5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl outline-none text-slate-950 dark:text-white font-black transition-all focus:border-gold-500 shadow-inner" placeholder="Ex: 101" />
                    </div>
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest ml-1">Titular de Direito (Proprietário)</label>
                    <input name="owner" required className="w-full px-8 py-5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl outline-none text-slate-950 dark:text-white font-black transition-all focus:border-gold-500 shadow-inner" placeholder="Nome Completo do Titular" />
                </div>
                <div className="pt-8 flex flex-col sm:flex-row gap-6 border-t border-slate-100 dark:border-zinc-900">
                    <button type="button" onClick={onClose} className="flex-1 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">Abortar</button>
                    <button type="submit" disabled={isSaving} className="flex-[2] py-6 bg-black dark:bg-white text-white dark:text-black rounded-3xl font-black uppercase tracking-widest text-[11px] shadow-2xl active:scale-95 transition-all disabled:opacity-50">
                        {isSaving ? "Efetivando..." : "Efetivar Unidade"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
