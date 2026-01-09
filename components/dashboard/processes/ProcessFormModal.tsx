import React from 'react';
import { Modal } from '../../ui/Modal';
import { Process, Client } from '../../../types';

interface ProcessFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    editingProcess: Process | null;
    clients: Client[];
}

export const ProcessFormModal: React.FC<ProcessFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    editingProcess,
    clients
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={editingProcess ? "Atualizar Registro" : "Novo Registro de Litígio"}
        >
            <form className="space-y-8" onSubmit={onSubmit}>
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest ml-1">Denominação do Processo</label>
                    <input name="title" defaultValue={editingProcess?.title} required className="w-full px-8 py-5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl outline-none text-slate-950 dark:text-white font-black transition-all focus:border-gold-500 shadow-inner" placeholder="Ex: Silva vs Construtora Alpha" />
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest ml-1">Número CNJ / Indexador</label>
                    <input name="number" defaultValue={editingProcess?.number} required className="w-full px-8 py-5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl outline-none text-slate-950 dark:text-white font-black transition-all focus:border-gold-500 shadow-inner" placeholder="0000000-00.0000.0.00.0000" />
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest ml-1">Cliente Vinculado</label>
                    <select name="client_id" className="w-full px-8 py-5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl outline-none text-slate-950 dark:text-white font-black transition-all focus:border-gold-500 shadow-inner appearance-none">
                        <option value="">Selecionar Cliente...</option>
                        {clients.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest ml-1">Tribunal de Origem</label>
                        <input name="court" defaultValue={editingProcess?.court} className="w-full px-8 py-5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl outline-none text-slate-950 dark:text-white font-black transition-all focus:border-gold-500 shadow-inner" placeholder="Ex: 3ª Vara Cível SP" />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest ml-1">Expectativa Econômica</label>
                        <input name="value" defaultValue={editingProcess?.value} className="w-full px-8 py-5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl outline-none text-slate-950 dark:text-white font-black transition-all focus:border-gold-500 shadow-inner" placeholder="R$ 0,00" />
                    </div>
                </div>
                <div className="pt-8 flex flex-col sm:flex-row gap-6 border-t border-slate-100 dark:border-zinc-900">
                    <button type="button" onClick={onClose} className="flex-1 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">Cancelar</button>
                    <button type="submit" className="flex-[2] py-6 bg-black dark:bg-white text-white dark:text-black rounded-3xl font-black uppercase tracking-widest text-[11px] shadow-2xl active:scale-95 transition-all">
                        {editingProcess ? "Efetivar Alteração" : "Confirmar Registro"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
