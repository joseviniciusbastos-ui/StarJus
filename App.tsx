
import React, { useState, useEffect } from 'react';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { StatsGrid } from './components/dashboard/StatsGrid';
import { AgendaWidget } from './components/dashboard/AgendaWidget';
import { ProcessesPage } from './components/dashboard/ProcessesPage';
import { ClientsPage } from './components/dashboard/ClientsPage';
import { FinancialPage } from './components/dashboard/FinancialPage';
import { ProductivityPage } from './components/dashboard/ProductivityPage';
import { CondosPage } from './components/dashboard/CondosPage';
import { ReportsPage } from './components/dashboard/ReportsPage';
import { AuditLogsPage } from './components/dashboard/AuditLogsPage';
import { EmailModule } from './components/dashboard/EmailModule';
// Added missing Users icon import
import { AlertCircle, TrendingUp, ArrowUpRight, Sparkles, Settings2, Check, X, LayoutGrid, Users, ArrowRight } from 'lucide-react';
import { Modal } from './components/ui/Modal';
import { AuthProvider, useAuth } from './lib/AuthContext';

export type SubView = 'dashboard_main' | 'productivity_hub' | 'clients' | 'condos' | 'processes' | 'financial' | 'reports' | 'audit_logs' | 'corporate_email';

const AppContent: React.FC = () => {
  const { session, loading, signOut } = useAuth();
  const [subView, setSubView] = useState<SubView>('dashboard_main');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [viewState, setViewState] = useState<'login' | 'register'>('login');

  // Dashboard Customization State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeWidgets, setActiveWidgets] = useState({
    stats: true,
    ai_banner: true,
    agenda: true,
    alerts: true
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const changeSubView = (newView: SubView) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSubView(newView);
      setIsTransitioning(false);
    }, 50);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return viewState === 'login'
      ? <LoginPage onLogin={() => { }} onRegisterClick={() => setViewState('register')} />
      : <RegisterPage onRegisterSuccess={() => setViewState('login')} onBackToLogin={() => setViewState('login')} />;
  }

  const handleLogout = () => signOut();

  const renderSubViewContent = () => {
    switch (subView) {
      case 'productivity_hub': return <ProductivityPage />;
      case 'clients': return <ClientsPage />;
      case 'condos': return <CondosPage />;
      case 'processes': return <ProcessesPage />;
      case 'financial': return <FinancialPage />;
      case 'reports': return <ReportsPage />;
      case 'audit_logs': return <AuditLogsPage />;
      case 'corporate_email': return <EmailModule />;
      case 'dashboard_main':
      default:
        return (
          <div className="space-y-10 md:space-y-12 animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gold-600 dark:text-gold-500 leading-none">Status: Node 12-Alpha Secure</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-950 dark:text-white leading-none">
                  Dashboard <span className="gold-gradient-text italic font-serif">Operacional.</span>
                </h1>
                <p className="text-slate-600 dark:text-zinc-500 font-bold text-base md:text-lg">Dr. Carlos Silva • Governança Master</p>
              </div>

              <div className="flex w-full md:w-auto gap-4">
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="flex-1 md:flex-none premium-card p-4 md:p-5 rounded-2xl text-slate-400 hover:text-gold-500 transition-all flex justify-center items-center"
                >
                  <Settings2 size={24} />
                </button>
                {activeWidgets.alerts && (
                  <div className="flex-[3] md:flex-none premium-card px-6 md:px-8 py-4 md:py-5 rounded-2xl flex items-center gap-4 md:gap-5 border-l-4 border-l-red-500">
                    <div className="p-2.5 bg-red-500/10 rounded-xl">
                      <AlertCircle className="text-red-500 animate-pulse" size={20} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest block leading-none mb-1">Prazos Fatais</span>
                      <span className="text-sm font-black text-slate-950 dark:text-white truncate block">03 Críticos</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Grid de Estatísticas: Adaptável 1 -> 2 -> 3 Colunas */}
            {activeWidgets.stats && (
              <div className="staggered-parent">
                <StatsGrid />
              </div>
            )}

            {/* Grid Principal Reorganizado: 1 Coluna em Mobile, 2/3 + 1/3 em Desktop */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
              {activeWidgets.ai_banner && (
                <div className="xl:col-span-8 space-y-10">
                  <div className="premium-card rounded-[3rem] md:rounded-[4rem] p-10 md:p-14 relative overflow-hidden group border-2 border-slate-200 dark:border-zinc-800">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold-600/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                    <div className="flex flex-col md:flex-row items-center gap-10 md:gap-14 relative z-10">
                      <div className="flex-1 space-y-6 md:space-y-8 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-3">
                          <Sparkles size={20} className="text-gold-500" />
                          <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-gold-600 leading-none">Neural Intelligence</h3>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-black text-slate-950 dark:text-white tracking-tighter leading-none">Performance Preditiva do Ecossistema</h3>
                        <p className="text-slate-700 dark:text-zinc-400 leading-relaxed font-bold text-base md:text-lg">
                          Detectamos um aumento de 12% na taxa de conversão em Processos Cíveis. Sugerimos realocar capital para expansão de comarca.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-2">
                          <button
                            onClick={() => changeSubView('reports')}
                            className="bg-black dark:bg-white text-white dark:text-black px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-gold-600 dark:hover:bg-gold-500 shadow-2xl transition-all"
                          >
                            Relatórios Alpha
                          </button>
                          <button className="px-10 py-5 border border-slate-200 dark:border-zinc-800 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-slate-600 dark:text-zinc-500 hover:text-gold-500 hover:border-gold-500 transition-all">
                            Baixar Ledger
                          </button>
                        </div>
                      </div>
                      <div className="p-12 md:p-16 bg-slate-100 dark:bg-zinc-950 rounded-[3.5rem] md:rounded-[4.5rem] border border-slate-200 dark:border-zinc-800 shadow-3xl shrink-0">
                        <TrendingUp size={72} className="text-gold-500 animate-float-slow" />
                      </div>
                    </div>
                  </div>

                  {/* Segunda Coluna de Conteúdo em Desktop (Opcional) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="premium-card p-10 rounded-[3rem] border-slate-200 dark:border-zinc-800 space-y-4">
                      <div className="p-3 bg-zinc-900 rounded-xl w-fit text-gold-500"><LayoutGrid size={20} /></div>
                      <h4 className="text-lg font-black text-slate-950 dark:text-white uppercase tracking-tight">Recursos Digitais</h4>
                      <p className="text-sm text-slate-500 dark:text-zinc-500 font-bold">Acesso rápido aos repositórios de jurisprudência e modelos de petições.</p>
                    </div>
                    <div className="premium-card p-10 rounded-[3rem] border-slate-200 dark:border-zinc-800 space-y-4">
                      <div className="p-3 bg-zinc-900 rounded-xl w-fit text-gold-500"><Users size={20} /></div>
                      <h4 className="text-lg font-black text-slate-950 dark:text-white uppercase tracking-tight">Equipe Conectada</h4>
                      <p className="text-sm text-slate-500 dark:text-zinc-500 font-bold">Existem 12 operadores logados simultaneamente no ecossistema Starjus.</p>
                    </div>
                  </div>
                </div>
              )}
              {activeWidgets.agenda && (
                <div className="xl:col-span-4 h-full">
                  <AgendaWidget />
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <DashboardLayout
      onLogout={handleLogout}
      currentSubView={subView}
      onSubViewChange={changeSubView}
      isDark={isDark}
      onToggleTheme={toggleTheme}
    >
      <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-y-4 blur-sm' : 'opacity-100 translate-y-0 blur-0'}`}>
        {renderSubViewContent()}
      </div>

      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="Personalizar Interface">
        <div className="space-y-8">
          <p className="text-sm font-bold text-slate-500 dark:text-zinc-400">Configure os módulos visíveis do seu Painel Operacional Master.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(activeWidgets).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setActiveWidgets(prev => ({ ...prev, [key]: !val }))}
                className={`flex items-center justify-between p-6 rounded-3xl border transition-all ${val ? 'bg-gold-500/10 border-gold-500 text-gold-600 shadow-xl shadow-gold-900/5' : 'bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-400 dark:text-zinc-600'}`}
              >
                <span className="font-black text-[10px] uppercase tracking-widest">{key.replace('_', ' ')}</span>
                <div className={`w-10 h-6 rounded-full relative transition-all ${val ? 'bg-gold-600' : 'bg-slate-300 dark:bg-zinc-800'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${val ? 'right-1' : 'left-1'}`} />
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="w-full py-6 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase tracking-widest text-[11px] mt-6 shadow-2xl active:scale-95"
          >
            Aplicar Configurações Alpha
          </button>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
