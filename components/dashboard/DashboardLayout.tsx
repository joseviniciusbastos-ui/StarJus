import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, Building2, Scale, DollarSign, BarChart3, Shield, MapPin, ChevronRight, MessageSquare,
  Calendar, MoreVertical, Star, UserCheck, Smartphone, Sparkles, User, Settings, LogOut, Moon, Sun, Menu, X, Clock, Play, Pause, Search, Bell, Mail, Trash2, Send, Inbox, Archive
} from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { useTimer } from '../../lib/TimerContext';
import toast from 'react-hot-toast';

interface DashboardLayoutProps {
  children: React.ReactNode;
  onLogout?: () => void;
  isDark?: boolean;
  onToggleTheme?: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  onLogout,
  isDark = true,
  onToggleTheme,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { officeName, userRole } = useAuth();
  const { time, isTimerActive, isPaused, start, pause, resume, formatTime } = useTimer();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    toast.success(`Pesquisando por: ${searchQuery}`, {
      icon: '🔍',
      style: { borderRadius: '1rem', background: '#000', color: '#fff', fontSize: '10px', fontWeight: 'bold' }
    });
  };

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/productivity', icon: BarChart3, label: 'Produtividade' },
    { path: '/clients', icon: Users, label: 'Clientes' },
    { path: '/condos', icon: Building2, label: 'Condomínios' },
    { path: '/processes', icon: Scale, label: 'Processos' },
    { path: '/calendar', icon: Calendar, label: 'Agenda' },
    { path: '/financial', icon: DollarSign, label: 'Financeiro' },
    { path: '/reports', icon: BarChart3, label: 'Relatórios' },
    { path: '/audit', icon: Shield, label: 'Auditoria', roles: ['owner', 'manager'] },
    { path: '/email', icon: Mail, label: 'Email' },
    { path: '/profile', icon: User, label: 'Perfil' },
    { path: '/settings', icon: Settings, label: 'Configurações', roles: ['owner', 'manager'] },
  ] as { path: string; icon: any; label: string; roles?: string[] }[];

  const filteredMenuItems = menuItems.filter(item =>
    !item.roles || (userRole && item.roles.includes(userRole))
  );

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[var(--bg-primary)] border-b border-[var(--border-primary)] px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-black text-[var(--text-primary)]">StarJus</h1>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-[var(--text-secondary)]"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-80 bg-[var(--bg-primary)] border-r border-[var(--border-primary)] z-40 transition-transform lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="p-8">
          <h1 className="text-2xl font-black text-[var(--text-primary)] mb-2 cursor-pointer" onClick={() => navigate('/')}>
            Star<span className="gold-gradient-text">Jus</span>
          </h1>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse" />
              <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em]">
                Node Secure
              </span>
            </div>
            {/* Office Name Branding */}
            <span className="text-[9px] font-bold text-[var(--accent-primary)]/60 uppercase tracking-widest mt-1 truncate">
              {officeName || 'Carregando Escritório...'}
            </span>
          </div>
        </div>

        <nav className="px-4 space-y-2 max-h-[calc(100vh-400px)] overflow-y-auto custom-scrollbar">
          {filteredMenuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.label}
                onClick={() => {
                  navigate(item.path);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-6 py-4.5 rounded-3xl transition-all group relative overflow-hidden ${active
                  ? 'bg-[var(--sidebar-active-bg)] text-[var(--accent-primary)] border border-[var(--accent-primary)]/20 shadow-lg'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                  }`}
              >
                <div className="flex items-center gap-4 relative z-10">
                  <item.icon size={20} className={active ? 'text-[var(--accent-primary)]' : 'text-[var(--text-muted)] group-hover:text-[var(--accent-primary)]'} />
                  <span className="text-[11px] font-black uppercase tracking-[0.2em]">{item.label}</span>
                </div>
                {active && (
                  <>
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[var(--accent-primary)] rounded-r-full shadow-[0_0_15px_var(--accent-primary)]" />
                    <div className="absolute right-4 w-1.5 h-1.5 bg-[var(--accent-primary)] rounded-full animate-pulse" />
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* Universal Timer Widget in Sidebar */}
        {isTimerActive && (
          <div className="px-6 py-4 mx-4 mb-4 mt-6 bg-black dark:bg-zinc-900 rounded-2xl border border-gold-500/20 shadow-2xl animate-in slide-in-from-left duration-500">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gold-500/10 flex items-center justify-center">
                  <Clock size={14} className="text-gold-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] font-mono font-black text-white">{formatTime(time)}</span>
                  <span className="text-[8px] font-black text-gold-500/60 uppercase tracking-widest">Tempo Ativo</span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  isPaused ? resume() : pause();
                }}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all"
              >
                {isPaused ? <Play size={16} fill="white" /> : <Pause size={16} fill="white" />}
              </button>
            </div>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2 border-t border-slate-200 dark:border-zinc-900">
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm text-slate-600 dark:text-zinc-500 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-all"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
              <span>{isDark ? 'Modo Claro' : 'Modo Escuro'}</span>
            </button>
          )}
          {onLogout && (
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
            >
              <LogOut size={20} />
              <span>Sair</span>
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-80 min-h-screen">
        {/* Top Handler Bar */}
        <header className="sticky top-0 right-0 z-30 bg-white/90 dark:bg-black/90 backdrop-blur-xl border-b border-slate-200 dark:border-zinc-900 px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <form onSubmit={handleSearch} className="hidden md:flex items-center gap-3 px-4 py-2 bg-slate-100 dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 focus-within:border-gold-500 transition-all">
              <Search size={18} className="text-slate-400" />
              <input
                type="text"
                placeholder="Pesquisar processos, clientes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm font-bold text-slate-600 dark:text-zinc-300 w-64"
              />
            </form>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end mr-4">
              <span className="text-xs font-black text-slate-950 dark:text-white">{officeName || 'StarJus Office'}</span>
              <span className="text-[10px] font-bold text-gold-600 uppercase tracking-widest">{userRole || 'Carregando...'}</span>
            </div>
            <button
              onClick={() => toast('Você não possui novas notificações.', { icon: '🔔' })}
              className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-zinc-900 flex items-center justify-center text-slate-600 dark:text-zinc-400 hover:text-gold-500 transition-all"
            >
              <Bell size={20} />
            </button>
            <div className="w-10 h-10 rounded-xl bg-gold-500 flex items-center justify-center text-black font-black text-sm">
              {officeName?.[0] || 'S'}
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-12">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};
