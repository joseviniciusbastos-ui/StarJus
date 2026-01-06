import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Logo } from '../ui/Logo';
import { supabase } from '../../lib/supabase';

interface LoginPageProps {
  onLogin: () => void;
  onRegisterClick: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onRegisterClick }) => {
  const [isRecoverModalOpen, setIsRecoverModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      onLogin();
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) setError(error.message);
  };

  return (
    <div className="min-h-screen flex bg-obsidian-900 font-sans selection:bg-gold-500 selection:text-black">
      {/* Esquerda: Prestige Image */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=2000"
          className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale"
          alt="Luxury Office"
        />
        <div className="relative z-20 flex flex-col justify-between p-24 h-full">
          <Logo size={96} textColor="text-white" />

          <div className="space-y-8 max-w-xl animate-fade-in-up">
            <h2 className="text-7xl font-black text-white leading-none tracking-tighter">
              A Excelência é <br />
              <span className="gold-gradient-text">Inquestionável.</span>
            </h2>
            <p className="text-zinc-500 text-xl font-medium leading-relaxed">
              O sistema operacional definitivo para advocacia de alta performance e gestão de ativos estratégicos.
            </p>
            <div className="flex items-center gap-4 text-gold-600/80">
              <ShieldCheck size={24} />
              <span className="text-xs font-black uppercase tracking-[0.4em]">Protocolos Nível Enterprise</span>
            </div>
          </div>
        </div>
      </div>

      {/* Direita: Auth Form */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-12 bg-zinc-950">
        <div className="w-full max-w-sm space-y-12 animate-fade-in-up">
          <div className="lg:hidden flex justify-center mb-12">
            <Logo size={40} />
          </div>

          <div className="space-y-2">
            <h3 className="text-3xl font-black text-white tracking-tight">Login</h3>
            <p className="text-zinc-500 text-sm font-medium">Autenticação de operador autorizada.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-1.5 group">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1 group-focus-within:text-gold-500 transition-colors">Credencial de E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-4 h-4 w-4 text-zinc-700 group-focus-within:text-gold-500 transition-colors" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl focus:ring-1 focus:ring-gold-500 focus:border-gold-500 text-white transition-all outline-none"
                    placeholder="operador@starjus.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5 group">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest group-focus-within:text-gold-500 transition-colors">Senha</label>
                  <button type="button" onClick={() => setIsRecoverModalOpen(true)} className="text-[10px] font-black text-gold-600 hover:text-gold-400 tracking-widest uppercase">Recuperar</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-4 h-4 w-4 text-zinc-700 group-focus-within:text-gold-500 transition-colors" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl focus:ring-1 focus:ring-gold-500 focus:border-gold-500 text-white transition-all outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-5 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 hover:from-gold-400 hover:via-gold-300 hover:to-gold-400 text-black rounded-2xl shadow-[0_20px_50px_-15px_rgba(212,175,55,0.5)] font-black uppercase tracking-widest text-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed border-2 border-gold-400/50"
            >
              {loading ? "AUTENTICANDO..." : "ACESSAR PAINEL"}
              {!loading && <ArrowRight size={20} className="animate-pulse" />}
            </button>
          </form>

          <div className="text-center pt-8 border-t border-zinc-900">
            <p className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4">NOVO MEMBRO?</p>
            <button
              onClick={onRegisterClick}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gold-500 text-black rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg"
            >
              CRIAR CONTA AGORA
              <ArrowRight size={18} className="animate-pulse" />
            </button>
          </div>
        </div>
      </div>

      <Modal isOpen={isRecoverModalOpen} onClose={() => setIsRecoverModalOpen(false)} title="Segurança">
        <div className="space-y-6 text-white">
          <p className="text-zinc-400 text-sm leading-relaxed">Instruções de redefinição serão enviadas para o seu canal criptografado.</p>
          <input className="w-full px-5 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-white outline-none focus:ring-1 focus:ring-gold-500" placeholder="E-mail de Cadastro" />
          <button onClick={() => setIsRecoverModalOpen(false)} className="w-full py-4 bg-gold-600 text-black font-black uppercase text-[10px] tracking-widest rounded-2xl">Enviar Token</button>
        </div>
      </Modal>
    </div>
  );
};
