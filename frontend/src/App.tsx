import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CyberThemeProvider } from './context/CyberThemeContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { ToastContainer } from './components/common/ToastContainer';

// Tactical Cyberpunk Pages
import { LandingPage } from './pages/LandingPage';
import { CommandCenterPage } from './pages/CommandCenterPage';
import { OperationsPage } from './pages/OperationsPage';
import { IntelligencePage } from './pages/IntelligencePage';
import { AgentNetworkPage } from './pages/AgentNetworkPage';
import { SystemsPage } from './pages/SystemsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

import { SocketProvider } from './context/SocketContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AdminRoute } from './components/common/AdminRoute';

export const App: React.FC = () => {
  return (
    <CyberThemeProvider>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <SocketProvider>
              <TaskProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <CommandCenterPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/tasks"
                    element={
                      <ProtectedRoute>
                        <OperationsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/analytics"
                    element={
                      <ProtectedRoute>
                        <IntelligencePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/agents"
                    element={
                      <AdminRoute>
                        <AgentNetworkPage />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/systems"
                    element={
                      <ProtectedRoute>
                        <SystemsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                <ToastContainer />
              </BrowserRouter>
            </TaskProvider>
          </SocketProvider>
        </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </CyberThemeProvider>
  );
};

export default App;
