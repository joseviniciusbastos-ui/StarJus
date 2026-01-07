import React, { useEffect, useState } from 'react';
import { Briefcase, Clock, TrendingUp, ArrowUpRight } from 'lucide-react';
import { StatMetric } from '../../types';
import { useAuth } from '../../lib/AuthContext';
import { supabase } from '../../lib/supabase';

export const StatsGrid: React.FC = () => {
  const { officeId } = useAuth();
  const [stats, setStats] = useState<StatMetric[]>([
    { label: "Processos Ativos", value: "...", trend: "Carregando", icon: Briefcase, isPositive: true },
    { label: "Prazos Críticos", value: "...", trend: "Sincronizando", icon: Clock, isPositive: false },
    { label: "Receita Financeira", value: "...", trend: "Calculando", icon: TrendingUp, isPositive: true },
  ]);

  useEffect(() => {
    if (!officeId) return;

    const fetchStats = async () => {
      try {
        // 1. Fetch Active Processes Count (Case-sensitive fix: 'active')
        const { count: processesCount } = await (supabase
          .from('processes')
          .select('*', { count: 'exact', head: true })
          .eq('office_id', officeId)
          .eq('status', 'active') as any);

        // 2. Fetch Financial Revenue
        const { data: financialData } = await (supabase
          .from('financial_records')
          .select('amount_brl')
          .eq('office_id', officeId)
          .eq('type', 'Income') as any);

        const totalRevenue = (financialData as any[])?.reduce((acc, curr) => acc + (curr.amount_brl || 0), 0) || 0;

        // 3. Fetch Critical Deadlines (Tasks due today or past due, not completed)
        const today = new Date().toISOString().split('T')[0];
        const { count: deadlinesCount } = await (supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .eq('office_id', officeId)
          .lte('due_date', today)
          .neq('status', 'Concluído') as any);

        setStats([
          {
            label: "Processos Ativos",
            value: (processesCount || 0).toString(),
            trend: "+0 esta semana",
            icon: Briefcase,
            isPositive: true
          },
          {
            label: "Prazos Críticos",
            value: (deadlinesCount || 0).toString().padStart(2, '0'),
            trend: deadlinesCount && deadlinesCount > 0 ? "Fatais Hoje" : "Monitorados",
            icon: Clock,
            isPositive: deadlinesCount === 0
          },
          {
            label: "Receita Financeira",
            value: new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              notation: 'compact',
              maximumFractionDigits: 1
            }).format(totalRevenue),
            trend: "+0% Growth",
            icon: TrendingUp,
            isPositive: true
          },
        ]);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, [officeId]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
      {stats.map((stat, idx) => (
        <div key={idx} className="premium-card rounded-[3rem] p-10 md:p-12 group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gold-500/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex items-start justify-between mb-8 relative z-10">
            <div>
              <p className="text-[10px] font-black text-slate-500 dark:text-zinc-600 uppercase tracking-[0.4em] mb-4 leading-none">{stat.label}</p>
              <h3 className="text-4xl md:text-5xl font-black text-slate-950 dark:text-white tracking-tighter group-hover:gold-gradient-text transition-all duration-300">
                {stat.value}
              </h3>
            </div>
            <div className={`p-4 md:p-5 rounded-2xl border transition-all duration-500 ${stat.label.includes('Prazos')
              ? 'bg-red-500 text-white border-red-600 shadow-xl shadow-red-500/20'
              : 'bg-slate-50 dark:bg-zinc-950 text-gold-600 border-slate-200 dark:border-zinc-800 group-hover:bg-gold-500 group-hover:text-black group-hover:border-gold-500'
              }`}>
              <stat.icon size={26} />
            </div>
          </div>
          <div className="flex items-center justify-between pt-8 border-t border-slate-100 dark:border-zinc-900 relative z-10">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${stat.isPositive ? 'bg-gold-500 shadow-[0_0_10px_rgba(212,175,55,0.6)]' : 'bg-red-600 animate-pulse'}`} />
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-600 dark:text-zinc-500">{stat.trend}</span>
            </div>
            <ArrowUpRight size={18} className="text-slate-300 dark:text-zinc-800 group-hover:text-gold-500 transition-all" />
          </div>
        </div>
      ))}
    </div>
  );
};
