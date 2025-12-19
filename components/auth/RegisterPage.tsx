import React, { useState } from 'react';
import { Building2, User, Mail, Lock, BadgeCheck, ArrowLeft, ArrowRight } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { supabase } from '../../lib/supabase';

interface RegisterPageProps {
  onRegisterSuccess: () => void;
  onBackToLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onRegisterSuccess, onBackToLogin }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    officeName: '',
    oab: '',
    fullName: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Sign Up User with metadata that triggers automatic office creation
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          office_name: formData.officeName,
          oab: formData.oab
        }
      }
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      // Office and Member are automatically created by DB Trigger
      onRegisterSuccess();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6 relative overflow-hidden selection:bg-gold-500/30 selection:text-white">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gold-600/5 -skew-x-12 transform translate-x-20 z-0" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-500/10 rounded-full blur-[160px] z-0" />

      <div className="relative z-10 w-full max-w-4xl bg-zinc-900/90 backdrop-blur-2xl rounded-[3rem] shadow-[0_0_100px_-20px_rgba(0,0,0,0.8),0_0_40px_-15px_rgba(212,175,55,0.1)] border border-zinc-800/50 overflow-hidden flex flex-col md:flex-row">
        {/* Progress Sidebar (Desktop) */}
        <div className="hidden md:flex w-64 bg-black p-12 flex-col justify-between border-r border-zinc-800">
          <Logo size={48} showText={false} />
          <div className="space-y-10">
            <div className="flex flex-col gap-3">
              <div className="h-[2px] w-10 bg-gold-500 rounded-full" />
              <p className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Passo 01</p>
              <p className="text-xs text-zinc-500 font-bold leading-tight">Identidade Institucional</p>
            </div>
            <div className="flex flex-col gap-3 opacity-30">
              <div className="h-[2px] w-10 bg-zinc-700 rounded-full" />
              <p className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Passo 02</p>
              <p className="text-xs text-zinc-500 font-bold leading-tight">Governança Digital</p>
            </div>
          </div>
          <button onClick={onBackToLogin} className="flex items-center gap-2 text-[10px] font-black text-zinc-600 hover:text-gold-500 uppercase tracking-widest transition-all">
            <ArrowLeft size={16} /> Voltar
          </button>
        </div>

        <div className="flex-1 p-10 md:p-16 bg-zinc-900/50 backdrop-blur-xl">
          <div className="mb-12 text-center md:text-left space-y-3 animate-fade-in-up">
            <h2 className="text-4xl font-black text-white tracking-tighter leading-none italic font-serif">Aderir ao Ecossistema.</h2>
            <p className="text-zinc-500 font-medium">Inicie o registro estratégico do seu escritório.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="sm:col-span-2 space-y-2 group">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] ml-1 group-focus-within:text-gold-500 transition-colors">Razão Social / Nome Fantasia</label>
                <div className="relative">
                  <Building2 size={18} className="absolute left-5 top-4 text-zinc-700 group-focus-within:text-gold-500 transition-colors" />
                  <input
                    required
                    type="text"
                    value={formData.officeName}
                    onChange={(e) => setFormData({ ...formData, officeName: e.target.value })}
                    className="block w-full pl-14 pr-6 py-4 bg-black/60 border border-zinc-800/80 rounded-2xl focus:ring-1 focus:ring-gold-500/50 focus:border-gold-500/50 outline-none text-white font-bold transition-all placeholder:text-zinc-700"
                    placeholder="Ex: Silva & Associados"
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] ml-1 group-focus-within:text-gold-500 transition-colors">OAB Principal</label>
                <div className="relative">
                  <BadgeCheck size={18} className="absolute left-5 top-4 text-zinc-700 group-focus-within:text-gold-500 transition-colors" />
                  <input
                    required
                    type="text"
                    value={formData.oab}
                    onChange={(e) => setFormData({ ...formData, oab: e.target.value })}
                    className="block w-full pl-14 pr-6 py-4 bg-black/60 border border-zinc-800/80 rounded-2xl focus:ring-1 focus:ring-gold-500/50 focus:border-gold-500/50 outline-none text-white font-bold transition-all placeholder:text-zinc-700"
                    placeholder="SP-123.456"
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] ml-1 group-focus-within:text-gold-500 transition-colors">Operador Responsável</label>
                <div className="relative">
                  <User size={18} className="absolute left-5 top-4 text-zinc-700 group-focus-within:text-gold-500 transition-colors" />
                  <input
                    required
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="block w-full pl-14 pr-6 py-4 bg-black/60 border border-zinc-800/80 rounded-2xl focus:ring-1 focus:ring-gold-500/50 focus:border-gold-500/50 outline-none text-white font-bold transition-all placeholder:text-zinc-700"
                    placeholder="Dr. Nome Sobrenome"
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] ml-1 group-focus-within:text-gold-500 transition-colors">E-mail Corporativo</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-5 top-4 text-zinc-700 group-focus-within:text-gold-500 transition-colors" />
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="block w-full pl-14 pr-6 py-4 bg-black/60 border border-zinc-800/80 rounded-2xl focus:ring-1 focus:ring-gold-500/50 focus:border-gold-500/50 outline-none text-white font-bold transition-all placeholder:text-zinc-700"
                    placeholder="advogado@office.com"
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] ml-1 group-focus-within:text-gold-500 transition-colors">Senha de Autoridade</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-5 top-4 text-zinc-700 group-focus-within:text-gold-500 transition-colors" />
                  <input
                    required
                    type="password"
                    title="Mínimo 8 caracteres"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="block w-full pl-14 pr-6 py-4 bg-black/60 border border-zinc-800/80 rounded-2xl focus:ring-1 focus:ring-gold-500/50 focus:border-gold-500/50 outline-none text-white font-bold transition-all placeholder:text-zinc-700"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-black/40 p-6 rounded-[2rem] border border-zinc-800">
              <input
                id="terms"
                type="checkbox"
                required
                className="h-5 w-5 mt-1 text-gold-600 focus:ring-gold-500 border-zinc-700 bg-zinc-900 rounded-lg cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs text-zinc-500 leading-relaxed font-medium cursor-pointer">
                Declaro ciência dos <span className="text-gold-500 font-black uppercase tracking-widest text-[9px]">Termos de Uso</span> e autorizo o processamento de dados sob as diretrizes da <span className="text-gold-500 font-black uppercase tracking-widest text-[9px]">LGPD Enterprise</span>.
              </label>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl animate-fade-in-up">
                <p className="text-xs text-red-500 font-bold text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-3 py-6 bg-gradient-to-r from-gold-600 to-gold-700 hover:from-gold-500 hover:to-gold-600 text-black rounded-[2rem] shadow-2xl shadow-gold-900/10 font-black uppercase tracking-[0.2em] text-[11px] transition-all active:scale-[0.98] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  Confirmar Adesão
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center md:hidden">
            <button onClick={onBackToLogin} className="text-[10px] font-black text-zinc-600 hover:text-gold-500 uppercase tracking-widest transition-all">
              Já possui conta? Acessar Portal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
