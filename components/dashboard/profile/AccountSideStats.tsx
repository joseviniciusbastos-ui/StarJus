import React from 'react';
import { Shield, Zap, Clock } from 'lucide-react';

interface OfficeMember {
    user_id: string;
    role: string;
    joined_at: string;
    profiles: {
        full_name: string;
        avatar_url: string;
    };
}

interface AccountSideStatsProps {
    members: OfficeMember[];
}

export const AccountSideStats: React.FC<AccountSideStatsProps> = ({ members }) => {
    return (
        <div className="space-y-10">
            <div className="bg-slate-950 dark:bg-zinc-900 rounded-[4rem] p-10 space-y-10 shadow-3xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 space-y-2">
                    <h3 className="text-2xl font-black text-white italic tracking-tighter gold-gradient-text">Account Indices.</h3>
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest italic">Performance & Security Alpha</p>
                </div>

                <div className="relative z-10 space-y-8">
                    <div className="flex justify-between items-center group/item hover:translate-x-4 transition-all duration-500">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-zinc-500 uppercase">Segurança</p>
                            <p className="text-lg font-black text-white">Advanced</p>
                        </div>
                        <Shield className="text-gold-500" />
                    </div>
                    <div className="flex justify-between items-center group/item hover:translate-x-4 transition-all duration-500">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-zinc-500 uppercase">Produtividade</p>
                            <p className="text-lg font-black text-white">Top 2%</p>
                        </div>
                        <Zap className="text-gold-500 fill-gold-500" />
                    </div>
                    <div className="flex justify-between items-center group/item hover:translate-x-4 transition-all duration-500">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-zinc-500 uppercase">Horas Ativas</p>
                            <p className="text-lg font-black text-white">1,242h</p>
                        </div>
                        <Clock className="text-gold-500" />
                    </div>
                </div>

                <div className="relative z-10 pt-10 border-t border-zinc-800/50">
                    <button className="w-full py-5 bg-gold-600 rounded-3xl text-[10px] font-black uppercase text-black tracking-[0.2em] shadow-2xl hover:bg-white transition-all">Ver Relatório de Acesso</button>
                </div>
            </div>

            <div className="premium-card p-10 rounded-[3rem] space-y-10">
                <div className="space-y-2">
                    <h3 className="text-xl font-black text-slate-950 dark:text-white uppercase italic tracking-tighter">Quadro Social Alpha.</h3>
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest italic">Membros do Escritório</p>
                </div>
                <div className="space-y-6">
                    {members.map(m => (
                        <div key={m.user_id} className="flex items-center gap-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 overflow-hidden">
                                <img src={m.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.profiles?.full_name || 'M')}&background=000&color=fff`} alt={m.profiles?.full_name} />
                            </div>
                            <div className="flex-1">
                                <p className="text-[11px] font-black text-slate-950 dark:text-white uppercase">{m.profiles?.full_name}</p>
                                <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">{m.role === 'owner' ? 'Sócio Fundador' : 'Advogado'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
