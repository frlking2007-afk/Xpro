import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { SpeedInsights } from '@vercel/speed-insights/react';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import XproLanding from './pages/XproLanding';
import XproOperations from './pages/XproOperations';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import ExpenseStatistics from './pages/ExpenseStatistics';
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
              <Route path="xpro" element={<XproLanding />} />
              <Route path="xpro/operations" element={<XproOperations />} />
              <Route path="expense-statistics" element={<ExpenseStatistics />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
      <SpeedInsights />
    </>
  );
}

export default App;
