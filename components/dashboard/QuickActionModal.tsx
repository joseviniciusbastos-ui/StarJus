
import React from 'react';
import { Modal } from '../ui/Modal';
import {
  FilePlus,
  Users,
  Search,
  Scale,
  TrendingUp,
  History,
  ArrowRight,
  ShieldCheck,
  Zap,
  Briefcase
} from 'lucide-react';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({ isOpen, onClose }) => {
  const actions = [
    {
      id: 'new_case',
      title: 'Ajuizar Ação',
      desc: 'Iniciar novo processo no PJE/CNJ.',
      icon: Scale,
      color: 'text-gold-500',
      bg: 'bg-gold-500/10'
    },
    {
      id: 'new_client',
      title: 'Dossiê de Cliente',
      desc: 'Cadastrar novo proponente estratégico.',
      icon: Users,
      color: 'text-white',
      bg: 'bg-zinc-800'
    },
    {
      id: 'billing',
      title: 'Lançar Honorários',
      desc: 'Registrar entrada de capital operacional.',
      icon: TrendingUp,
      color: 'text-gold-400',
      bg: 'bg-zinc-900'
    },
    {
      id: 'analytics',
      title: 'Briefing Inteligente',
      desc: 'Gerar relatório IA de performance.',
      icon: Zap,
      color: 'text-gold-500',
      bg: 'bg-gold-500/10'
    }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ações de Inteligência">
      <div className="space-y-12 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={onClose}
              className="flex flex-col p-8 bg-zinc-900 rounded-[2.5rem] border border-zinc-800 hover:border-gold-500 transition-all text-left group hover:shadow-2xl hover:shadow-gold-500/5"
            >
              <div className={`p-4 rounded-2xl ${action.bg} ${action.color} mb-6 w-fit shadow-xl group-hover:scale-110 transition-transform`}>
                <action.icon size={24} />
              </div>
              <h4 className="text-xl font-black text-white tracking-tighter mb-2 group-hover:gold-gradient-text transition-all">
                {action.title}
              </h4>
              <p className="text-xs text-zinc-500 font-bold leading-relaxed">
                {action.desc}
              </p>
              <div className="mt-8 flex items-center gap-2 text-[10px] font-black text-gold-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Executar Comando <ArrowRight size={14} />
              </div>
            </button>
          ))}
        </div>

        <div className="bg-black/50 p-8 rounded-[3rem] border border-zinc-800 flex items-center gap-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold-600/5 rounded-full blur-[60px]" />
          <div className="p-5 bg-zinc-900 rounded-3xl text-gold-500 border border-zinc-800 shadow-3xl">
            <ShieldCheck size={32} className="animate-pulse" />
          </div>
          <div className="space-y-2">
            <h5 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Protocolo de Segurança</h5>
            <p className="text-xs text-zinc-500 font-medium leading-relaxed">
              Todas as ações rápidas são auditadas e criptografadas em tempo real sob conformidade LGPD Enterprise.
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center pt-8 border-t border-zinc-900">
          <button onClick={onClose} className="text-[10px] font-black text-zinc-600 hover:text-white uppercase tracking-widest transition-all">
            Cancelar Operação
          </button>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
            <span className="text-[9px] font-black text-gold-600 uppercase tracking-widest">Sincronização em Nuvem Ativa</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
