import React, { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import {
  Zap, Clock, Play, Pause, RotateCcw, LayoutGrid, List, Layers,
  Plus, Calendar, Sparkles, ChevronRight
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Task } from '../../types';
import { KanbanBoard } from './KanbanBoard';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import { useTimer } from '../../lib/TimerContext';

export const ProductivityPage: React.FC = () => {
  const { officeId } = useAuth();
  const { time: pomodoroTime, isTimerActive: isActive, isPaused, start, pause, resume, stop: resetTimer, formatTime } = useTimer();
  const [activeTab, setActiveTab] = useState<'matrix' | 'kanban' | 'sheets' | 'agenda'>('matrix');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [officeId]);

  const fetchTasks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*') as any;

    if (data) {
      setTasks((data as any[]).map(t => ({
        id: t.id.toString(),
        title: t.title,
        priority: t.priority as any,
        status: t.status as any,
        tag: t.tag,
        description: t.description,
        dueDate: t.due_date
      })));
    }
    setLoading(false);
  };

  // Calculate Real Metrics
  const metrics = useMemo(() => {
    const total = tasks.length || 1;
    const completed = tasks.filter(t => t.status === 'Concluído').length;
    const active = tasks.filter(t => t.status !== 'Concluído').length;
    const highPriority = tasks.filter(t => t.priority === 'High' && t.status !== 'Concluído').length;

    // Taxa de Êxito: % Completed
    const successRate = Math.round((completed / total) * 100);

    return {
      successRate: `${successRate}% `,
      activeTasks: active,
      highPriority: highPriority,
    };
  }, [tasks]);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const title = formData.get('title') as string;
    const priority = formData.get('priority') as string;
    const tag = formData.get('tag') as string;
    const description = formData.get('description') as string;

    setSaving(true);
    try {
      const { data, error } = await (supabase
        .from('tasks')
        .insert([{
          title,
          priority,
          tag,
          description,
          status: 'A Fazer',
          office_id: officeId,
          due_date: new Date().toISOString()
        } as any] as any)
        .select() as any);

      if (error) throw error;
      toast.success('Operação iniciada com sucesso!');
      fetchTasks();
      setIsNewTaskModalOpen(false);
    } catch (err) {
      toast.error('Erro ao iniciar operação.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;

    const formData = new FormData(e.target as HTMLFormElement);
    const title = formData.get('title') as string;
    const priority = formData.get('priority') as string;
    const tag = formData.get('tag') as string;
    const description = formData.get('description') as string;

    setSaving(true);
    try {
      const { error } = await (supabase
        .from('tasks')
        .update({
          title,
          priority,
          tag,
          description
        } as any)
        .eq('id', editingTask.id) as any);

      if (error) throw error;
      toast.success('Operação atualizada.');
      fetchTasks();
      setEditingTask(null);
    } catch (err) {
      toast.error('Erro ao atualizar operação.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Real Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="premium-card p-8 rounded-[2.5rem] space-y-2 border border-slate-100 dark:border-zinc-900 bg-white dark:bg-black">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-600">Taxa de Êxito</span>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-black tracking-tighter text-emerald-500">{metrics.successRate}</span>
            <span className="text-[10px] font-bold text-slate-400 italic">Conclusão Global</span>
          </div>
        </div>
        <div className="premium-card p-8 rounded-[2.5rem] space-y-2 border border-slate-100 dark:border-zinc-900 bg-white dark:bg-black">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-600">Volume Ativo</span>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-black tracking-tighter text-gold-500">{metrics.activeTasks}</span>
            <span className="text-[10px] font-bold text-slate-400 italic">Operações em Curso</span>
          </div>
        </div>
        <div className="premium-card p-8 rounded-[2.5rem] space-y-2 border border-slate-100 dark:border-zinc-900 bg-white dark:bg-black">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-600">Críticas</span>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-black tracking-tighter text-red-500">{metrics.highPriority}</span>
            <span className="text-[10px] font-bold text-slate-400 italic">Alta Prioridade</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-12">
        <div className="flex-1 space-y-10 md:space-y-12">
          {/* Enhanced Navigation Bar */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="w-full lg:w-auto flex bg-white dark:bg-zinc-950 p-2 rounded-[2rem] border border-slate-200 dark:border-zinc-800 shadow-xl overflow-x-auto custom-scrollbar">
              {[
                { id: 'matrix', icon: Layers, label: 'Estratégia' },
                { id: 'kanban', icon: LayoutGrid, label: 'Execução' },
                { id: 'sheets', icon: List, label: 'Ledger' },
                { id: 'agenda', icon: Calendar, label: 'Prazos' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative flex - 1 lg: flex - none flex items - center justify - center gap - 3 px - 10 py - 4 text - [11px] font - black uppercase tracking - widest rounded - [1.5rem] transition - all whitespace - nowrap z - 10 ${activeTab === tab.id ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg scale-105' : 'text-slate-400 dark:text-zinc-600 hover:text-slate-900 dark:hover:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-900'} `}
                >
                  <tab.icon size={16} className={activeTab === tab.id ? "text-gold-500 dark:text-gold-600" : ""} /> {tab.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsNewTaskModalOpen(true)}
              className="w-full lg:w-auto bg-gold-500 text-black px-8 py-5 rounded-[2rem] font-black uppercase tracking-[0.1em] text-[11px] flex items-center justify-center gap-3 shadow-gold-glow hover:bg-gold-400 active:scale-95 transition-all"
            >
              <Plus size={18} /> Nova Operação
            </button>
          </div>

          {activeTab === 'matrix' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {[
                { priority: 'High', title: 'Crítico', sub: 'Status: Fatal', color: 'bg-red-500/[0.03] text-red-500 border-red-500/10' },
                { priority: 'Medium', title: 'Desenvolvimento', sub: 'Status: Estratégico', color: 'bg-gold-500/[0.03] text-gold-600 border-gold-500/10' },
                { priority: 'Low', title: 'Operacional Jurídico', sub: 'Status: Delegação', color: 'bg-slate-50 dark:bg-zinc-950 text-slate-500 dark:text-zinc-600 border-slate-200 dark:border-zinc-900' },
                { priority: 'None', title: 'Histórico de Mérito', sub: 'Status: Concluído', color: 'bg-emerald-500/[0.03] text-emerald-600 border-emerald-500/10' }
              ].map(q => (
                <div
                  key={q.priority}
                  className={`p - 10 rounded - [3rem] border flex flex - col ${q.color} transition - all hover: shadow - 2xl relative overflow - hidden h - [450px]`}
                >
                  <div className="flex justify-between items-start mb-10 relative z-10">
                    <div className="space-y-1">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 leading-none">{q.sub}</h3>
                      <h4 className="text-2xl font-black tracking-tighter italic font-serif leading-none mt-2">{q.title}</h4>
                    </div>
                    <span className="text-4xl font-black opacity-10 tracking-tighter font-mono">
                      {tasks.filter(t => q.priority === 'None' ? t.status === 'Concluído' : t.priority === q.priority && t.status !== 'Concluído').length.toString().padStart(2, '0')}
                    </span>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-4 relative z-10">
                    {tasks.filter(t => q.priority === 'None' ? t.status === 'Concluído' : t.priority === q.priority && t.status !== 'Concluído').map(task => (
                      <div
                        key={task.id}
                        onClick={() => handleEditTask(task)}
                        className="bg-white dark:bg-black p-6 rounded-[2rem] border border-slate-100 dark:border-zinc-900 shadow-sm flex items-center gap-5 cursor-pointer hover:border-gold-500 hover:-translate-y-1 transition-all group"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-black text-slate-950 dark:text-zinc-300 truncate group-hover:text-gold-600 transition-colors uppercase tracking-tight">{task.title}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-600 opacity-60">ID: {task.id} • {task.tag}</span>
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-slate-200 dark:text-zinc-800 group-hover:text-gold-500" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'kanban' && <KanbanBoard />}
          {activeTab === 'sheets' && (
            <div className="premium-card p-20 rounded-[4rem] flex flex-col items-center justify-center text-center space-y-6">
              <List size={48} className="text-gold-500" />
              <h3 className="text-2xl font-black text-slate-950 dark:text-white uppercase tracking-tight">Ledger em Sincronização</h3>
              <p className="text-sm text-slate-500 dark:text-zinc-500 font-bold max-w-md italic">O módulo de tabelas executivas está sendo otimizado para a arquitetura v2.0.</p>
            </div>
          )}
          {activeTab === 'agenda' && (
            <div className="premium-card p-20 rounded-[4rem] flex flex-col items-center justify-center text-center space-y-6">
              <Calendar size={48} className="text-gold-500" />
              <h3 className="text-2xl font-black text-slate-950 dark:text-white uppercase tracking-tight">Agenda de Prazos</h3>
              <p className="text-sm text-slate-500 dark:text-zinc-500 font-bold max-w-md italic">Visualização de calendário em desenvolvimento.</p>
            </div>
          )}
        </div>

        <div className="w-full xl:w-[450px] space-y-12">
          {/* Pomodoro Timer - Kept as is, it's functional */}
          <div className="bg-black dark:bg-zinc-950 rounded-[4rem] p-12 text-white shadow-3xl relative overflow-hidden group border border-gold-500/10">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gold-600/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="flex items-center gap-3 mb-10 bg-gold-600/10 px-6 py-2.5 rounded-full border border-gold-600/20">
                <Sparkles size={16} className="text-gold-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gold-500">Deep Focus Hub</span>
              </div>
              <div className="text-8xl font-black tracking-tighter mb-10 font-mono flex items-baseline animate-float-slow">
                {formatTime(pomodoroTime)}
                <span className="text-sm font-black text-gold-600 ml-4 uppercase tracking-widest font-sans">SEC</span>
              </div>
              <div className="flex gap-8 mb-10">
                <button
                  onClick={() => isActive ? (isPaused ? resume() : pause()) : start()}
                  className={`w - 20 h - 20 rounded - 3xl flex items - center justify - center transition - all ${isActive && !isPaused ? 'bg-red-500/20 text-red-500 border border-red-500/20' : 'bg-white text-black shadow-3xl hover:scale-105 active:scale-95'} `}
                >
                  {isActive && !isPaused ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
                </button>
                <button
                  onClick={() => resetTimer()}
                  className="w-20 h-20 bg-zinc-900 text-zinc-600 rounded-3xl flex items-center justify-center border border-zinc-800 hover:text-gold-500 transition-all shadow-xl"
                >
                  <RotateCcw size={28} />
                </button>
              </div>
              <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.3em]">Protocolo de Foco</p>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isNewTaskModalOpen || !!editingTask}
        onClose={() => { setIsNewTaskModalOpen(false); setEditingTask(null); }}
        title={editingTask ? "Modificar Operação Jurídica" : "Iniciar Nova Operação"}
      >
        <form className="space-y-8" onSubmit={editingTask ? handleUpdateTask : handleCreateTask}>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest ml-1">Denominação da Atividade</label>
            <input name="title" defaultValue={editingTask?.title} required className="w-full px-8 py-5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl outline-none text-slate-950 dark:text-white font-black transition-all focus:border-gold-500 shadow-inner" placeholder="Ex: Protocolar Tese de Mérito" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest ml-1">Prioridade Estratégica</label>
              <select name="priority" defaultValue={editingTask?.priority} className="w-full px-8 py-5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl outline-none text-slate-950 dark:text-white font-black transition-all focus:border-gold-500 shadow-inner appearance-none">
                <option value="High">Urgente • Resolver Imediato</option>
                <option value="Medium">Estratégico • Semestre Corrente</option>
                <option value="Low">Operacional • Delegação</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest ml-1">Classificação (Tag)</label>
              <input name="tag" defaultValue={editingTask?.tag} className="w-full px-8 py-5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl outline-none text-slate-950 dark:text-white font-black transition-all focus:border-gold-500 shadow-inner" placeholder="Ex: Tributário" />
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest ml-1">Instruções de Mérito / Notas</label>
            <textarea name="description" defaultValue={editingTask?.description} className="w-full px-8 py-6 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-[2.5rem] outline-none text-slate-950 dark:text-white font-bold transition-all focus:border-gold-500 shadow-inner resize-none" rows={4} placeholder="Descreva os requisitos para a execução da atividade..." />
          </div>
          <div className="pt-10 flex flex-col sm:flex-row gap-6 border-t border-slate-100 dark:border-zinc-900">
            <button type="button" onClick={() => { setIsNewTaskModalOpen(false); setEditingTask(null); }} className="flex-1 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-950 transition-all">Abortar</button>
            <button type="submit" disabled={saving} className="flex-[2] py-6 bg-black dark:bg-white text-white dark:text-black rounded-3xl font-black uppercase tracking-widest text-[11px] shadow-2xl active:scale-95 transition-all disabled:opacity-50">
              {saving ? 'Efetivando...' : editingTask ? "Efetivar Alteração" : "Confirmar Operação"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
