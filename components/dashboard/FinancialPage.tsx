import React, { useState, useEffect } from 'react';
import { CircleDollarSign, TrendingUp, TrendingDown, Download, Plus, ArrowUpRight, ArrowDownRight, Edit2, Trash2, Calendar, FileText } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { Modal } from '../ui/Modal';
import { FinancialRecord } from '../../types';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import { currencyClient, type Currency } from '../../lib/apis/currency';
import { logAudit } from '../../lib/utils/audit';

export const FinancialPage: React.FC = () => {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FinancialRecord | null>(null);
  const { officeId } = useAuth();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'Income' as 'Income' | 'Expense',
    date: new Date().toISOString().split('T')[0],
    category: 'Honorários',
    currency: 'BRL' as Currency
  });

  useEffect(() => {
    if (officeId) fetchRecords();
  }, [officeId]);

  const fetchRecords = async () => {
    setLoading(true);
    const { data, error } = await (supabase
      .from('financial_records')
      .select('*')
      .eq('office_id', officeId)
      .order('date', { ascending: false }) as any);

    if (data) {
      const mappedData: FinancialRecord[] = (data as any[]).map(r => ({
        id: r.id,
        description: r.description,
        type: r.type as 'Income' | 'Expense',
        amount: r.amount_text || currencyClient.formatCurrency(r.amount_numeric, r.currency || 'BRL'),
        amount_numeric: r.amount_numeric,
        currency: r.currency || 'BRL',
        amount_brl: r.amount_brl || r.amount_numeric,
        exchange_rate: r.exchange_rate || 1,
        date: r.date,
        category: r.category || 'Geral',
        status: r.status as 'Paid' | 'Pending'
      }));
      setRecords(mappedData);
    } else if (error) {
      toast.error('Erro ao carregar registros financeiros');
    }
    setLoading(false);
  };

  const totalInflow = records
    .filter(r => r.type === 'Income')
    .reduce((acc, r) => acc + (r.amount_brl || r.amount_numeric || 0), 0);

  const totalOutflow = records
    .filter(r => r.type === 'Expense')
    .reduce((acc, r) => acc + (r.amount_brl || r.amount_numeric || 0), 0);

  const yieldAcumulado = totalInflow - totalOutflow;

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `R$ ${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `R$ ${(val / 1000).toFixed(1)}k`;
    return `R$ ${val.toFixed(2)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const amountNumeric = parseFloat(formData.amount.replace(/\./g, '').replace(',', '.'));

      if (isNaN(amountNumeric) || amountNumeric <= 0) {
        toast.error('Valor inválido');
        setLoading(false);
        return;
      }

      let amountBRL = amountNumeric;
      let exchangeRate = 1;

      if (formData.currency !== 'BRL') {
        amountBRL = await currencyClient.convertToBRL(amountNumeric, formData.currency);
        const rates = await currencyClient.getExchangeRates(formData.currency);
        exchangeRate = rates['BRL'];
      }

      const recordData = {
        description: formData.description,
        amount_text: currencyClient.formatCurrency(amountNumeric, formData.currency),
        amount_numeric: amountNumeric,
        currency: formData.currency,
        amount_brl: amountBRL,
        exchange_rate: exchangeRate,
        type: formData.type,
        date: formData.date,
        category: formData.category,
        office_id: officeId,
        status: 'Paid'
      };

      const { data, error } = await (supabase
        .from('financial_records')
        .upsert(editingRecord ? { id: editingRecord.id, ...recordData } : recordData)
        .select() as any);

      if (error) {
        toast.error('Erro ao salvar lançamento');
        console.error(error);
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && officeId) {
          await logAudit({
            userId: user.id,
            officeId: officeId,
            action: editingRecord ? 'UPDATE_FINANCIAL' : 'INSERT_FINANCIAL',
            entityType: 'financial',
            entityId: editingRecord ? editingRecord.id.toString() : (data as any)?.[0]?.id.toString(),
            oldData: editingRecord,
            newData: recordData
          });
        }

        toast.success(editingRecord ? 'Lançamento atualizado!' : 'Lançamento criado!');
        setIsAddModalOpen(false);
        setEditingRecord(null);
        setFormData({
          description: '',
          amount: '',
          type: 'Income',
          date: new Date().toISOString().split('T')[0],
          category: 'Honorários',
          currency: 'BRL'
        });
        fetchRecords();
      }
    } catch (error) {
      toast.error('Erro ao processar lançamento');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja realmente excluir este lançamento?')) return;

    const recordToDelete = records.find(r => r.id === id);

    const { error } = await (supabase.from('financial_records').delete().eq('id', id) as any);
    if (error) {
      toast.error('Erro ao excluir lançamento');
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && officeId && recordToDelete) {
        await logAudit({
          userId: user.id,
          officeId: officeId,
          action: 'DELETE_FINANCIAL',
          entityType: 'financial',
          entityId: id.toString(),
          oldData: recordToDelete
        });
      }

      toast.success('Lançamento excluído');
      fetchRecords();
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-10 animate-fade-in-up">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter text-slate-950 dark:text-white uppercase leading-none italic font-serif gold-gradient-text">Tesouraria.</h1>
            <p className="text-slate-500 dark:text-zinc-500 font-black uppercase text-[10px] tracking-[0.4em]">Gestão Financeira & Capital Institucional</p>
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 text-slate-500 px-8 py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:border-gold-500 transition-all shadow-sm"><Download size={18} /></button>
            <button
              onClick={() => {
                setEditingRecord(null);
                setFormData({
                  description: '',
                  amount: '',
                  type: 'Income',
                  date: new Date().toISOString().split('T')[0],
                  category: 'Honorários',
                  currency: 'BRL'
                });
                setIsAddModalOpen(true);
              }}
              className="flex-1 sm:flex-none bg-black dark:bg-white text-white dark:text-black px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-[11px] shadow-2xl transition-all"
            >
              Novo Lançamento
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          <div className="premium-card p-10 md:p-12 rounded-[3.5rem] group relative overflow-hidden">
            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-4 bg-emerald-500/10 text-emerald-600 rounded-2xl border border-emerald-500/20 w-fit mb-8 shadow-sm"><TrendingUp size={24} /></div>
            <p className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-[0.4em] mb-4 relative z-10">Inflow Líquido</p>
            <h3 className="text-4xl md:text-5xl font-black text-slate-950 dark:text-white tracking-tighter group-hover:gold-gradient-text transition-all relative z-10">{formatCurrency(totalInflow)}</h3>
            <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mt-6 flex items-center gap-2 relative z-10"><ArrowUpRight size={14} /> +12% vs Out</p>
          </div>
          <div className="premium-card p-10 md:p-12 rounded-[3.5rem] group relative overflow-hidden">
            <div className="absolute inset-0 bg-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-4 bg-rose-500/10 text-rose-600 rounded-2xl border border-rose-500/20 w-fit mb-8 shadow-sm"><TrendingDown size={24} /></div>
            <p className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-[0.4em] mb-4 relative z-10">Saídas de Operação</p>
            <h3 className="text-4xl md:text-5xl font-black text-slate-950 dark:text-white tracking-tighter relative z-10">{formatCurrency(totalOutflow)}</h3>
            <p className="text-[10px] text-slate-400 dark:text-zinc-700 font-black uppercase tracking-widest mt-6 relative z-10">Abaixo do Budget</p>
          </div>
          <div className="bg-slate-950 dark:bg-zinc-950 p-10 md:p-12 rounded-[3.5rem] border border-gold-500/20 shadow-3xl flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gold-600/5 group-hover:bg-gold-600/10 transition-all" />
            <p className="text-[10px] font-black text-gold-500 uppercase tracking-[0.4em] mb-4 relative z-10">Yield Acumulado</p>
            <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter gold-gradient-text relative z-10 leading-none">{formatCurrency(yieldAcumulado)}</h3>
            <div className="mt-8 py-3 bg-gold-600/10 border border-gold-600/20 rounded-2xl text-center relative z-10 shadow-lg">
              <span className="text-[9px] font-black text-gold-500 uppercase tracking-[0.4em]">Monitoramento Ativo</span>
            </div>
          </div>
        </div>

        <div className="premium-card rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-slate-50 dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-900">
                <tr>
                  <th className="px-12 py-8 text-[10px] font-black text-slate-400 dark:text-zinc-700 uppercase tracking-widest">Descrição Operacional</th>
                  <th className="px-12 py-8 text-[10px] font-black text-slate-400 dark:text-zinc-700 uppercase tracking-widest text-center">Data</th>
                  <th className="px-12 py-8 text-[10px] font-black text-slate-400 dark:text-zinc-700 uppercase tracking-widest text-right">Montante</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-900 bg-white dark:bg-black">
                {records.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-zinc-900/40 transition-all group cursor-pointer" onClick={() => {
                    setEditingRecord(record);
                    setFormData({
                      description: record.description,
                      amount: record.amount_numeric.toString().replace('.', ','),
                      type: record.type,
                      date: record.date,
                      category: record.category,
                      currency: record.currency as Currency
                    });
                    setIsAddModalOpen(true);
                  }}>
                    <td className="px-12 py-10">
                      <div className="flex items-center gap-6">
                        <div className={`p-4 rounded-2xl border transition-all ${record.type === 'Income' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'}`}>
                          {record.type === 'Income' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-base font-black text-slate-950 dark:text-white group-hover:text-gold-600 transition-colors truncate">{record.description}</p>
                          <p className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest mt-1">{record.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-12 py-10 font-mono text-xs font-black text-slate-500 dark:text-zinc-600 text-center">{record.date}</td>
                    <td className="px-12 py-10 text-right">
                      <div className="flex items-center justify-end gap-10">
                        <span className={`text-xl font-black tracking-tighter ${record.type === 'Income' ? 'text-slate-950 dark:text-white' : 'text-rose-600'}`}>
                          {record.type === 'Income' ? '+' : '-'} {record.amount}
                        </span>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(record.id);
                          }} className="p-3 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-400 hover:text-red-500 shadow-sm transition-all"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Modal
          isOpen={isAddModalOpen || !!editingRecord}
          onClose={() => { setIsAddModalOpen(false); setEditingRecord(null); }}
          title={editingRecord ? "Atualizar Lançamento" : "Novo Lançamento Tesouraria"}
        >
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest ml-1">Descrição do Lançamento</label>
              <input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="w-full px-8 py-5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl outline-none text-slate-950 dark:text-white font-black transition-all focus:border-gold-500 shadow-inner"
                placeholder="Ex: Honorários Sucumbenciais Silva"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest ml-1">Valor (Ex: 1.500,00)</label>
                <input
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  type="text"
                  className="w-full px-8 py-5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl outline-none text-slate-950 dark:text-white font-black transition-all focus:border-gold-500 shadow-inner"
                  placeholder="0,00"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest ml-1">Modalidade</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-8 py-5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl outline-none text-slate-950 dark:text-white font-black transition-all focus:border-gold-500 shadow-inner appearance-none"
                >
                  <option value="Income">Receita (Inflow)</option>
                  <option value="Expense">Despesa (Outflow)</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest ml-1">Data Competência</label>
                <input
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  type="date"
                  className="w-full px-8 py-5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl outline-none text-slate-950 dark:text-white font-black transition-all focus:border-gold-500 shadow-inner"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest ml-1">Categoria</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-8 py-5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl outline-none text-slate-950 dark:text-white font-black transition-all focus:border-gold-500 shadow-inner appearance-none"
                >
                  <option>Honorários</option>
                  <option>Custos Operacionais</option>
                  <option>Infraestrutura Office</option>
                  <option>Yield Estratégico</option>
                </select>
              </div>
            </div>
            <div className="pt-8 flex flex-col sm:flex-row gap-6 border-t border-slate-100 dark:border-zinc-900">
              <button type="button" onClick={() => { setIsAddModalOpen(false); setEditingRecord(null); }} className="flex-1 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-950 transition-all">Abortar</button>
              <button type="submit" disabled={loading} className="flex-[2] py-6 bg-black dark:bg-white text-white dark:text-black rounded-3xl font-black uppercase tracking-widest text-[11px] shadow-2xl active:scale-95 transition-all disabled:opacity-50">
                {loading ? "Sincronizando..." : editingRecord ? "Efetivar Governança" : "Confirmar Lançamento"}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
};
