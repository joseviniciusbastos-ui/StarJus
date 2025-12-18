
import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { 
  User, Shield, LogOut, Camera, 
  Building, Save, Users, CheckCircle2,
  Lock, Key, Mail, Phone, Globe, ChevronRight,
  ShieldAlert, Sparkles, CreditCard, ShieldCheck
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'office' | 'security'>('profile');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Governança de Identidade">
      <div className="space-y-12 animate-in fade-in duration-700">
        
        {/* Navigation - Estilo Premium Obsidian */}
        <div className="flex bg-zinc-950 p-2 rounded-[2.5rem] border border-zinc-900 shadow-inner">
          {[
            { id: 'profile', icon: User, label: 'Identidade' },
            // Fixed: replaced 'Escritório' with 'Building' icon which is imported
            { id: 'office', icon: Building, label: 'Estrutura' },
            { id: 'security', icon: Shield, label: 'Segurança' }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-3 py-5 text-[10px] font-black uppercase tracking-[0.2em] rounded-3xl transition-all ${activeTab === tab.id ? 'bg-zinc-800 text-gold-500 shadow-2xl border border-zinc-700' : 'text-zinc-600 hover:text-zinc-300'}`}
            >
              {/* Simplified: removed conditional rendering for icon since all tab icons are now valid components */}
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'profile' && (
          <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row items-center gap-12">
              <div className="relative group">
                <div className="absolute inset-0 bg-gold-500 rounded-[4rem] blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity" />
                <img className="relative h-40 w-40 rounded-[4rem] border-4 border-zinc-900 object-cover shadow-3xl transition-all group-hover:scale-105 grayscale group-hover:grayscale-0" src="https://picsum.photos/id/1005/300/300" alt="Avatar" />
                <button className="absolute -bottom-2 -right-2 bg-gold-600 p-4 rounded-3xl text-black shadow-3xl hover:bg-gold-500 transition-all border-4 border-zinc-950">
                  <Camera size={24} />
                </button>
              </div>
              <div className="flex-1 text-center sm:text-left space-y-6">
                <div>
                   <h3 className="font-black text-white text-4xl tracking-tighter leading-none italic font-serif gold-gradient-text mb-3">Dr. Carlos Silva</h3>
                   <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] flex items-center justify-center sm:justify-start gap-3">
                     OAB/SP 123.456 • Sócio Majoritário
                   </p>
                </div>
                <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                   <div className="bg-gold-600/10 text-gold-500 px-6 py-2.5 rounded-2xl border border-gold-600/20 text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                      <Sparkles size={14} className="animate-pulse" /> Plano Enterprise Alpha
                   </div>
                   <div className="bg-zinc-900 text-zinc-600 px-6 py-2.5 rounded-2xl border border-zinc-800 text-[10px] font-black uppercase tracking-widest">
                      ID: STAR-88229
                   </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-3 group">
                <label className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em] flex items-center gap-3 ml-1 group-focus-within:text-gold-500 transition-colors"><Mail size={14}/> Credencial Master</label>
                <input type="email" defaultValue="carlos.silva@starjus.com.br" className="w-full px-8 py-5 bg-zinc-950 border border-zinc-900 rounded-[2rem] text-sm font-black text-white outline-none focus:ring-1 focus:ring-gold-500 transition-all shadow-inner" />
              </div>
              <div className="space-y-3 group">
                <label className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em] flex items-center gap-3 ml-1 group-focus-within:text-gold-500 transition-colors"><Phone size={14}/> Canal Direto</label>
                <input type="text" defaultValue="+55 (11) 99887-7665" className="w-full px-8 py-5 bg-zinc-950 border border-zinc-900 rounded-[2rem] text-sm font-black text-white outline-none focus:ring-1 focus:ring-gold-500 transition-all shadow-inner" />
              </div>
            </div>
            
            <div className="space-y-3 group">
                <label className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em] flex items-center gap-3 ml-1 group-focus-within:text-gold-500 transition-colors"><Globe size={14}/> Perfil Profissional & BI</label>
                <textarea className="w-full px-8 py-6 bg-zinc-950 border border-zinc-900 rounded-[3rem] text-sm font-bold text-zinc-400 outline-none focus:ring-1 focus:ring-gold-500 transition-all shadow-inner leading-relaxed resize-none" rows={3}>Sócio especializado em Litígios de Alta Complexidade e Governança Tributária. Responsável pela estratégia de expansão do ecossistema Silva & Associados.</textarea>
            </div>
          </div>
        )}

        {activeTab === 'office' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="bg-black p-12 rounded-[4rem] text-white shadow-3xl relative overflow-hidden group border border-gold-500/10">
               <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/10 rounded-full blur-[100px]" />
               <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-4">
                     <div className="bg-gold-500/20 p-3 rounded-2xl border border-gold-500/20 shadow-2xl"><Sparkles className="text-gold-400" size={20}/></div>
                     <span className="text-[11px] font-black uppercase tracking-[0.5em] text-gold-500">Tier: Platinum Authority</span>
                  </div>
                  <h3 className="text-5xl font-black tracking-tighter leading-none italic font-serif gold-gradient-text">Silva & Associados.</h3>
                  <div className="flex items-center gap-6 text-zinc-600 text-[10px] font-black uppercase tracking-widest">
                     <div className="flex items-center gap-2"><Users size={16} className="text-gold-600" /> 12 Operadores Ativos</div>
                     <div className="w-1.5 h-1.5 bg-zinc-800 rounded-full" />
                     <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-gold-500" /> Validação Tier 1</div>
                  </div>
               </div>
            </div>

            <div className="space-y-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em] ml-1">CNPJ Institucional</label>
                  <input type="text" defaultValue="12.345.678/0001-90" className="w-full px-8 py-5 bg-zinc-950 border border-zinc-900 rounded-3xl text-sm font-black text-zinc-400 outline-none focus:ring-1 focus:ring-gold-500 transition-all" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em] ml-1">Assinatura Enterprise</label>
                  <div className="w-full px-8 py-5 bg-gold-600/5 border border-gold-600/20 rounded-3xl flex items-center justify-between text-[11px] font-black text-gold-500 uppercase tracking-widest">
                     <span>Faturamento: 12/Nov</span>
                     <button className="hover:text-white transition-colors">Ledger</button>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                 <h4 className="text-[11px] font-black text-zinc-700 uppercase tracking-[0.4em] ml-1 flex items-center gap-3">
                   <Users size={18} className="text-gold-600" /> Corpo Jurídico Monitorado
                 </h4>
                 <div className="grid grid-cols-1 gap-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="flex items-center justify-between p-6 bg-zinc-950 rounded-[2.5rem] border border-zinc-900 hover:border-gold-500/20 transition-all cursor-pointer group shadow-sm">
                        <div className="flex items-center gap-6">
                           <img src={`https://i.pravatar.cc/150?img=${i+24}`} className="w-14 h-14 rounded-[1.8rem] shadow-3xl border border-zinc-800 grayscale group-hover:grayscale-0 transition-all" alt="Team" />
                           <div>
                              <p className="text-base font-black text-white group-hover:text-gold-500 transition-colors">Dra. Beatriz Santos</p>
                              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-1">Socia Júnior • OAB/SP 44.112</p>
                           </div>
                        </div>
                        <ChevronRight className="text-zinc-800 group-hover:text-gold-500 transition-all" size={24} />
                      </div>
                    ))}
                 </div>
                 <button className="w-full py-6 bg-zinc-950 border-2 border-dashed border-zinc-900 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.3em] text-zinc-700 hover:text-gold-500 hover:border-gold-500/40 hover:bg-zinc-900 transition-all">
                    + Recrutar Novo Operador
                 </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-left-4 duration-500">
             <div className="p-10 bg-red-500/5 rounded-[3rem] border border-red-500/10 flex items-start gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-[60px]" />
                <div className="p-5 bg-zinc-950 rounded-3xl shadow-3xl text-red-500 border border-red-500/20 relative z-10"><ShieldAlert size={40}/></div>
                <div className="space-y-2 pt-1 relative z-10">
                   <h4 className="text-base font-black text-red-500 uppercase tracking-tight">Criptografia Nível Enterprise Ativa</h4>
                   <p className="text-xs text-zinc-600 leading-relaxed font-bold">Sua conexão está sob protocolo de segurança zero-trust. Recomendamos autenticação 2FA via token biométrico.</p>
                </div>
             </div>

             <div className="space-y-10">
                <div className="space-y-3 group">
                   <label className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em] ml-1 group-focus-within:text-gold-500 transition-colors">Senha de Autoridade</label>
                   <div className="relative">
                      <Key className="absolute left-6 top-5 text-zinc-800" size={20} />
                      <input type="password" placeholder="••••••••••••" className="w-full pl-16 pr-8 py-5.5 bg-zinc-950 border border-zinc-900 rounded-[2.2rem] text-sm font-black text-white focus:ring-1 focus:ring-gold-500 transition-all outline-none shadow-inner" />
                   </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-8">
                   <div className="flex-1 p-8 bg-zinc-950 border border-zinc-900 rounded-[3rem] shadow-sm flex items-center justify-between group hover:border-gold-500/20 transition-all">
                      <div className="flex items-center gap-5">
                         <div className="w-3 h-3 bg-gold-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(212,175,55,0.6)]" />
                         <span className="text-[11px] font-black text-white uppercase tracking-widest">2FA Multi-Level</span>
                      </div>
                      <button className="text-[10px] font-black text-gold-600 uppercase tracking-[0.2em] hover:text-white transition-colors">Config</button>
                   </div>
                   <div className="flex-1 p-8 bg-zinc-950 border border-zinc-900 rounded-[3rem] shadow-sm flex items-center justify-between group hover:border-gold-500/20 transition-all">
                      <div className="flex items-center gap-5">
                         <div className="w-3 h-3 bg-zinc-800 rounded-full group-hover:bg-gold-500 transition-all" />
                         <span className="text-[11px] font-black text-white uppercase tracking-widest">Acessos Ativos</span>
                      </div>
                      <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest font-mono">02 Nodes</span>
                   </div>
                </div>
             </div>
          </div>
        )}

        <div className="pt-12 border-t border-zinc-900 flex flex-col sm:flex-row gap-6">
          <button 
            onClick={onLogout}
            className="flex-1 flex items-center justify-center gap-4 py-6 bg-zinc-950 text-zinc-700 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.3em] hover:bg-red-500/10 hover:text-red-500 transition-all border border-zinc-900 hover:border-red-500/20"
          >
            <LogOut size={20} /> Terminar Sessão
          </button>
          <button 
            onClick={onClose}
            className="flex-[2] flex items-center justify-center gap-4 py-6 bg-white text-black rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.3em] hover:bg-gold-500 shadow-3xl transition-all active:scale-95"
          >
            <Save size={20} /> Efetivar Governança
          </button>
        </div>
      </div>
    </Modal>
  );
};
