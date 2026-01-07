
import React from 'react';
import { PlayCircle, Clock, BookOpen, Search, Filter, Sparkles, ChevronRight } from 'lucide-react';
import { MOCK_TRAINING } from '../../constants';

export const TrainingPage: React.FC = () => {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter text-white italic font-serif gold-gradient-text leading-none uppercase">Academia STAR<span className="font-sans not-italic">JUS</span></h1>
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Desenvolvimento Profissional & Governança</p>
        </div>
        <div className="flex items-center gap-4 bg-gold-600/10 text-gold-500 px-8 py-4 rounded-[2rem] border border-gold-600/20 shadow-2xl shadow-gold-900/10">
          <BookOpen size={20} className="animate-pulse" />
          <span className="text-[11px] font-black uppercase tracking-widest">12h de Formação Concluídas</span>
        </div>
      </div>

      <div className="premium-card p-6 rounded-[2.5rem] border-zinc-900 shadow-3xl flex flex-col sm:flex-row gap-6 bg-zinc-950/50">
        <div className="relative flex-1">
          <Search className="absolute left-6 top-4.5 h-5 w-5 text-zinc-700" />
          <input type="text" className="block w-full pl-16 pr-6 py-4.5 bg-zinc-900 border border-zinc-800 rounded-3xl focus:ring-1 focus:ring-gold-500 outline-none text-white font-bold transition-all shadow-inner" placeholder="Buscar doutrinas, tutoriais ou tesouras..." />
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-3 px-10 py-4.5 border border-zinc-800 rounded-3xl text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-white hover:border-gold-500/30 transition-all bg-zinc-900">
            <Filter size={18} /> Filtrar Catálogo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {MOCK_TRAINING.map((course) => (
          <div key={course.id} className="premium-card rounded-[3.5rem] border-zinc-900 shadow-2xl overflow-hidden flex flex-col group hover:shadow-gold-900/10 hover:-translate-y-2 transition-all duration-500">
            <div className="relative h-64 overflow-hidden">
              <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0" />
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="p-6 bg-white rounded-full text-black shadow-3xl transform scale-50 group-hover:scale-100 transition-transform duration-500">
                  <PlayCircle size={48} fill="currentColor" />
                </div>
              </div>
              <div className="absolute top-6 right-6 bg-black/80 backdrop-blur px-4 py-2 rounded-2xl text-[10px] font-black text-gold-500 flex items-center gap-2 border border-white/10 shadow-2xl">
                <Clock size={14} /> {course.duration}
              </div>
              <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent" />
            </div>
            <div className="p-10 flex-1 flex flex-col bg-zinc-900/80 backdrop-blur-xl">
              <span className={`text-[9px] font-black uppercase tracking-[0.4em] mb-4 px-4 py-1.5 rounded-full inline-block w-fit border ${course.category === 'Jurisprudência' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                  course.category === 'Sistema' ? 'bg-gold-500/10 text-gold-500 border-gold-500/20' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                }`}>
                {course.category}
              </span>
              <h3 className="text-2xl font-black text-white tracking-tighter leading-tight mb-8 group-hover:gold-gradient-text transition-all">{course.title}</h3>

              <div className="mt-auto space-y-6 pt-6 border-t border-zinc-800/50">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Absorção de Conteúdo</span>
                  <span className="text-[10px] font-black text-gold-500 uppercase tracking-widest">{course.progress}%</span>
                </div>
                <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-900 shadow-inner">
                  <div className="bg-gold-600 h-full transition-all duration-1000 shadow-[0_0_15px_rgba(212,175,55,0.4)]" style={{ width: `${course.progress}%` }} />
                </div>
                <button className="w-full py-5 bg-white text-black rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-gold-500 shadow-3xl transition-all flex items-center justify-center gap-3">
                  {course.progress === 100 ? 'Revisar Doutrina' : 'Continuar Formação'}
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Card de Sugestão IA */}
        <div className="bg-zinc-950 rounded-[3.5rem] border-2 border-dashed border-zinc-900 flex flex-col items-center justify-center p-12 text-center group hover:border-gold-500/30 transition-all">
          <div className="p-6 bg-gold-600/5 rounded-[2.5rem] border border-gold-600/10 mb-8 group-hover:bg-gold-600 group-hover:text-black transition-all">
            <Sparkles size={48} className="text-gold-500 group-hover:text-black transition-all" />
          </div>
          <h4 className="text-xl font-black text-white tracking-tight mb-4">Sugerido pela Starjus IA</h4>
          <p className="text-sm text-zinc-600 font-medium leading-relaxed px-6">Baseado na sua atuação recente em Direito Imobiliário.</p>
          <button className="mt-8 text-[11px] font-black text-gold-500 uppercase tracking-[0.3em] hover:text-white transition-all underline underline-offset-8 decoration-2">Explorar Novo Módulo</button>
        </div>
      </div>
    </div>
  );
};
