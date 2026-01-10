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
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-700">
      {/* Productivity Sub-Sidebar */}
      <aside className="w-full lg:w-64 flex-shrink-0">
        <div className="sticky top-24 space-y-6">
          <div className="flex flex-col gap-2 p-2 bg-white dark:bg-zinc-950 rounded-[2rem] border border-slate-200 dark:border-zinc-800 shadow-xl">
            {[
              { id: 'matrix', icon: Layers, label: 'Estratégia' },
              { id: 'kanban', icon: LayoutGrid, label: 'Execução' },
              { id: 'sheets', icon: List, label: 'Ledger' },
              { id: 'agenda', icon: Calendar, label: 'Prazos' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-3 px-6 py-4 text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg scale-[1.02]' : 'text-slate-400 dark:text-zinc-600 hover:text-slate-900 dark:hover:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-900'} `}
              >
                <tab.icon size={16} className={activeTab === tab.id ? "text-gold-500" : ""} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Mini Pomodoro Integrated */}
          <div className="bg-black dark:bg-zinc-900 rounded-[2rem] p-6 text-white border border-gold-500/10 shadow-2xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gold-600/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 flex flex-col items-center">
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-gold-500/60 mb-3">Focus Hub</span>
              <div className="text-3xl font-black tracking-tighter mb-4 font-mono text-center">
                {formatTime(pomodoroTime)}
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => isActive ? (isPaused ? resume() : pause()) : start()}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isActive && !isPaused ? 'bg-red-500/20 text-red-500' : 'bg-white text-black hover:scale-105 active:scale-95'} `}
                >
                  {isActive && !isPaused ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                </button>
                <button
                  onClick={() => resetTimer()}
                  className="w-10 h-10 bg-white/5 text-zinc-500 rounded-xl flex items-center justify-center border border-white/10 hover:text-gold-500 transition-all active:scale-95"
                >
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white dark:bg-zinc-950 p-8 rounded-[2.5rem] border border-slate-200 dark:border-zinc-800 shadow-sm">
          <div className="flex flex-wrap items-center gap-8">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-600">Taxa de Êxito</span>
              <p className="text-2xl font-black tracking-tighter text-emerald-500 leading-none">{metrics.successRate}</p>
            </div>
            <div className="w-px h-8 bg-slate-100 dark:bg-zinc-800 hidden sm:block" />
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-600">Em Curso</span>
              <p className="text-2xl font-black tracking-tighter text-gold-500 leading-none">{metrics.activeTasks}</p>
            </div>
            <div className="w-px h-8 bg-slate-100 dark:bg-zinc-800 hidden sm:block" />
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-600">Críticas</span>
              <p className="text-2xl font-black tracking-tighter text-red-500 leading-none">{metrics.highPriority}</p>
            </div>
          </div>

          <button
            onClick={() => setIsNewTaskModalOpen(true)}
            className="w-full md:w-auto bg-gold-500 text-black px-8 py-4 rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 shadow-gold-glow hover:bg-gold-400 active:scale-95 transition-all"
          >
            <Plus size={18} /> Nova Operação
          </button>
        </div>

        {/* View Content */}
        <div className="min-h-[600px]">
          {activeTab === 'matrix' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { priority: 'High', title: 'Crítico', sub: 'Status: Fatal', color: 'bg-red-500/[0.02] text-red-500 border-red-500/10' },
                { priority: 'Medium', title: 'Desenvolvimento', sub: 'Status: Estratégico', color: 'bg-gold-500/[0.02] text-gold-600 border-gold-500/10' },
                { priority: 'Low', title: 'Operacional Jurídico', sub: 'Status: Delegação', color: 'bg-slate-50 dark:bg-zinc-950/50 text-slate-500 dark:text-zinc-600 border-slate-200 dark:border-zinc-900' },
                { priority: 'None', title: 'Histórico de Mérito', sub: 'Status: Concluído', color: 'bg-emerald-500/[0.02] text-emerald-600 border-emerald-500/10' }
              ].map(q => (
                <div
                  key={q.priority}
                  className={`p-8 rounded-[3rem] border flex flex-col ${q.color} transition-all hover:shadow-xl relative overflow-hidden h-[400px]`}
                >
                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <div className="space-y-1">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 leading-none">{q.sub}</h3>
                      <h4 className="text-xl font-black tracking-tighter italic font-serif leading-none mt-2">{q.title}</h4>
                    </div>
                    <span className="text-3xl font-black opacity-10 tracking-tighter font-mono">
                      {tasks.filter(t => q.priority === 'None' ? t.status === 'Concluído' : t.priority === q.priority && t.status !== 'Concluído').length.toString().padStart(2, '0')}
                    </span>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2 relative z-10">
                    {tasks.filter(t => q.priority === 'None' ? t.status === 'Concluído' : t.priority === q.priority && t.status !== 'Concluído').map(task => (
                      <div
                        key={task.id}
                        onClick={() => handleEditTask(task)}
                        className="bg-white dark:bg-black p-5 rounded-2xl border border-slate-100 dark:border-zinc-900 shadow-sm flex items-center gap-4 cursor-pointer hover:border-gold-500 hover:-translate-y-0.5 transition-all group"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black text-slate-950 dark:text-zinc-300 truncate group-hover:text-gold-600 transition-colors uppercase tracking-tight">{task.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-600 opacity-60">ID: {task.id} • {task.tag}</span>
                          </div>
                        </div>
                        <ChevronRight size={12} className="text-slate-200 dark:text-zinc-800 group-hover:text-gold-500" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'kanban' && <KanbanBoard />}

          {activeTab === 'sheets' && (
            <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 p-20 rounded-[4rem] flex flex-col items-center justify-center text-center space-y-6">
              <List size={48} className="text-gold-500" />
              <h3 className="text-2xl font-black text-slate-950 dark:text-white uppercase tracking-tight">Ledger Executivo</h3>
              <p className="text-sm text-slate-500 dark:text-zinc-500 font-bold max-w-md italic">Sincronizando registros da arquitetura v2.0...</p>
            </div>
          )}

          {activeTab === 'agenda' && (
            <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 p-20 rounded-[4rem] flex flex-col items-center justify-center text-center space-y-6">
              <Calendar size={48} className="text-gold-500" />
              <h3 className="text-2xl font-black text-slate-950 dark:text-white uppercase tracking-tight">Agenda de Prazos</h3>
              <p className="text-sm text-slate-500 dark:text-zinc-500 font-bold max-w-md italic">Interface de calendário em otimização.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
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
