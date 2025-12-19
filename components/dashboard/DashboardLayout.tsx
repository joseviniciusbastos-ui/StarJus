
import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  CircleDollarSign,
  Scale,
  Menu,
  Bell,
  Zap,
  Building2,
  PieChart,
  ChevronRight,
  CloudSun,
  Clock as ClockIcon,
  TrendingUp,
  ExternalLink,
  Sun,
  Moon,
  ZapIcon,
  Shield,
  Mail
} from 'lucide-react';
import { ProfileModal } from './ProfileModal';
import { Logo } from '../ui/Logo';
import { QuickActionModal } from './QuickActionModal';
import { useAuth } from '../../lib/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
  currentSubView: string;
  onSubViewChange: (view: any) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="hidden sm:flex flex-col items-end shrink-0">
      <div className="flex items-center gap-2 text-slate-950 dark:text-white">
        <ClockIcon size={14} className="text-gold-500" />
        <span className="text-sm font-black font-mono tracking-tighter">
          {time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
      </div>
      <span className="text-[9px] font-black text-slate-500 dark:text-zinc-700 uppercase tracking-widest">Sincronizado</span>
    </div>
  );
};

const WeatherWidget = () => {
  const [temp, setTemp] = useState<number | null>(null);
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&current_weather=true`);
          const data = await res.json();
          setTemp(Math.round(data.current_weather.temperature));
        } catch (e) { setTemp(24); }
      }, () => setTemp(22));
    }
  }, []);
  return (
    <div className="hidden lg:flex items-center gap-4 px-5 py-2.5 bg-slate-100 dark:bg-zinc-900/50 rounded-2xl border border-slate-200 dark:border-zinc-800 shrink-0">
      <CloudSun size={18} className="text-gold-500" />
      <div className="flex flex-col">
        <span className="text-[10px] font-black text-slate-950 dark:text-white uppercase tracking-tighter leading-none mb-1">Local Ativo</span>
        <span className="text-[9px] font-bold text-slate-500 dark:text-zinc-600 uppercase">{temp ? `${temp}°C • Tempo Real` : '--°C'}</span>
      </div>
    </div>
  );
};

const NewsTicker = () => {
  const news = [
    { title: "STF mantém exclusão do ICMS na base do PIS/Cofins.", url: "https://portal.stf.jus.br" },
    { title: "Nova Lei de Condomínios: Impacto na inadimplência.", url: "https://www.conjur.com.br" },
    { title: "TJSP acelera digitalização de processos pendentes.", url: "https://www.tjsp.jus.br" },
    { title: "Senado discute reforma estratégica do Código Civil.", url: "https://www12.senado.leg.br" }
  ];
  return (
    <div className="hidden xl:flex items-center flex-1 max-w-2xl mx-8 bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900 rounded-2xl overflow-hidden h-12">
      <div className="z-20 bg-red-600 px-4 h-full flex items-center gap-2 shrink-0 shadow-lg">
        <TrendingUp size={14} className="text-white animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-widest text-white">NEWS</span>
      </div>
      <div className="flex-1 overflow-hidden relative">
        <div className="flex gap-16 animate-marquee whitespace-nowrap items-center h-full">
          {[...news, ...news].map((item, i) => (
            <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[10px] font-black text-slate-600 dark:text-zinc-500 hover:text-gold-500 transition-colors uppercase">
              {item.title} <ExternalLink size={10} className="opacity-40" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children, onLogout, currentSubView, onSubViewChange, isDark, onToggleTheme
}) => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);

  const navigation = [
    { id: 'dashboard_main', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'productivity_hub', name: 'Produtividade', icon: Zap },
    { id: 'clients', name: 'Clientes', icon: Users },
    { id: 'condos', name: 'Condomínios', icon: Building2 },
    { id: 'processes', name: 'Processos', icon: Scale },
    { id: 'financial', name: 'Financeiro', icon: CircleDollarSign },
    { id: 'corporate_email', name: 'E-mail Corporativo', icon: Mail },
    { id: 'reports', name: 'Métricas BI', icon: PieChart },
    { id: 'audit_logs', name: 'Auditoria Alpha', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black flex font-sans text-slate-950 dark:text-zinc-100 transition-colors duration-500">
      <div className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity lg:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsSidebarOpen(false)} />
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white dark:bg-black border-r border-slate-200 dark:border-zinc-900 transform transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}>
        <div className="h-full flex flex-col">
          <div className="h-28 flex items-center px-10">
            <Logo size={40} textColor="text-slate-950 dark:text-white" />
          </div>
          <nav className="flex-1 px-6 space-y-1.5 overflow-y-auto custom-scrollbar">
            {navigation.map((item) => (
              <button key={item.id} onClick={() => { onSubViewChange(item.id); setIsSidebarOpen(false); }} className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all group ${currentSubView === item.id ? 'bg-gold-600/10 text-gold-600 border border-gold-600/30 shadow-sm' : 'text-slate-500 dark:text-zinc-600 hover:text-slate-950 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-900'}`}>
                <div className="flex items-center">
                  <item.icon className="mr-4 h-5 w-5" />
                  <span className="text-[11px] font-black uppercase tracking-widest">{item.name}</span>
                </div>
                {currentSubView === item.id && <div className="w-1.5 h-1.5 bg-gold-600 rounded-full" />}
              </button>
            ))}
          </nav>
          <div className="p-6">
            <button onClick={() => setIsProfileModalOpen(true)} className="w-full flex items-center gap-4 p-5 rounded-3xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 transition-all hover:border-gold-500 group">
              <div className="w-10 h-10 rounded-2xl bg-zinc-800 flex items-center justify-center text-gold-500 font-black">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-xs font-black text-slate-950 dark:text-white truncate">{user?.user_metadata?.full_name || 'Operador Alpha'}</p>
                <p className="text-[9px] font-bold text-slate-500 dark:text-zinc-700 uppercase">Sessão Ativa</p>
              </div>
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-24 md:h-28 border-b border-slate-200 dark:border-zinc-900 flex items-center justify-between px-6 md:px-10 bg-white/95 dark:bg-black/95 backdrop-blur-xl z-30 transition-colors">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-3 bg-slate-100 dark:bg-zinc-900 rounded-xl"><Menu size={20} /></button>
            <WeatherWidget />
            <NewsTicker />
          </div>
          <div className="flex items-center gap-4 md:gap-8 shrink-0">
            <DigitalClock />
            <div className="flex items-center gap-2 md:gap-3">
              <button onClick={onToggleTheme} className="p-2.5 bg-slate-100 dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-500 hover:text-gold-500 transition-all">
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button onClick={() => setIsQuickActionOpen(true)} className="p-2.5 bg-gold-600/10 rounded-xl border border-gold-600/30 text-gold-600 hover:bg-gold-500 hover:text-white transition-all">
                <ZapIcon size={18} />
              </button>
              <button className="relative p-2.5 bg-slate-100 dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800">
                <Bell size={18} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full border border-white" />
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-[1600px] mx-auto p-6 md:p-10 lg:p-16">{children}</div>
        </main>
      </div>
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} onLogout={onLogout} />
      <QuickActionModal isOpen={isQuickActionOpen} onClose={() => setIsQuickActionOpen(false)} />
    </div>
  );
};
