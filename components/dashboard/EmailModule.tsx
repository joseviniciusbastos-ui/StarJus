
import React, { useState, useEffect } from 'react';
import { Mail, Send, Trash2, Star, Circle, Search, Filter, RefreshCw, ChevronRight, Inbox, Archive, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Email {
    id: string;
    sender_name: string;
    sender_email: string;
    subject: string;
    content: string;
    is_read: boolean;
    created_at: string;
}

export const EmailModule: React.FC = () => {
    const [emails, setEmails] = useState<Email[]>([]);
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isComposing, setIsComposing] = useState(false);
    const [composeData, setComposeData] = useState({
        recipient: '',
        subject: '',
        content: ''
    });

    useEffect(() => {
        fetchEmails();

        const channel = supabase
            .channel('office_emails_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'office_emails' }, () => {
                fetchEmails();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchEmails = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('office_emails')
                .select('*')
                .order('created_at', { ascending: false });

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
            const { error } = await supabase
                .from('office_emails')
                .update({ is_read: true })
                .eq('id', emailId);

            if (error) throw error;

            setEmails(emails.map(e => e.id === emailId ? { ...e, is_read: true } : e));
            if (selectedEmail?.id === emailId) {
                setSelectedEmail({ ...selectedEmail, is_read: true });
            }
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const handleComposeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Get user's office_id
            const { data: memberData } = await supabase
                .from('office_members')
                .select('office_id')
                .eq('user_id', user.id)
                .single();

            if (!memberData) return;

            const { error } = await supabase
                .from('office_emails')
                .insert({
                    office_id: memberData.office_id,
                    sender_name: user.user_metadata.full_name || user.email,
                    sender_email: user.email,
                    subject: composeData.subject,
                    content: composeData.content
                });

            if (error) throw error;

            setIsComposing(false);
            setComposeData({ recipient: '', subject: '', content: '' });
            fetchEmails();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const filteredEmails = emails.filter(email =>
        email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.sender_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.sender_email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-full bg-black/40 backdrop-blur-xl rounded-[2.5rem] border border-zinc-800/50 overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-64 border-r border-zinc-800/50 p-6 flex flex-col gap-8">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 bg-gold-500/10 rounded-2xl flex items-center justify-center border border-gold-500/20">
                        <Mail className="text-gold-500" size={20} />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-white uppercase tracking-widest">E-mail</h2>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">Corporativo</p>
                    </div>
                </div>

                <button
                    onClick={() => setIsComposing(true)}
                    className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-gold-500 transition-all active:scale-[0.98]"
                >
                    <Send size={14} /> Novo E-mail
                </button>

                <nav className="flex flex-col gap-2">
                    <button className="flex items-center gap-3 px-4 py-3 bg-white/5 text-white rounded-xl text-xs font-bold transition-all border border-white/10">
                        <Inbox size={16} className="text-gold-500" /> Inbox
                        <span className="ml-auto bg-gold-500 text-black px-2 py-0.5 rounded-full text-[9px] font-black">
                            {emails.filter(e => !e.is_read).length}
                        </span>
                    </button>
                    <button className="flex items-center gap-3 px-4 py-3 text-zinc-500 hover:bg-white/5 hover:text-white rounded-xl text-xs font-bold transition-all">
                        <Star size={16} /> Favoritos
                    </button>
                    <button className="flex items-center gap-3 px-4 py-3 text-zinc-500 hover:bg-white/5 hover:text-white rounded-xl text-xs font-bold transition-all">
                        <Send size={16} /> Enviados
                    </button>
                    <button className="flex items-center gap-3 px-4 py-3 text-zinc-500 hover:bg-white/5 hover:text-white rounded-xl text-xs font-bold transition-all">
                        <Archive size={16} /> Arquivados
                    </button>
                    <button className="flex items-center gap-3 px-4 py-3 text-zinc-500 hover:bg-white/5 hover:text-white rounded-xl text-xs font-bold transition-all">
                        <Trash2 size={16} /> Lixeira
                    </button>
                </nav>

                <div className="mt-auto p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertCircle size={14} className="text-gold-500" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Armazenamento</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full w-1/3 bg-gold-500" />
                    </div>
                    <p className="text-[9px] text-zinc-500 mt-2 font-bold">4.2 GB de 15 GB usados</p>
                </div>
            </div>

            {/* Email List */}
            <div className="w-96 border-r border-zinc-800/50 flex flex-col">
                <div className="p-6 border-b border-zinc-800/50 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                        <input
                            type="text"
                            placeholder="Pesquisar mensagens..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-black/40 border border-zinc-800/50 rounded-xl outline-none focus:border-gold-500/50 text-xs text-white placeholder:text-zinc-600 font-medium transition-all"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <button className="p-2 text-zinc-500 hover:text-white transition-all"><Filter size={16} /></button>
                            <button onClick={fetchEmails} className="p-2 text-zinc-500 hover:text-white transition-all"><RefreshCw size={16} /></button>
                        </div>
                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Recentes</p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {filteredEmails.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center p-8 opacity-20">
                            <Mail size={48} className="mb-4" />
                            <p className="text-xs font-bold uppercase tracking-widest">Nenhuma mensagem</p>
                        </div>
                    ) : (
                        filteredEmails.map(email => (
                            <button
                                key={email.id}
                                onClick={() => {
                                    setSelectedEmail(email);
                                    if (!email.is_read) markAsRead(email.id);
                                }}
                                className={`w-full p-6 text-left border-b border-zinc-800/30 transition-all hover:bg-white/5 relative group ${selectedEmail?.id === email.id ? 'bg-white/5' : ''}`}
                            >
                                {!email.is_read && (
                                    <div className="absolute left-2 top-1/2 -translate-y-1/2">
                                        <div className="w-1.5 h-1.5 bg-gold-500 rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
                                    </div>
                                )}
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-[11px] font-black uppercase tracking-wider ${email.is_read ? 'text-zinc-500' : 'text-white'}`}>
                                        {email.sender_name}
                                    </span>
                                    <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">
                                        {format(new Date(email.created_at), 'HH:mm', { locale: ptBR })}
                                    </span>
                                </div>
                                <h4 className={`text-xs mb-1 truncate ${email.is_read ? 'text-zinc-500 font-medium' : 'text-zinc-300 font-black'}`}>
                                    {email.subject}
                                </h4>
                                <p className="text-[10px] text-zinc-600 line-clamp-2 leading-relaxed">
                                    {email.content}
                                </p>
                                <div className="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                    <div className="px-2 py-0.5 bg-zinc-800 rounded-md text-[8px] font-black text-zinc-500 uppercase tracking-widest">Importante</div>
                                    <div className="px-2 py-0.5 bg-zinc-800 rounded-md text-[8px] font-black text-zinc-500 uppercase tracking-widest">Jurídico</div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Email View */}
            <div className="flex-1 flex flex-col">
                {selectedEmail ? (
                    <>
                        <div className="p-8 border-b border-zinc-800/50 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-zinc-800 to-black rounded-2xl flex items-center justify-center border border-zinc-700">
                                    <span className="text-zinc-500 font-black text-lg">{selectedEmail.sender_name[0].toUpperCase()}</span>
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-white italic font-serif tracking-tight">{selectedEmail.sender_name}</h3>
                                    <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase">{`<${selectedEmail.sender_email}>`}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="p-3 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded-xl hover:text-white transition-all"><Star size={18} /></button>
                                <button className="p-3 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded-xl hover:text-white transition-all"><Trash2 size={18} /></button>
                                <button className="px-6 py-3 bg-gold-500 text-black rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-gold-400 transition-all active:scale-[0.95]">Responder</button>
                            </div>
                        </div>

                        <div className="flex-1 p-12 overflow-y-auto">
                            <div className="max-w-3xl">
                                <h2 className="text-2xl font-black text-white mb-8 tracking-tighter leading-tight">{selectedEmail.subject}</h2>
                                <div className="prose prose-invert prose-sm">
                                    <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap">
                                        {selectedEmail.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                ) : isComposing ? (
                    <form onSubmit={handleComposeSubmit} className="flex-1 flex flex-col">
                        <div className="p-8 border-b border-zinc-800/50 flex items-center justify-between">
                            <h3 className="text-sm font-black text-white uppercase tracking-widest">Nova Mensagem</h3>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsComposing(false)}
                                    className="px-6 py-3 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded-xl font-black uppercase tracking-widest text-[10px] hover:text-white transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-gold-500 text-black rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-gold-400 transition-all active:scale-[0.95]"
                                >
                                    Enviar Mensagem
                                </button>
                            </div>
                        </div>

                        <div className="p-8 space-y-6 flex-1 bg-zinc-900/30">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] ml-1">Destinatário</label>
                                <input
                                    type="text"
                                    placeholder="Nome ou E-mail do escritório..."
                                    value={composeData.recipient}
                                    onChange={(e) => setComposeData({ ...composeData, recipient: e.target.value })}
                                    className="w-full px-6 py-4 bg-black border border-zinc-800 rounded-2xl outline-none focus:border-gold-500 text-xs text-white font-bold transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] ml-1">Assunto</label>
                                <input
                                    type="text"
                                    placeholder="Assunto da mensagem..."
                                    value={composeData.subject}
                                    onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                                    className="w-full px-6 py-4 bg-black border border-zinc-800 rounded-2xl outline-none focus:border-gold-500 text-xs text-white font-bold transition-all"
                                />
                            </div>
                            <div className="space-y-2 flex-1 flex flex-col">
                                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] ml-1">Mensagem</label>
                                <textarea
                                    placeholder="Escreva sua mensagem aqui..."
                                    value={composeData.content}
                                    onChange={(e) => setComposeData({ ...composeData, content: e.target.value })}
                                    className="flex-1 w-full px-6 py-6 bg-black border border-zinc-800 rounded-3xl outline-none focus:border-gold-500 text-xs text-zinc-300 font-medium leading-relaxed resize-none transition-all"
                                />
                            </div>
                        </div>
                    </form>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-30 text-center p-12">
                        <div className="w-24 h-24 bg-zinc-900 rounded-[2rem] border border-zinc-800 flex items-center justify-center mb-6">
                            <Mail size={40} className="text-gold-500" />
                        </div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2 italic font-serif">Selecione uma mensagem</h3>
                        <p className="text-xs text-zinc-500 max-w-xs leading-relaxed font-bold uppercase tracking-widest">Escolha uma conversa da lista ao lado para visualizar os detalhes.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
