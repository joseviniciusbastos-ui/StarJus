import { supabase } from '../../lib/supabase';

export const ProcessesPage: React.FC = () => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [editingProcess, setEditingProcess] = useState<Process | null>(null);

  useEffect(() => {
    fetchProcesses();
  }, []);

  const fetchProcesses = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('processes')
      .select('*');

    if (data) {
      // Map DB fields to component types if they differ (using value_text etc)
      const mappedData: Process[] = data.map(p => ({
        id: p.id.toString(),
        number: p.number,
        title: p.title,
        client: 'Roberto Silva', // In a real app we'd join on client_id
        court: p.court,
        status: p.status as any,
        lastUpdate: p.last_update,
        value: p.value_text,
        updates: []
      }));
      setProcesses(mappedData);
    }
    setLoading(false);
  };

  const filteredProcesses = processes.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !activeFilter || p.status === activeFilter || p.court.includes(activeFilter);
    return matchesSearch && matchesFilter;
  });

  const handleEdit = (p: Process, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProcess(p);
  };

  return (
    <div className="space-y-10 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter text-slate-950 dark:text-white uppercase leading-none italic font-serif gold-gradient-text">Litígios Ativos.</h1>
          <p className="text-slate-500 dark:text-zinc-500 font-black uppercase text-[10px] tracking-[0.4em]">Gestão de Processos Monitorados Alpha</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full sm:w-auto bg-black dark:bg-white text-white dark:text-black px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-[11px] shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95"
        >
          <Plus size={18} /> Novo Registro Alpha
        </button>
      </div>

      <div className="premium-card p-6 rounded-[2.5rem] flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-6 top-4.5 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-16 pr-6 py-4.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900 rounded-3xl outline-none text-slate-950 dark:text-white font-black text-sm shadow-inner"
            placeholder="Buscar por número CNJ ou Cliente..."
          />
        </div>
        <button
          onClick={() => setIsFilterModalOpen(true)}
          className={`px-8 py-4.5 bg-white dark:bg-black border rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-3 ${activeFilter ? 'border-gold-500 text-gold-600' : 'border-slate-200 dark:border-zinc-800 text-slate-500 hover:text-gold-600'}`}
        >
          <Filter size={18} /> {activeFilter || 'Filtros Alpha'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {filteredProcesses.map((p) => (
          <div key={p.id} onClick={() => setSelectedProcess(p)} className="premium-card p-8 md:p-12 rounded-[3rem] group cursor-pointer hover:border-gold-500 flex flex-col xl:flex-row items-center gap-10">
            <div className="flex items-center gap-8 flex-1 w-full">
              <div className="p-6 bg-slate-50 dark:bg-zinc-950 rounded-[2.5rem] border border-slate-200 dark:border-zinc-800 text-gold-600 group-hover:bg-gold-500 group-hover:text-black transition-all shadow-xl">
                <Scale size={36} />
              </div>
              <div className="space-y-2 flex-1 min-w-0">
                <h3 className="text-2xl font-black text-slate-950 dark:text-white leading-none truncate group-hover:gold-gradient-text transition-all">{p.title}</h3>
                <p className="text-sm font-bold text-slate-400 dark:text-zinc-600 font-mono tracking-tight">{p.number}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 w-full xl:w-auto">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 dark:text-zinc-700 uppercase tracking-widest">Clientela</span>
                <p className="text-sm font-black text-slate-700 dark:text-zinc-300 truncate">{p.client}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 dark:text-zinc-700 uppercase tracking-widest">Exposure</span>
                <p className="text-sm font-black text-slate-950 dark:text-white">{p.value}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 dark:text-zinc-700 uppercase tracking-widest">Vara/Tribunal</span>
                <p className="text-sm font-black text-slate-600 dark:text-zinc-400">{p.court}</p>
              </div>
              <div className="flex items-center justify-end gap-6">
                <span className="px-5 py-2 text-[10px] font-black rounded-full bg-gold-600/10 text-gold-600 border border-gold-600/20 uppercase tracking-widest whitespace-nowrap">Status: Ativo</span>
                <button onClick={(e) => handleEdit(p, e)} className="p-3 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl text-slate-400 hover:text-gold-500 opacity-0 group-hover:opacity-100 transition-all"><Edit2 size={16} /></button>
              </div>
            </div>
            <ChevronRight className="text-slate-200 dark:text-zinc-800 group-hover:text-gold-500 transition-all hidden xl:block" size={28} />
          </div>
        ))}
      </div>

      <Modal
        isOpen={isAddModalOpen || !!editingProcess}
        onClose={() => { setIsAddModalOpen(false); setEditingProcess(null); }}
        title={editingProcess ? "Atualizar Registro Alpha" : "Novo Registro de Litígio"}
      >
        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest ml-1">Denominação do Processo</label>
            <input defaultValue={editingProcess?.title} required className="w-full px-8 py-5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl outline-none text-slate-950 dark:text-white font-black transition-all focus:border-gold-500 shadow-inner" placeholder="Ex: Silva vs Construtora Alpha" />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest ml-1">Número CNJ / Indexador Alpha</label>
            <input defaultValue={editingProcess?.number} required className="w-full px-8 py-5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl outline-none text-slate-950 dark:text-white font-black transition-all focus:border-gold-500 shadow-inner" placeholder="0000000-00.0000.0.00.0000" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest ml-1">Tribunal de Origem</label>
              <input defaultValue={editingProcess?.court} className="w-full px-8 py-5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl outline-none text-slate-950 dark:text-white font-black transition-all focus:border-gold-500 shadow-inner" placeholder="Ex: 3ª Vara Cível SP" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest ml-1">Expectativa Econômica</label>
              <input defaultValue={editingProcess?.value} className="w-full px-8 py-5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl outline-none text-slate-950 dark:text-white font-black transition-all focus:border-gold-500 shadow-inner" placeholder="R$ 0,00" />
            </div>
          </div>
          <div className="pt-8 flex flex-col sm:flex-row gap-6 border-t border-slate-100 dark:border-zinc-900">
            <button type="button" onClick={() => { setIsAddModalOpen(false); setEditingProcess(null); }} className="flex-1 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">Cancelar</button>
            <button type="submit" onClick={() => { setIsAddModalOpen(false); setEditingProcess(null); }} className="flex-[2] py-6 bg-black dark:bg-white text-white dark:text-black rounded-3xl font-black uppercase tracking-widest text-[11px] shadow-2xl active:scale-95 transition-all">
              {editingProcess ? "Efetivar Alteração" : "Confirmar Registro Alpha"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} title="Parâmetros de Filtragem">
        <div className="space-y-10">
          <div className="space-y-6">
            <h4 className="text-[11px] font-black text-slate-400 dark:text-zinc-700 uppercase tracking-widest">Área Jurídica</h4>
            <div className="flex flex-wrap gap-3">
              {['Cível', 'Tributário', 'Família', 'Empresarial', 'Condominial'].map(tag => (
                <button
                  key={tag}
                  onClick={() => setActiveFilter(tag)}
                  className={`px-6 py-3 border rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === tag ? 'bg-gold-500 text-black border-gold-500' : 'bg-slate-100 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-500 hover:border-gold-500'}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <h4 className="text-[11px] font-black text-slate-400 dark:text-zinc-700 uppercase tracking-widest">Status do Fluxo</h4>
            <div className="flex flex-wrap gap-3">
              {['Active', 'Suspended', 'Done'].map(st => (
                <button
                  key={st}
                  onClick={() => setActiveFilter(st)}
                  className={`px-6 py-3 border rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === st ? 'bg-gold-500 text-black border-gold-500' : 'bg-slate-100 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-500 hover:border-gold-500'}`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setActiveFilter(null)} className="flex-1 py-6 bg-slate-100 dark:bg-zinc-900 text-slate-400 rounded-3xl font-black uppercase text-[11px] tracking-widest">Limpar</button>
            <button onClick={() => setIsFilterModalOpen(false)} className="flex-[2] py-6 bg-black dark:bg-white text-white dark:text-black rounded-3xl font-black uppercase text-[11px] tracking-widest shadow-2xl transition-all">Sincronizar Visão Alpha</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
