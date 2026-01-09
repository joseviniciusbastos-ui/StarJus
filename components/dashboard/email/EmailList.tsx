import React, { useState } from 'react';
import { Search, Filter, RefreshCw, Mail, Star, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface Email {
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

interface EmailListProps {
    emails: Email[];
    loading: boolean;
    onRefresh: () => void;
    onSelect: (email: Email) => void;
}

export const EmailList: React.FC<EmailListProps> = ({ emails, loading, onRefresh, onSelect }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredEmails = emails.filter(email =>
        email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.sender_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex-1 flex flex-col bg-zinc-950">
            <div className="p-8 border-b border-zinc-900 flex items-center justify-between">
                <div className="relative flex-1 max-w-xl">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                    <input
                        type="text"
                        placeholder="Buscar correspondência jurídica..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-zinc-900/50 border border-zinc-900 rounded-2xl pl-14 pr-6 py-3.5 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-gold-500/50 transition-all font-bold"
                    />
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-3 bg-zinc-900 rounded-2xl text-zinc-500 hover:text-white transition-all border border-zinc-800">
                        <Filter size={18} />
                    </button>
                    <button onClick={onRefresh} className="p-3 bg-zinc-900 rounded-2xl text-zinc-500 hover:text-white transition-all border border-zinc-800">
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : filteredEmails.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-600 space-y-4">
                        <Mail size={48} className="opacity-20" />
                        <p className="text-[10px] font-black uppercase tracking-[0.3em]">Comunicação Sincronizada: Vazio</p>
                    </div>
                ) : (
                    <div className="divide-y divide-zinc-900">
                        {filteredEmails.map((email) => (
                            <button
                                key={email.id}
                                onClick={() => onSelect(email)}
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
                                    <button className="text-zinc-700 hover:text-gold-500 transition-colors" onClick={(e) => { e.stopPropagation(); /* Add star logic later */ }}>
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
    );
};
