import React, { useState, useEffect } from 'react';
import { Plus, Clock, Calendar, User, Play, Pause, Trash2, GripVertical, CheckCircle2 } from 'lucide-react';
import { KANBAN_COLUMNS } from '../../constants';
import { Task, TaskStatus, TaskPriority } from '../../types';
import { Modal } from '../ui/Modal';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';

const PriorityBadge: React.FC<{ priority: TaskPriority }> = ({ priority }) => {
  const colors = {
    High: 'bg-red-500/10 text-red-500 border-red-500/20',
    Medium: 'bg-gold-500/10 text-gold-500 border-gold-500/20',
    Low: 'bg-zinc-800 text-zinc-500 border-zinc-700',
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${colors[priority]}`}>
      {priority}
    </span>
  );
};

export const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const { officeId } = useAuth();

  useEffect(() => {
    fetchTasks();
    fetchMembers();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('tasks-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks'
        },
        () => {
          fetchTasks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [officeId]);

  const fetchMembers = async () => {
    const { data } = await supabase
      .from('office_members')
      .select('user_id, profiles:user_id(full_name)');
    if (data) setMembers(data);
  };

  const fetchTasks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      const mappedData: Task[] = data.map(t => ({
        id: t.id,
        title: t.title,
        status: t.status as any,
        priority: t.priority as any,
        tag: t.tag || 'Geral',
        dueDate: t.due_date,
        assignee: t.assignee || 'Pendente',
        description: t.description || '',
        isRunning: t.is_running,
        timeSpent: t.time_spent
      }));
      setTasks(mappedData);
    }
    setLoading(false);
  };

  // Time Tracking Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(prev => prev.map(t => t.isRunning ? { ...t, timeSpent: (t.timeSpent || 0) + 1 } : t));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const toggleTimer = async (taskId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newIsRunning = !task.isRunning;

    // Update locally for immediate feedback
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, isRunning: newIsRunning } : t));

    // Persist to Supabase
    await supabase
      .from('tasks')
      .update({
        is_running: newIsRunning,
        time_spent: task.timeSpent
      })
      .eq('id', taskId);
  };

  const handleDragStart = (e: React.DragEvent, taskId: number) => {
    e.dataTransfer.setData('taskId', taskId.toString());
  };

  const handleDrop = async (e: React.DragEvent, newStatus: TaskStatus) => {
    const taskId = parseInt(e.dataTransfer.getData('taskId'));

    // Update locally
    setTasks(prev => prev.map(t =>
      t.id === taskId
        ? { ...t, status: newStatus, isRunning: newStatus === 'Concluído' ? false : t.isRunning }
        : t
    ));

    // Persist to Supabase
    await supabase
      .from('tasks')
      .update({
        status: newStatus,
        is_running: newStatus === 'Concluído' ? false : undefined
      })
      .eq('id', taskId);
  };

  const allowDrop = (e: React.DragEvent) => e.preventDefault();

  const moveTask = async (taskId: number, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(t =>
      t.id === taskId
        ? { ...t, status: newStatus, isRunning: newStatus === 'Concluído' ? false : t.isRunning }
        : t
    ));

    await supabase
      .from('tasks')
      .update({
        status: newStatus,
        is_running: newStatus === 'Concluído' ? false : undefined
      })
      .eq('id', taskId);

    setSelectedTask(null);
  };

  const deleteTask = async (taskId: number) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    await supabase.from('tasks').delete().eq('id', taskId);
    setSelectedTask(null);
  };

  const handleAddTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newTask = {
      title: formData.get('title') as string,
      status: 'A Fazer',
      priority: formData.get('priority') as TaskPriority,
      tag: formData.get('tag') as string,
      due_date: formData.get('due_date') as string,
      assignee: formData.get('assignee') as string,
      description: formData.get('description') as string,
      office_id: officeId,
      time_spent: 0,
      is_running: false
    };

    const { error } = await supabase.from('tasks').insert([newTask]);
    if (!error) {
      setIsAddModalOpen(false);
      fetchTasks();
    }
  };

  const renderCard = (task: Task) => (
    <div
      key={task.id}
      draggable
      onDragStart={(e) => handleDragStart(e, task.id)}
      onClick={() => setSelectedTask(task)}
      className="bg-zinc-900/40 p-6 rounded-[2rem] border border-zinc-800 hover:border-gold-500/50 hover:bg-zinc-900 hover:shadow-2xl hover:shadow-gold-500/5 transition-all cursor-grab active:cursor-grabbing group animate-in zoom-in-95 duration-300"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <GripVertical size={14} className="text-zinc-800 group-hover:text-gold-500/30" />
          <PriorityBadge priority={task.priority} />
        </div>
        <button
          onClick={(e) => toggleTimer(task.id, e)}
          className={`p-2.5 rounded-xl border transition-all ${task.isRunning ? 'bg-red-500/10 text-red-500 border-red-500/20 animate-pulse' : 'bg-zinc-950 text-zinc-600 border-zinc-800 hover:text-gold-500 hover:border-gold-500'}`}
        >
          {task.isRunning ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
        </button>
      </div>
      <h4 className="text-sm font-bold text-zinc-100 mb-3 leading-tight group-hover:text-gold-500 transition-colors">{task.title}</h4>
      <div className="flex items-center gap-3 mb-6">
        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 bg-zinc-950 px-2.5 py-1 rounded-lg border border-zinc-800">{task.tag}</span>
        <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest tracking-tighter">• {task.assignee}</span>
      </div>

      <div className="flex items-center justify-between pt-5 border-t border-zinc-800/50">
        <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 group-hover:text-gold-500 transition-colors">
          <Clock size={12} />
          {formatTime(task.timeSpent || 0)}
        </div>
        <div className="text-[10px] font-black text-zinc-700 flex items-center gap-2 uppercase tracking-widest">
          <Calendar size={12} />
          {task.dueDate}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar">
      <div className="flex gap-8 h-full min-w-[1200px] pb-10">
        {KANBAN_COLUMNS.map((column) => (
          <div
            key={column}
            onDrop={(e) => handleDrop(e, column)}
            onDragOver={allowDrop}
            className="flex-1 flex flex-col bg-zinc-950/30 rounded-[3rem] border border-zinc-900/50"
          >
            <div className="p-8 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="font-black text-[10px] uppercase tracking-[0.4em] text-zinc-600">{column}</span>
                <span className="text-[10px] text-gold-500 font-black bg-gold-600/10 px-4 py-1.5 rounded-full border border-gold-600/20">
                  {tasks.filter(t => t.status === column).length}
                </span>
              </div>
              {column === 'A Fazer' && (
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 hover:text-gold-500 hover:border-gold-500 transition-all shadow-xl active:scale-95"
                >
                  <Plus size={16} />
                </button>
              )}
            </div>
            <div className="px-5 pb-6 flex-1 overflow-y-auto space-y-5 custom-scrollbar">
              {tasks.filter(task => task.status === column).map(renderCard)}
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={!!selectedTask} onClose={() => setSelectedTask(null)} title="Controle de Trabalho">
        {selectedTask && (
          <div className="space-y-10">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h3 className="text-4xl font-black text-white tracking-tighter leading-none italic font-serif gold-gradient-text">{selectedTask.title}</h3>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">{selectedTask.tag} • OAB/MASTER</p>
              </div>
              <button onClick={() => deleteTask(selectedTask.id)} className="p-4 text-zinc-500 hover:text-red-500 bg-zinc-900 rounded-3xl transition-all border border-zinc-800">
                <Trash2 size={24} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="bg-gold-600/5 p-8 rounded-[2.5rem] border border-gold-600/10">
                <span className="text-[10px] font-black text-gold-600 uppercase tracking-widest block mb-3">Tempo Registrado</span>
                <p className="text-3xl font-mono font-bold text-gold-500 tracking-tighter">{formatTime(selectedTask.timeSpent || 0)}</p>
              </div>
              <div className="bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-800">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-3">Workflow Status</span>
                <p className="text-xl font-black text-white uppercase tracking-tight">{selectedTask.status}</p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] ml-1">Instruções Operacionais</label>
              <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] text-sm text-zinc-400 leading-relaxed font-medium">
                {selectedTask.description || "Sem notas estratégicas vinculadas a este ticket."}
              </div>
            </div>

            <div className="flex gap-6 pt-6 border-t border-zinc-900">
              <button className="flex-1 py-6 bg-zinc-900 text-zinc-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:text-white hover:bg-zinc-800 transition-all border border-zinc-800">Salvar Dados</button>
              {selectedTask.status !== 'Concluído' && (
                <button
                  onClick={() => moveTask(selectedTask.id, 'Concluído')}
                  className="flex items-center justify-center gap-3 px-10 py-6 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gold-500 shadow-3xl transition-all"
                >
                  <CheckCircle2 size={18} /> Finalizar Task
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Novo Ticket de Operação Alpha"
      >
        <form onSubmit={handleAddTask} className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Título da Atividade</label>
            <input name="title" required className="w-full px-8 py-5 bg-zinc-950 border border-zinc-800 rounded-3xl outline-none text-white font-black transition-all focus:border-gold-500 shadow-inner" placeholder="Ex: Protocolo de Recurso Especial" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Prioridade Alpha</label>
              <select name="priority" className="w-full px-8 py-5 bg-zinc-950 border border-zinc-800 rounded-3xl outline-none text-white font-black transition-all focus:border-gold-500 shadow-inner appearance-none">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Deadline</label>
              <input name="due_date" type="date" required className="w-full px-8 py-5 bg-zinc-950 border border-zinc-800 rounded-3xl outline-none text-white font-black transition-all focus:border-gold-500 shadow-inner" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Tag Alpha</label>
              <input name="tag" className="w-full px-8 py-5 bg-zinc-950 border border-zinc-800 rounded-3xl outline-none text-white font-black transition-all focus:border-gold-500 shadow-inner" placeholder="Ex: Prazo Judicial" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Responsável</label>
              <select name="assignee" className="w-full px-8 py-5 bg-zinc-950 border border-zinc-800 rounded-3xl outline-none text-white font-black transition-all focus:border-gold-500 shadow-inner appearance-none">
                <option value="Pendente">Selecionar Operador...</option>
                {members.map(m => (
                  <option key={m.user_id} value={m.profiles?.full_name}>{m.profiles?.full_name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Descrição Estratégica</label>
            <textarea name="description" rows={3} className="w-full px-8 py-5 bg-zinc-950 border border-zinc-800 rounded-3xl outline-none text-white font-black transition-all focus:border-gold-500 shadow-inner resize-none" placeholder="Detalhes fundamentais para a execução..." />
          </div>

          <div className="pt-8 flex gap-6 border-t border-zinc-900">
            <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all">Cancelar</button>
            <button type="submit" className="flex-[2] py-6 bg-white text-black rounded-3xl font-black uppercase tracking-widest text-[11px] shadow-2xl active:scale-95 transition-all">
              Confirmar Ticket Alpha
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
