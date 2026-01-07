import React, { useState, useEffect } from 'react';
import { Shield, Search, Filter, Clock, User, ArrowRight, History } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AuditLog {
    id: string;
    action: string;
    entity_type: string;
    entity_id: string;
    old_data: any;
    new_data: any;
    created_at: string;
    user_id: string;
    user_email?: string;
}

export const AuditLogsPage: React.FC = () => {
    const { officeId, userRole } = useAuth();
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (officeId) fetchLogs();
    }, [officeId]);

    const fetchLogs = async () => {
        setLoading(true);
        const { data, error } = await (supabase
            .from('audit_logs')
            .select(`
                *,
                profiles:user_id ( full_name, email )
            `)
            .eq('office_id', officeId)
            .order('created_at', { ascending: false })
            .limit(100) as any);

        if (data) {
            setLogs(data.map((l: any) => ({
                ...l,
                user_email: l.profiles?.email || 'N/A',
                user_name: l.profiles?.full_name || 'Usuário Desconhecido'
            })));
        }
        setLoading(false);
    };

    if (userRole === 'staff') {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
                <Shield size={64} className="text-red-500 opacity-20" />
                <h1 className="text-3xl font-black text-slate-950 dark:text-white uppercase">Acesso Restrito</h1>
                <p className="text-slate-500 max-w-md font-bold italic">Esta área é exclusiva para gestores e proprietários do escritório.</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-slate-950 dark:text-white tracking-tight uppercase">Governança & <span className="gold-gradient-text">Auditoria</span></h1>
                    <p className="text-slate-500 dark:text-zinc-500 font-bold italic">Histórico completo de integridade e modificações sistêmicas.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900 rounded-2xl px-6 py-3 flex items-center gap-3 shadow-xl">
                        <Search size={18} className="text-slate-400" />
                        <input
                            type="text"
                            placeholder="Pesquisar logs..."
                            className="bg-transparent border-none outline-none text-sm font-bold text-slate-950 dark:text-white w-64"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-950 rounded-[3rem] border border-slate-200 dark:border-zinc-900 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-zinc-900/50 border-b border-slate-200 dark:border-zinc-900">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Timestamp</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Usuário</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Ação</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Entidade</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Modificações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-zinc-900">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-black animate-pulse">Carregando rastro digital...</td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-black">Nenhum rastro encontrado.</td>
                                </tr>
                            ) : logs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-zinc-900/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <Clock size={16} className="text-gold-500 opacity-40" />
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-slate-900 dark:text-white">
                                                    {format(new Date(log.created_at), 'dd MMM, HH:mm', { locale: ptBR })}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                                    {format(new Date(log.created_at), 'yyyy')}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-black text-slate-900 dark:text-zinc-300">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-400">
                                                <User size={14} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span>{(log as any).user_name}</span>
                                                <span className="text-[10px] font-bold text-slate-400 lowercase">{log.user_email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${log.action.includes('INSERT') ? 'bg-emerald-500/10 text-emerald-500' :
                                                log.action.includes('UPDATE') ? 'bg-gold-500/10 text-gold-500' :
                                                    'bg-red-500/10 text-red-500'
                                            }`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-black text-slate-600 dark:text-zinc-500">
                                        {log.entity_type} <span className="text-[10px] opacity-40 ml-1">#{log.entity_id}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            {log.old_data && (
                                                <div className="bg-red-500/5 p-2 rounded-lg border border-red-500/10 max-w-[150px] truncate text-[10px] text-red-400 line-through">
                                                    {JSON.stringify(log.old_data)}
                                                </div>
                                            )}
                                            {log.old_data && <ArrowRight size={14} className="text-slate-300" />}
                                            {log.new_data && (
                                                <div className="bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/10 max-w-[150px] truncate text-[10px] text-emerald-500">
                                                    {JSON.stringify(log.new_data)}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
