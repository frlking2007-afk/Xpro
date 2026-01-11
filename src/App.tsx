import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { SpeedInsights } from '@vercel/speed-insights/react';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import XproPage from './pages/XproPage';
import Reports from './pages/Reports';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <>
      <BrowserRouter>
        <Toaster position="top-right" richColors theme="dark" />
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="xpro" element={<XproPage />} />
              <Route path="reports" element={<Reports />} />
              <Route path="customers" element={<div className="p-4 text-white">Mijozlar sahifasi (Tez orada)</div>} />
              <Route path="settings" element={<div className="p-4 text-white">Sozlamalar sahifasi (Tez orada)</div>} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
      <SpeedInsights />
    </>
  );
}

export default App;
