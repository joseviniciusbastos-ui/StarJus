import React, { useState, useEffect } from 'react';
import {
  TrendingUp, Users, Building2, Scale,
  Download, Filter, ChevronUp, ArrowUpRight, Target, ShieldCheck, Sparkles, FileBarChart, Calendar, ChevronDown
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';

export const ReportsPage: React.FC = () => {
  const { officeId } = useAuth();
  const [activeTab, setActiveTab] = useState<'financial' | 'condos' | 'legal' | 'team'>('financial');
  const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false);
  const [financialData, setFinancialData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, [officeId]);

  const fetchMetrics = async () => {
    setLoading(true);
    const { data } = await supabase.from('financial_records').select('*');
    if (data) setFinancialData(data);
    setLoading(false);
  };

  const revenueByMonth = financialData.reduce((acc: any, curr) => {
    const month = new Date(curr.date).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + (curr.type === 'Inflow' ? curr.amount : 0);
    return acc;
  }, {});

  const maxRevenue = Math.max(...Object.values(revenueByMonth) as number[], 1000);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter text-slate-950 dark:text-white uppercase italic font-serif gold-gradient-text leading-none">Intelligence Hub.</h1>
          <p className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-[0.4em]">Business Intelligence & BI Preditivo Alpha</p>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <button
            onClick={() => setIsPeriodModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-4.5 border border-slate-200 dark:border-zinc-800 bg-white dark:bg-black rounded-3xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-zinc-400 hover:border-gold-500 transition-all shadow-sm"
          >
            <Filter size={16} /> Período Alpha <ChevronDown size={14} className="opacity-40" />
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-10 py-4.5 bg-black dark:bg-white text-white dark:text-black rounded-3xl text-[10px] font-black uppercase tracking-widest shadow-2xl transition-all">
            <Download size={16} /> Exportar
          </button>
        </div>
      </div>

      <div className="flex bg-slate-100 dark:bg-zinc-950 p-2 rounded-[2.5rem] border border-slate-200 dark:border-zinc-900 shadow-inner max-w-3xl overflow-x-auto custom-scrollbar">
        {[
          { id: 'financial', label: 'Yield Financeiro', icon: TrendingUp },
          { id: 'condos', label: 'Ativos Reais', icon: Building2 },
          { id: 'legal', label: 'Eficiência Jurídica', icon: Scale },
          { id: 'team', label: 'Performance Team', icon: Users }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 min-w-[120px] flex items-center justify-center gap-3 py-4 text-[10px] font-black uppercase tracking-[0.1em] rounded-2xl transition-all ${activeTab === tab.id ? 'bg-white dark:bg-zinc-800 text-gold-600 dark:text-gold-500 shadow-xl border border-slate-200 dark:border-zinc-700' : 'text-slate-500 dark:text-zinc-600 hover:text-slate-950 dark:hover:text-zinc-300'}`}
          >
            <tab.icon size={14} /> {tab.label.split(' ')[0]}
          </button>
        ))}
      </div>

      {activeTab === 'financial' && (
        <div className="space-y-10 animate-in slide-in-from-bottom-6 duration-700">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 premium-card rounded-[3rem] md:rounded-[4rem] p-10 md:p-14 space-y-12 bg-white dark:bg-black">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <h3 className="text-2xl font-black text-slate-950 dark:text-white tracking-tighter italic font-serif leading-none">Fluxo de Honorários Alpha</h3>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-gold-600 rounded-full shadow-[0_0_10px_rgba(212,175,55,0.4)]" />
                    <span className="text-[10px] font-black text-slate-500 dark:text-zinc-600 uppercase tracking-widest">Inflow</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-slate-100 dark:bg-zinc-800 rounded-full border border-slate-200 dark:border-zinc-700" />
                    <span className="text-[10px] font-black text-slate-500 dark:text-zinc-600 uppercase tracking-widest">Outflow</span>
                  </div>
                </div>
              </div>

              <div className="h-80 flex items-end justify-between gap-4 md:gap-8 pt-10 px-4">
                {Object.entries(revenueByMonth).map(([month, rev]: any, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-4 group h-full">
                    <div className="w-full flex justify-center items-end gap-1.5 md:gap-3 h-full">
                      <div
                        className="w-full max-w-[35px] bg-gold-600 rounded-t-2xl transition-all group-hover:bg-gold-500 relative shadow-lg shadow-gold-500/10"
                        style={{ height: `${(rev / maxRevenue) * 100}%` }}
                      >
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-[9px] font-black px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-2xl whitespace-nowrap">
                          R${rev / 1000}k
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 dark:text-zinc-700 uppercase tracking-widest group-hover:text-gold-600 transition-colors font-mono">{month}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-10">
              <div className="bg-black dark:bg-zinc-950 rounded-[3rem] md:rounded-[4rem] p-12 text-white shadow-3xl relative overflow-hidden group border border-gold-500/10">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gold-600/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                <Sparkles className="text-gold-500 mb-8 animate-pulse" size={32} />
                <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-gold-600 mb-4">Previsão de Margem Alpha</h4>
                <p className="text-4xl md:text-5xl font-black tracking-tighter mb-8 gold-gradient-text leading-none font-mono">
                  {(Object.values(revenueByMonth).reduce((a: any, b: any) => a + b, 0) * 1.12).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
                <p className="text-xs text-zinc-500 font-bold leading-relaxed">Algoritmo Starjus baseado em performance histórica e ativos correntes sob governança v2.0.</p>
              </div>
              <div className="premium-card rounded-[3rem] md:rounded-[4rem] p-12 flex flex-col items-center text-center space-y-8 bg-white dark:bg-black">
                <div className="p-6 bg-gold-600/5 text-gold-600 rounded-[2.5rem] border border-gold-600/10 shadow-sm"><Target size={40} /></div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-[0.5em] mb-3 leading-none">Yield Operacional</h4>
                  <p className="text-6xl font-black text-slate-950 dark:text-white tracking-tighter">72%</p>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-widest bg-emerald-500/5 px-5 py-2 rounded-full border border-emerald-500/10">
                  <ChevronUp size={14} /> +4.2% Growth
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab !== 'financial' && (
        <div className="premium-card p-24 rounded-[4rem] flex flex-col items-center justify-center text-center space-y-8 bg-white dark:bg-black">
          <FileBarChart size={64} className="text-gold-500 opacity-40" />
          <div className="space-y-3">
            <h3 className="text-3xl font-black text-slate-950 dark:text-white uppercase tracking-tighter italic font-serif">Módulo em Processamento.</h3>
            <p className="text-sm text-slate-500 dark:text-zinc-500 font-bold italic">Relatórios avançados de {activeTab} estão sendo sincronizados com a base Alpha v2.0.</p>
          </div>
        </div>
      )}

      <Modal isOpen={isPeriodModalOpen} onClose={() => setIsPeriodModalOpen(false)} title="Configurar Período Alpha">
        <div className="space-y-10">
          <p className="text-sm font-bold text-slate-500 dark:text-zinc-400 leading-relaxed italic border-l-4 border-gold-500 pl-6">Defina a janela temporal para análise profunda de métricas e performance institucional do ecossistema.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest ml-1">Data de Início</label>
              <div className="relative">
                <Calendar className="absolute left-6 top-5 text-gold-600" size={20} />
                <input type="date" className="w-full pl-16 pr-8 py-5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl text-slate-950 dark:text-white font-black outline-none focus:border-gold-500 shadow-inner" />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest ml-1">Data Final</label>
              <div className="relative">
                <Calendar className="absolute left-6 top-5 text-gold-600" size={20} />
                <input type="date" className="w-full pl-16 pr-8 py-5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl text-slate-950 dark:text-white font-black outline-none focus:border-gold-500 shadow-inner" />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 dark:text-zinc-700 uppercase tracking-widest ml-1">Atalhos Estratégicos</h4>
            <div className="flex flex-wrap gap-4">
              {['Últimos 30 Dias', 'Trimestre Alpha', 'Semestre Corrente', 'Anual'].map(p => (
                <button key={p} className="px-6 py-4 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl text-[10px] font-black text-slate-600 dark:text-zinc-400 uppercase tracking-widest hover:border-gold-500 hover:text-gold-600 transition-all shadow-sm">{p}</button>
              ))}
            </div>
          </div>
          <button
            onClick={() => setIsPeriodModalOpen(false)}
            className="w-full py-7 bg-black dark:bg-white text-white dark:text-black rounded-3xl font-black uppercase tracking-[0.2em] text-[11px] mt-6 shadow-3xl active:scale-95 transition-all"
          >
            Sincronizar Timeline Alpha
          </button>
        </div>
      </Modal>
    </div>
  );
};
