import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Building2, Scale, DollarSign, BarChart3, Shield, Mail, LogOut, Moon, Sun, Menu, X } from 'lucide-react';
import type { SubView } from '../App';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/productivity', icon: BarChart3, label: 'Produtividade' },
    { path: '/clients', icon: Users, label: 'Clientes' },
    { path: '/condos', icon: Building2, label: 'Condomínios' },
    { path: '/processes', icon: Scale, label: 'Processos' },
    { path: '/financial', icon: DollarSign, label: 'Financeiro' },
    { path: '/reports', icon: BarChart3, label: 'Relatórios' },
    { path: '/audit', icon: Shield, label: 'Auditoria' },
    { path: '/email', icon: Mail, label: 'Email' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black transition-colors">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-900 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-black text-slate-950 dark:text-white">StarJus</h1>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-600 dark:text-zinc-400"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-80 bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-zinc-900 z-40 transition-transform lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="p-8">
          <h1 className="text-2xl font-black text-slate-950 dark:text-white mb-2">
            Star<span className="gold-gradient-text">Jus</span>
          </h1>
          <p className="text-xs font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest">
            Sistema Alpha
          </p>
        </div>

        <nav className="px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm transition-all ${isActive(item.path)
                  ? 'bg-gold-500 text-black shadow-xl'
                  : 'text-slate-600 dark:text-zinc-500 hover:bg-slate-100 dark:hover:bg-zinc-900'
                }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

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
      <main className="lg:ml-80 min-h-screen p-6 lg:p-12 pt-24 lg:pt-12">
        <div className="max-w-7xl mx-auto">
          {children}
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
