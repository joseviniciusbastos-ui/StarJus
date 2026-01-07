import React, { useState, useEffect } from 'react';
import { Mail, Send, Trash2, Star, Circle, Search, Filter, RefreshCw, ChevronRight, Inbox, Archive, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Email {
    id: string;
    sender_name: string;
    sender_email: string;
    subject: string;
    content: string;
    created_at: string;
    is_read: boolean;
    is_starred: boolean;
    category: 'inbox' | 'sent' | 'archive';
}

export const EmailModule: React.FC = () => {
    const { officeId, officeName } = useAuth();
    const [emails, setEmails] = useState<Email[]>([]);
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
    const [loading, setLoading] = useState(true);
    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [composeData, setComposeData] = useState({ subject: '', content: '' });

    useEffect(() => {
        fetchEmails();
    }, [officeId]);

    const fetchEmails = async () => {
        try {
            setLoading(true);
            const { data, error } = await (supabase
                .from('office_emails')
                .select('*')
                .order('created_at', { ascending: false }) as any);

            if (error) throw error;
            setEmails(data || []);
        } catch (error) {
            console.error('Error fetching emails:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (emailId: string) => {
        try {
            const { error } = await (supabase
                .from('office_emails')
                .update({ is_read: true } as any)
                .eq('id', emailId) as any);

            if (error) throw error;

            setEmails(current =>
                current.map(e => e.id === emailId ? { ...e, is_read: true } : e)
            );
        } catch (error) {
            console.error('Error marking email as read:', error);
        }
    };

    const handleSendEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { error } = await (supabase
                .from('office_emails')
                .insert({
                    office_id: officeId,
                    sender_name: user.user_metadata.full_name || user.email,
                    sender_email: user.email,
                    subject: composeData.subject,
                    content: composeData.content
                } as any) as any);

            if (error) throw error;

            setIsComposeOpen(false);
            setComposeData({ subject: '', content: '' });
            fetchEmails();
        } catch (error) {
            console.error('Error sending email:', error);
        }
    };

    return (
        <div className="flex h-full bg-zinc-950 border border-zinc-900 rounded-[2.5rem] overflow-hidden shadow-2xl animate-fade-in">
            {/* Sidebar */}
            <div className="w-80 bg-zinc-900/50 border-r border-zinc-900 flex flex-col">
                <div className="p-8 space-y-8">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-10 h-10 bg-gold-500/10 rounded-2xl flex items-center justify-center border border-gold-500/20">
                            <Mail className="text-gold-500" size={20} />
                        </div>
                        <div>
                            <h2 className="text-sm font-black text-white uppercase tracking-widest">{officeName || 'Escritório'}</h2>
                            <p className="text-[10px] text-gold-500/60 font-black lowercase tracking-tighter">
                                {officeName ? `${officeName.toLowerCase().replace(/\s+/g, '')}@starjus.com.br` : 'office@starjus.com.br'}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsComposeOpen(true)}
                        className="w-full bg-gradient-to-r from-gold-600 to-gold-400 text-black py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all active:scale-95"
                    >
                        Compor Nova Estratégia
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-1">
                    {[
                        { icon: Inbox, label: 'Principais', count: emails.filter(e => !e.is_read).length, active: true },
                        { icon: Star, label: 'Prioritários', count: 0 },
                        { icon: Send, label: 'Enviados', count: 0 },
                        { icon: Archive, label: 'Arquivados', count: 0 },
                        { icon: Trash2, label: 'Lixeira', count: 0 },
                    ].map((item) => (
                        <button
                            key={item.label}
                            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group ${item.active ? 'bg-gold-500/10 text-gold-500 border border-gold-500/20' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'}`}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon size={16} />
                                <span className="text-[11px] font-black uppercase tracking-wider">{item.label}</span>
                            </div>
                            {item.count > 0 && (
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${item.active ? 'bg-gold-500 text-black' : 'bg-zinc-800 text-zinc-500'}`}>
                                    {item.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Email List */}
            <div className="flex-1 flex flex-col bg-zinc-950">
                <div className="p-8 border-b border-zinc-900 flex items-center justify-between">
                    <div className="relative flex-1 max-w-xl">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar correspondência jurídica..."
                            className="w-full bg-zinc-900/50 border border-zinc-900 rounded-2xl pl-14 pr-6 py-3.5 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-gold-500/50 transition-all font-bold"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-3 bg-zinc-900 rounded-2xl text-zinc-500 hover:text-white transition-all border border-zinc-800">
                            <Filter size={18} />
                        </button>
                        <button onClick={fetchEmails} className="p-3 bg-zinc-900 rounded-2xl text-zinc-500 hover:text-white transition-all border border-zinc-800">
                            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : emails.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-zinc-600 space-y-4">
                            <Mail size={48} className="opacity-20" />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Comunicação Sincronizada: Vazio</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-zinc-900">
                            {emails.map((email) => (
                                <button
                                    key={email.id}
                                    onClick={() => {
                                        setSelectedEmail(email);
                                        markAsRead(email.id);
                                    }}
                                    className={`w-full p-8 text-left transition-all hover:bg-zinc-900/50 flex gap-6 relative group ${email.is_read ? 'opacity-60' : ''}`}
                                >
                                    {!email.is_read && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold-500 flex items-center justify-center">
                                            <div className="w-1.5 h-1.5 bg-gold-500 rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex flex-col">
                                            <span className={`text-[11px] font-black uppercase tracking-wider ${email.is_read ? 'text-zinc-500' : 'text-white'}`}>
                                                {email.sender_name}
                                            </span>
                                            <span className="text-[9px] text-zinc-600 font-bold lowercase truncate max-w-[150px]">
                                                {email.sender_email}
                                            </span>
                                        </div>
                                        <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">
                                            {format(new Date(email.created_at), 'HH:mm', { locale: ptBR })}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className={`text-xs font-black uppercase tracking-widest mb-2 truncate ${email.is_read ? 'text-zinc-500' : 'text-white'}`}>
                                            {email.subject}
                                        </h4>
                                        <p className="text-[11px] text-zinc-600 line-clamp-2 leading-relaxed">
                                            {email.content}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-3 self-center">
                                        <button className="text-zinc-700 hover:text-gold-500 transition-colors">
                                            <Star size={16} />
                                        </button>
                                        <ChevronRight size={16} className="text-zinc-800 group-hover:text-gold-500 transition-all translate-x-4 group-hover:translate-x-0" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Email View Modal */}
            <Modal
                isOpen={!!selectedEmail}
                onClose={() => setSelectedEmail(null)}
                title="Detalhes da Correspondência"
            >
                {selectedEmail && (
                    <div className="space-y-10 animate-fade-in">
                        <div className="flex justify-between items-start pt-4">
                            <div className="space-y-4">
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">{selectedEmail.subject}</h3>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gold-500 flex items-center justify-center rounded-xl text-black font-black uppercase">
                                        {selectedEmail.sender_name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-white uppercase tracking-wider">{selectedEmail.sender_name}</p>
                                        <p className="text-[10px] text-zinc-500 font-bold lowercase">{selectedEmail.sender_email}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right space-y-2">
                                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Data Recebida</p>
                                <p className="text-xs font-mono text-white">{format(new Date(selectedEmail.created_at), "dd 'de' MMMM, yyyy", { locale: ptBR })}</p>
                            </div>
                        </div>

                        <div className="bg-zinc-900/50 p-10 rounded-[2.5rem] border border-zinc-900 border-l-4 border-l-gold-500 shadow-inner">
                            <p className="text-sm text-zinc-300 leading-[1.8] font-medium whitespace-pre-wrap">
                                {selectedEmail.content}
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <button className="flex-1 bg-zinc-900 text-zinc-400 py-6 rounded-3xl font-black uppercase text-[10px] tracking-widest border border-zinc-800 hover:bg-zinc-800 hover:text-white transition-all">Arquivar</button>
                            <button className="flex-1 bg-gold-500 text-black py-6 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-2xl active:scale-95 transition-all">Responder</button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Compose Modal */}
            <Modal
                isOpen={isComposeOpen}
                onClose={() => setIsComposeOpen(false)}
                title="Compor Correspondência Judicial"
            >
                <form onSubmit={handleSendEmail} className="space-y-8 pt-4">
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
                        <button type="button" onClick={() => setIsComposeOpen(false)} className="flex-1 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Descartar</button>
                        <button type="submit" className="flex-[2] bg-gold-500 text-black py-6 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3">
                            <Send size={16} /> Autenticar e Enviar
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
