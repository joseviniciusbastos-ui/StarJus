import React, { useState } from 'react';
import { Send, Inbox } from 'lucide-react';
import { Modal } from '../../ui/Modal';

interface EmailComposeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSend: (subject: string, content: string) => Promise<void>;
}

export const EmailComposeModal: React.FC<EmailComposeModalProps> = ({ isOpen, onClose, onSend }) => {
    const [composeData, setComposeData] = useState({ subject: '', content: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSend(composeData.subject, composeData.content);
        setComposeData({ subject: '', content: '' });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Compor Correspondência Judicial">
            <form onSubmit={handleSubmit} className="space-y-8 pt-4">
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Para (Tribunal / Parte)</label>
                    <div className="relative">
                        <Inbox className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                        <input value="atendimento@starjus.com.br" disabled className="w-full bg-zinc-900/50 border border-zinc-900 rounded-[1.5rem] pl-14 pr-8 py-5 text-sm text-zinc-500 font-bold cursor-not-allowed" />
                    </div>
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Assunto / Referência CNJ</label>
                    <input
                        required
                        value={composeData.subject}
                        onChange={(e) => setComposeData(prev => ({ ...prev, subject: e.target.value }))}
                        className="w-full bg-zinc-950 border border-zinc-900 rounded-[1.5rem] px-8 py-5 text-sm text-white focus:border-gold-500 outline-none transition-all font-bold placeholder:text-zinc-800"
                        placeholder="Ex: Contestação - Caso #4592 - Silva"
                    />
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Corpo da Mensagem</label>
                    <textarea
                        required
                        value={composeData.content}
                        onChange={(e) => setComposeData(prev => ({ ...prev, content: e.target.value }))}
                        className="w-full bg-zinc-950 border border-zinc-900 rounded-[2rem] px-8 py-8 text-sm text-white focus:border-gold-500 outline-none transition-all font-medium placeholder:text-zinc-800 min-h-[300px] leading-relaxed resize-none"
                        placeholder="Descreva aqui o teor jurídico..."
                    />
                </div>
                <div className="pt-6 border-t border-zinc-900 flex gap-4">
                    <button type="button" onClick={onClose} className="flex-1 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Descartar</button>
                    <button type="submit" className="flex-[2] bg-gold-500 text-black py-6 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3">
                        <Send size={16} /> Autenticar e Enviar
                    </button>
                </div>
            </form>
        </Modal>
    );
};
