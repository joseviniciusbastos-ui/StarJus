import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Modal } from '../../ui/Modal';
import { Email } from './EmailList';

interface EmailViewModalProps {
    email: Email | null;
    onClose: () => void;
}

export const EmailViewModal: React.FC<EmailViewModalProps> = ({ email, onClose }) => {
    if (!email) return null;

    return (
        <Modal
            isOpen={!!email}
            onClose={onClose}
            title="Detalhes da Correspondência"
        >
            <div className="space-y-10 animate-fade-in">
                <div className="flex justify-between items-start pt-4">
                    <div className="space-y-4">
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">{email.subject}</h3>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gold-500 flex items-center justify-center rounded-xl text-black font-black uppercase">
                                {email.sender_name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-xs font-black text-white uppercase tracking-wider">{email.sender_name}</p>
                                <p className="text-[10px] text-zinc-500 font-bold lowercase">{email.sender_email}</p>
                            </div>
                        </div>
                    </div>
                    <div className="text-right space-y-2">
                        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Data Recebida</p>
                        <p className="text-xs font-mono text-white">{format(new Date(email.created_at), "dd 'de' MMMM, yyyy", { locale: ptBR })}</p>
                    </div>
                </div>

                <div className="bg-zinc-900/50 p-10 rounded-[2.5rem] border border-zinc-900 border-l-4 border-l-gold-500 shadow-inner">
                    <p className="text-sm text-zinc-300 leading-[1.8] font-medium whitespace-pre-wrap">
                        {email.content}
                    </p>
                </div>

                <div className="flex gap-4">
                    <button className="flex-1 bg-zinc-900 text-zinc-400 py-6 rounded-3xl font-black uppercase text-[10px] tracking-widest border border-zinc-800 hover:bg-zinc-800 hover:text-white transition-all">
                        Arquivar
                    </button>
                    <button className="flex-1 bg-gold-500 text-black py-6 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-2xl active:scale-95 transition-all">
                        Responder
                    </button>
                </div>
            </div>
        </Modal>
    );
};
