import React, { useState, useEffect } from 'react';
import { Shield, Search, Calendar, User, Activity, Clock, ChevronRight, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';

interface AuditLog {
    id: string;
    created_at: string;
    action: string;
    entity_type: string;
    entity_id: string;
    user_id: string;
    new_data: any;
    old_data: any;
}

export const AuditLogsPage: React.FC = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { officeId } = useAuth();

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('audit_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);

        if (data) setLogs(data);
        setLoading(false);
    };

    const filteredLogs = logs.filter(log =>
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.entity_type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black tracking-tighter text-slate-950 dark:text-white uppercase leading-none italic font-serif gold-gradient-text">Audit Logs.</h1>
                    <p className="text-slate-500 dark:text-zinc-500 font-black uppercase text-[10px] tracking-[0.4em]">Monitoramento de Integridade Alpha</p>
                </div>
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3">
                    <Shield className="text-emerald-500" size={20} />
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Sistema Inviolável</span>
                </div>
            </div>

            <div className="premium-card p-6 rounded-[2.5rem]">
                <div className="relative">
                    <Search className="absolute left-6 top-4.5 h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-16 pr-6 py-4.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900 rounded-3xl outline-none text-slate-950 dark:text-white font-black text-sm shadow-inner"
                        placeholder="Filtrar por ação ou entidade..."
                    />
                </div>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-20">
                        <Activity className="animate-spin text-gold-500 mx-auto mb-4" size={48} />
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Sincronizando Registros Alpha...</p>
                    </div>
                ) : filteredLogs.length === 0 ? (
                    <div className="premium-card p-20 text-center rounded-[3rem]">
                        <p className="text-slate-500 dark:text-zinc-500 font-black uppercase text-sm tracking-widest">Nenhum registro encontrado</p>
                    </div>
                ) : (
                    filteredLogs.map((log) => (
                        <div key={log.id} className="premium-card p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8 group hover:border-gold-500/50 transition-all">
                            <div className={`p-5 rounded-2xl bg-zinc-900 border border-zinc-800 ${log.action === 'DELETE' ? 'text-red-500' : 'text-gold-500'}`}>
                                <Activity size={24} />
                            </div>

                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 text-[8px] font-black rounded-full uppercase tracking-widest ${log.action === 'INSERT' ? 'bg-emerald-500/10 text-emerald-500' : log.action === 'UPDATE' ? 'bg-blue-500/10 text-blue-500' : 'bg-red-500/10 text-red-500'}`}>
                                        {log.action}
                                    </span>
                                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{log.entity_type} #{log.entity_id}</span>
                                </div>
                                <h3 className="text-lg font-black text-white uppercase tracking-tight">Alteração no ecossistema detectada</h3>
                            </div>

                            <div className="flex items-center gap-10 w-full md:w-auto">
                                <div className="flex items-center gap-3 text-zinc-500">
                                    <Clock size={16} />
                                    <span className="text-[10px] font-bold uppercase tracking-tight">{new Date(log.created_at).toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-3 text-zinc-500 border-l border-zinc-800 pl-10">
                                    <User size={16} />
                                    <span className="text-[10px] font-bold uppercase tracking-tight truncate max-w-[100px]">{log.user_id}</span>
                                </div>
                                <button className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                                    <Eye size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
