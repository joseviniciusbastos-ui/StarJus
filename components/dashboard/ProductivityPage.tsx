import React, { useState, useEffect } from 'react';
import {
  Zap, Clock, Play, Pause, RotateCcw, LayoutGrid, List, Layers,
  Plus, Trash2, Edit2, Calendar, Sparkles, Search, ChevronRight, Hash, Flag, Target, MoreVertical, CheckCircle2
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Task, TaskPriority, TaskStatus } from '../../types';
import { KanbanBoard } from './KanbanBoard';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';

export const ProductivityPage: React.FC = () => {
  const { officeId } = useAuth();
  const [activeTab, setActiveTab] = useState<'matrix' | 'kanban' | 'sheets' | 'agenda'>('matrix');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [officeId]);

  const fetchTasks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*');

    if (data) {
      setTasks(data.map(t => ({
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

  useEffect(() => {
    let interval: any;
    if (isActive && pomodoroTime > 0) {
      interval = setInterval(() => setPomodoroTime(t => t - 1), 1000);
    } else if (pomodoroTime === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, pomodoroTime]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col xl:flex-row gap-12">
        <div className="flex-1 space-y-10 md:space-y-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="flex bg-slate-100 dark:bg-zinc-950 p-2 rounded-3xl border border-slate-200 dark:border-zinc-900 shadow-inner overflow-x-auto max-w-full custom-scrollbar">
              {[
                { id: 'matrix', icon: Layers, label: 'Estratégia' },
                { id: 'kanban', icon: LayoutGrid, label: 'Execução' },
                { id: 'sheets', icon: List, label: 'Ledger' },
                { id: 'agenda', icon: Calendar, label: 'Prazos' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-3 px-8 py-3.5 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-white dark:bg-zinc-800 text-gold-600 dark:text-gold-500 shadow-xl border border-slate-200 dark:border-zinc-700' : 'text-slate-500 dark:text-zinc-600 hover:text-slate-950 dark:hover:text-zinc-300'}`}
                >
                  <tab.icon size={14} /> {tab.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsNewTaskModalOpen(true)}
              className="w-full sm:w-auto bg-black dark:bg-white text-white dark:text-black px-10 py-5 rounded-[2rem] font-black uppercase tracking-[0.1em] text-[11px] flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all"
            >
              <Plus size={18} /> Iniciar Operação Alpha
            </button>
          </div>

          {activeTab === 'matrix' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {[
                { priority: 'High', title: 'Crítico Alpha', sub: 'Status: Fatal', color: 'bg-red-500/[0.03] text-red-500 border-red-500/10' },
                { priority: 'Medium', title: 'Desenvolvimento', sub: 'Status: Estratégico', color: 'bg-gold-500/[0.03] text-gold-600 border-gold-500/10' },
                { priority: 'Low', title: 'Operacional Jurídico', sub: 'Status: Delegação', color: 'bg-slate-50 dark:bg-zinc-950 text-slate-500 dark:text-zinc-600 border-slate-200 dark:border-zinc-900' },
                { priority: 'None', title: 'Histórico de Mérito', sub: 'Status: Concluído', color: 'bg-emerald-500/[0.03] text-emerald-600 border-emerald-500/10' }
              ].map(q => (
                <div
                  key={q.priority}
                  className={`p-10 rounded-[3rem] border flex flex-col ${q.color} transition-all hover:shadow-2xl relative overflow-hidden h-[450px]`}
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
              <h3 className="text-2xl font-black text-slate-950 dark:text-white uppercase tracking-tight">Ledger Alpha em Sincronização</h3>
              <p className="text-sm text-slate-500 dark:text-zinc-500 font-bold max-w-md italic">O módulo de tabelas executivas está sendo otimizado para a arquitetura Alpha v2.0.</p>
            </div>
          )}
        </div>

        <div className="w-full xl:w-[450px] space-y-12">
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
                  onClick={() => setIsActive(!isActive)}
                  className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all ${isActive ? 'bg-red-500/20 text-red-500 border border-red-500/20' : 'bg-white text-black shadow-3xl hover:scale-105 active:scale-95'}`}
                >
                  {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
                </button>
                <button
                  onClick={() => { setIsActive(false); setPomodoroTime(25 * 60); }}
                  className="w-20 h-20 bg-zinc-900 text-zinc-600 rounded-3xl flex items-center justify-center border border-zinc-800 hover:text-gold-500 transition-all shadow-xl"
                >
                  <RotateCcw size={28} />
                </button>
              </div>
              <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.3em]">Protocolo de Foco Alpha v2.0</p>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isNewTaskModalOpen || !!editingTask}
        onClose={() => { setIsNewTaskModalOpen(false); setEditingTask(null); }}
        title={editingTask ? "Modificar Operação Jurídica" : "Iniciar Nova Operação Alpha"}
      >
        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest ml-1">Denominação da Atividade</label>
            <input defaultValue={editingTask?.title} required className="w-full px-8 py-5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl outline-none text-slate-950 dark:text-white font-black transition-all focus:border-gold-500 shadow-inner" placeholder="Ex: Protocolar Tese de Mérito" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest ml-1">Prioridade Estratégica</label>
              <select defaultValue={editingTask?.priority} className="w-full px-8 py-5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl outline-none text-slate-950 dark:text-white font-black transition-all focus:border-gold-500 shadow-inner appearance-none">
                <option value="High">Urgente • Resolver Imediato</option>
                <option value="Medium">Estratégico • Semestre Alpha</option>
                <option value="Low">Operacional • Delegação</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest ml-1">Classificação Alpha (Tag)</label>
              <input defaultValue={editingTask?.tag} className="w-full px-8 py-5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl outline-none text-slate-950 dark:text-white font-black transition-all focus:border-gold-500 shadow-inner" placeholder="Ex: Tributário" />
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest ml-1">Instruções de Mérito / Notas</label>
            <textarea defaultValue={editingTask?.description} className="w-full px-8 py-6 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-[2.5rem] outline-none text-slate-950 dark:text-white font-bold transition-all focus:border-gold-500 shadow-inner resize-none" rows={4} placeholder="Descreva os requisitos para a execução da atividade..." />
          </div>
          <div className="pt-10 flex flex-col sm:flex-row gap-6 border-t border-slate-100 dark:border-zinc-900">
            <button type="button" onClick={() => { setIsNewTaskModalOpen(false); setEditingTask(null); }} className="flex-1 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-950 transition-all">Abortar</button>
            <button type="submit" onClick={() => { setIsNewTaskModalOpen(false); setEditingTask(null); }} className="flex-[2] py-6 bg-black dark:bg-white text-white dark:text-black rounded-3xl font-black uppercase tracking-widest text-[11px] shadow-2xl active:scale-95 transition-all">
              {editingTask ? "Efetivar Alteração" : "Confirmar Operação Alpha"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
