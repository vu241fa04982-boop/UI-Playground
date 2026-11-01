import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { PlaygroundProvider } from './context/PlaygroundContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Toast } from './components/common/Toast';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { PlaygroundPage } from './pages/PlaygroundPage';
import { SavedPage } from './pages/SavedPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PlaygroundProvider>
          <BrowserRouter>
            <div className="flex min-h-screen flex-col bg-[#020817] font-sans text-slate-100 transition-colors duration-200">
              <Navbar />

              <main className="flex-1">
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />

                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <HomePage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/home"
                    element={
                      <ProtectedRoute>
                        <HomePage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/playground"
                    element={
                      <ProtectedRoute>
                        <PlaygroundPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/saved"
                    element={
                      <ProtectedRoute>
                        <SavedPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <SettingsPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>

              <Footer />
              <Toast />
            </div>
          </BrowserRouter>
        </PlaygroundProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;