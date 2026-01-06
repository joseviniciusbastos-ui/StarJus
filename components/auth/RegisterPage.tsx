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
  const [showSuccess, setShowSuccess] = useState(false);
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
        emailRedirectTo: 'https://www.starjus.com.br',
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
      setShowSuccess(true);
      setLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-6 relative overflow-hidden selection:bg-gold-500/30 selection:text-white">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gold-600/5 -skew-x-12 transform translate-x-20 z-0" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-500/10 rounded-full blur-[160px] z-0" />

        <div className="relative z-10 w-full max-w-2xl bg-zinc-900/90 backdrop-blur-2xl rounded-[3.5rem] p-12 md:p-20 shadow-[0_0_100px_-20px_rgba(0,0,0,0.8),0_0_40px_-15px_rgba(212,175,55,0.2)] border border-zinc-800/50 text-center space-y-10 animate-fade-in">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gold-500/20 blur-2xl rounded-full" />
              <Logo size={120} showText={false} />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter italic font-serif">Adesão Confirmada.</h2>
            <p className="text-zinc-400 font-medium max-w-md mx-auto leading-relaxed">
              O ecossistema digital do <span className="text-white font-bold">{formData.officeName}</span> foi ativado. Enviamos um token de segurança para seu e-mail.
            </p>
          </div>

          <div className="bg-black/40 border border-zinc-800/50 rounded-3xl p-8 space-y-6 text-left max-w-md mx-auto">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center border border-gold-500/20">
                <User size={18} className="text-gold-500" />
              </div>
              <div>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Operador</p>
                <p className="text-sm text-white font-bold">{formData.fullName}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center border border-gold-500/20">
                <BadgeCheck size={18} className="text-gold-500" />
              </div>
              <div>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">OAB</p>
                <p className="text-sm text-white font-bold">{formData.oab}</p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={onBackToLogin}
              className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-black rounded-full font-black uppercase tracking-[0.2em] text-[11px] transition-all hover:scale-105 active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-500/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              Acessar Portal <ArrowRight size={18} />
            </button>
          </div>

          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">StarJus Legal Intelligence</p>
        </div>
      </div>
    );
  }

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

            <div className="flex items-start gap-4 bg-black/40 p-6 rounded-[2rem] border border-zinc-800 hover:border-zinc-700 transition-colors">
              <input
                id="terms"
                type="checkbox"
                required
                className="h-5 w-5 mt-1 text-gold-600 focus:ring-gold-500 border-zinc-700 bg-zinc-900 rounded-xl cursor-pointer transition-all"
              />
              <label htmlFor="terms" className="text-xs text-zinc-500 leading-relaxed font-medium cursor-pointer">
                Declaro ciência dos <span className="text-gold-500 font-extrabold uppercase tracking-widest text-[9px]">Termos de Uso</span> e autorizo o processamento de dados sob as diretrizes da <span className="text-gold-500 font-extrabold uppercase tracking-widest text-[9px]">LGPD Enterprise</span>.
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
              className={`group relative w-full flex items-center justify-center gap-3 py-6 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-black rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(212,175,55,0.3)] font-black uppercase tracking-[0.2em] text-[11px] transition-all hover:scale-[1.02] hover:shadow-[0_25px_50px_-12px_rgba(212,175,55,0.4)] active:scale-[0.98] overflow-hidden ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              {loading ? (
                <>
                  <div className="w-5 h-5 border-[3px] border-black/30 border-t-black rounded-full animate-spin" />
                  Sincronizando...
                </>
              ) : (
                <>
                  Confirmar Adesão
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
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
