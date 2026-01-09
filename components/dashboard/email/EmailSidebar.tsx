import React from 'react';
import { Mail, Inbox, Star, Send, Archive, Trash2 } from 'lucide-react';

interface EmailSidebarProps {
    officeName: string | null;
    unreadCount?: number;
    onCompose: () => void;
    activeFolder?: string;
    setActiveFolder?: (folder: string) => void;
}

export const EmailSidebar: React.FC<EmailSidebarProps> = ({
    officeName,
    unreadCount = 0,
    onCompose,
    activeFolder = 'inbox',
    setActiveFolder
}) => {
    return (
        <div className="w-80 bg-zinc-900/50 border-r border-zinc-900 flex flex-col">
            <div className="p-8 space-y-8">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 bg-gold-500/10 rounded-2xl flex items-center justify-center border border-gold-500/20">
                        <Mail className="text-gold-500" size={20} />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-white uppercase tracking-widest">{officeName || 'Carregando...'}</h2>
                        <p className="text-[10px] text-gold-500/60 font-black lowercase tracking-tighter">
                            {officeName ? `${officeName.toLowerCase().replace(/\s+/g, '')}@starjus.com.br` : 'office@starjus.com.br'}
                        </p>
                    </div>
                </div>

                <button
                    onClick={onCompose}
                    className="w-full bg-gradient-to-r from-gold-600 to-gold-400 text-[var(--on-accent)] py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all active:scale-95"
                >
                    Compor Nova Estratégia
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-1">
                {[
                    { id: 'inbox', icon: Inbox, label: 'Principais', count: unreadCount },
                    { id: 'starred', icon: Star, label: 'Prioritários', count: 0 },
                    { id: 'sent', icon: Send, label: 'Enviados', count: 0 },
                    { id: 'archive', icon: Archive, label: 'Arquivados', count: 0 },
                    { id: 'trash', icon: Trash2, label: 'Lixeira', count: 0 },
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveFolder && setActiveFolder(item.id)}
                        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group ${activeFolder === item.id ? 'bg-gold-500/10 text-gold-500 border border-gold-500/20' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'}`}
                    >
                        <div className="flex items-center gap-3">
                            <item.icon size={16} />
                            <span className="text-[11px] font-black uppercase tracking-wider">{item.label}</span>
                        </div>
                        {item.count > 0 && (
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${activeFolder === item.id ? 'bg-gold-500 text-black' : 'bg-zinc-800 text-zinc-500'}`}>
                                {item.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};
