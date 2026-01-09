import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { DashboardHome } from './components/dashboard/DashboardHome';
import { OfficeSettingsPage } from './components/dashboard/OfficeSettingsPage';
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
              <DashboardHome />
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

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <OfficeSettingsPage />
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
