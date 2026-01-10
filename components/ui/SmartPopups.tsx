import React, { useState, useEffect } from 'react';
import { X, Sparkles, Bell, Info, ShieldAlert } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Notice {
    id: string;
    title: string;
    content: string;
    type: 'Aviso' | 'Importante' | 'Urgente';
    created_at: string;
}

export const SmartPopups: React.FC = () => {
    const [notices, setNotices] = useState<Notice[]>([]);

    useEffect(() => {
        // Initial fetch of latest notices
        fetchNotices();

        // Setup Realtime subscription for new notices
        const channel = supabase
            .channel('notices-changes')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'notices' },
                (payload) => {
                    const newNotice = payload.new as Notice;
                    setNotices((prev) => [newNotice, ...prev]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchNotices = async () => {
        // We only show notices from the last 2 hours to avoid spamming on login
        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();

        const { data, error } = await supabase
            .from('notices')
            .select('*')
            .gt('created_at', twoHoursAgo)
            .order('created_at', { ascending: false })
            .limit(1);

        if (data) {
            setNotices(data as Notice[]);
        }
    };

    const closeNotice = (id: string) => {
        setNotices((prev) => prev.filter((n) => n.id !== id));
    };

    if (notices.length === 0) return null;

    return (
        <div className="fixed bottom-8 right-8 z-[100] w-full max-w-sm animate-in slide-in-from-right-10 duration-500">
            {notices.map((notice) => (
                <div
                    key={notice.id}
                    className="bg-black/90 dark:bg-white/95 backdrop-blur-2xl p-6 rounded-[2rem] border border-white/10 dark:border-black/10 shadow-3xl relative overflow-hidden group shadow-gold-glow/20"
                >
                    {/* Decorative glow based on type */}
                    <div className={`absolute -top-12 -right-12 w-24 h-24 rounded-full blur-3xl transition-all duration-700 ${notice.type === 'Urgente' ? 'bg-red-500/20 group-hover:bg-red-500/30' : 'bg-gold-500/10 group-hover:bg-gold-500/20'
                        }`} />

                    <button
                        onClick={() => closeNotice(notice.id)}
                        className="absolute top-4 right-4 text-zinc-500 hover:text-white dark:hover:text-black transition-colors"
                    >
                        <X size={18} />
                    </button>

                    <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${notice.type === 'Urgente' ? 'bg-red-500/10' : 'bg-gold-500/10'
                            }`}>
                            {notice.type === 'Urgente' ? (
                                <ShieldAlert className="text-red-500" size={24} />
                            ) : (
                                <Sparkles className="text-gold-500" size={24} />
                            )}
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-black text-white dark:text-black uppercase tracking-tight">
                                    {notice.title}
                                </h3>
                                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${notice.type === 'Urgente' ? 'bg-red-500 text-white' : 'bg-gold-500 text-black'
                                    }`}>
                                    {notice.type}
                                </span>
                            </div>
                            <p className="text-[11px] font-bold text-zinc-400 dark:text-zinc-600 leading-relaxed italic line-clamp-3">
                                {notice.content}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={() => closeNotice(notice.id)}
                            className="text-[10px] font-black uppercase tracking-widest text-gold-500 hover:text-gold-400 transition-colors"
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};
