import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
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
import { EmailModule } from './components/dashboard/EmailModule';
import { ProfilePage } from './components/dashboard/ProfilePage';
import { AuditLogsPage } from './components/dashboard/AuditLogsPage';
import { CalendarPage } from './components/dashboard/CalendarPage';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { TimerProvider } from './lib/TimerContext';
import { Toaster } from 'react-hot-toast';

// Dashboard Main View
const DashboardMain: React.FC = () => {
  const { session } = useAuth();
  const userName = session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0] || 'Gestor';

  return (
    <div className="space-y-10 md:space-y-12 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gold-600 dark:text-gold-500 leading-none">
              Status: Enterprise Secure Node
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-950 dark:text-white leading-none">
            Dashboard <span className="gold-gradient-text italic font-serif">Operacional.</span>
          </h1>
          <p className="text-slate-600 dark:text-zinc-500 font-bold text-base md:text-lg">
            {userName} • Governança Digital
          </p>
        </div>
      </div>

      <div className="staggered-parent">
        <StatsGrid />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
        <div className="xl:col-span-8">
          {/* AI Banner and other content would go here */}
        </div>
        <div className="xl:col-span-4 h-full">
          <AgendaWidget />
        </div>
      </div>
    </div>
  );
};

// Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
};

// App Routes Component
const AppRoutes: React.FC = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={session ? <Navigate to="/" replace /> : (
          <LoginPage
            onLogin={() => navigate('/')}
            onRegisterClick={() => navigate('/register')}
          />
        )}
      />
      <Route
        path="/register"
        element={session ? <Navigate to="/" replace /> : (
          <RegisterPage
            onRegisterSuccess={() => navigate('/login')}
            onBackToLogin={() => navigate('/login')}
          />
        )}
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardMain />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/productivity"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ProductivityPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/clients"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ClientsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/condos"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CondosPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/processes"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ProcessesPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/processes/:id"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ProcessesPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/financial"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <FinancialPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ReportsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/audit"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <AuditLogsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/email"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <EmailModule />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ProfilePage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Main App Component with Router
const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <TimerProvider>
          <AppRoutes />
        </TimerProvider>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
