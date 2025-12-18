
import React from 'react';
import { Calendar, ChevronRight, Clock } from 'lucide-react';
import { AGENDA_ITEMS } from '../../constants';

export const AgendaWidget: React.FC = () => {
  return (
    <div className="premium-card rounded-[3rem] p-8 space-y-8 h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-zinc-900 pb-6">
        <h3 className="font-black text-white text-xl flex items-center gap-3 tracking-tighter">
          <Calendar size={20} className="text-gold-500" />
          Cronograma
        </h3>
        <button className="text-[10px] text-gold-500 font-black uppercase tracking-widest hover:text-white transition-all">Expandir Grid</button>
      </div>
      
      <div className="space-y-8 flex-1">
        {AGENDA_ITEMS.map((item) => (
          <div key={item.id} className="flex gap-6 group cursor-pointer relative">
            <div className="flex flex-col items-center min-w-[3.5rem] pt-1">
              <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">HOJE</span>
              <span className="text-lg font-black text-white mt-1 font-mono">{item.time}</span>
            </div>
            <div className="flex-1 pb-6 border-b border-zinc-900 last:border-0 last:pb-0 relative">
              <div className="absolute -left-[1.8rem] top-2.5 w-2 h-2 rounded-full bg-gold-600 ring-4 ring-obsidian-900 group-hover:scale-150 transition-transform" />
              <h4 className="text-sm font-bold text-zinc-300 group-hover:text-white transition-colors leading-tight">
                {item.title}
              </h4>
              <div className="flex items-center gap-3 mt-3">
                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border
                  ${item.type === 'Audience' ? 'bg-gold-500/10 text-gold-500 border-gold-500/20' : 
                    item.type === 'Deadline' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                    'bg-zinc-800 text-zinc-400 border-zinc-700'}
                `}>
                  {item.type === 'Audience' ? 'Audiência Real' : item.type === 'Deadline' ? 'Prazo Fatal' : 'Reunião Strategic'}
                </span>
                <Clock size={12} className="text-zinc-700" />
              </div>
            </div>
            <div className="flex items-center text-zinc-800 group-hover:text-gold-500 transition-all">
              <ChevronRight size={18} />
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-6 border-t border-zinc-900 mt-auto">
        <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-900 text-center">
           <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Sincronização Segura Google Enterprise</p>
        </div>
      </div>
    </div>
  );
};
