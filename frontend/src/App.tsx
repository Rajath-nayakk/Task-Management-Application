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

export const App: React.FC = () => {
  return (
    <CyberThemeProvider>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <TaskProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/dashboard" element={<CommandCenterPage />} />
                  <Route path="/tasks" element={<OperationsPage />} />
                  <Route path="/analytics" element={<IntelligencePage />} />
                  <Route path="/agents" element={<AgentNetworkPage />} />
                  <Route path="/systems" element={<SystemsPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                <ToastContainer />
              </BrowserRouter>
            </TaskProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </CyberThemeProvider>
  );
};

export default App;
