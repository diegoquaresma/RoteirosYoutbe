import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { isSupabaseConfigured } from './lib/supabase';
import { toast } from 'sonner';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    if (!isSupabaseConfigured()) {
      toast.error('Please connect to Supabase using the "Connect to Supabase" button in the top right.');
    }
  }, []);

  if (!isSupabaseConfigured()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  React.useEffect(() => {
    if (!isSupabaseConfigured()) {
      toast.error('Please connect to Supabase using the "Connect to Supabase" button in the top right.');
    }
  }, []);

  return (
    <>
      <Toaster position="top-right" expand={true} richColors />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;