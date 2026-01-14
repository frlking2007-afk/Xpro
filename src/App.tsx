import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { SpeedInsights } from '@vercel/speed-insights/react';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load pages for code splitting
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const XproLanding = lazy(() => import('./pages/XproLanding'));
const XproOperations = lazy(() => import('./pages/XproOperations'));
const ExpenseStatistics = lazy(() => import('./pages/ExpenseStatistics'));
const CategoryExpenseStatistics = lazy(() => import('./pages/CategoryExpenseStatistics'));
const Reports = lazy(() => import('./pages/Reports'));
const Settings = lazy(() => import('./pages/Settings'));

// Loading component
const PageLoader = () => (
  <div className="flex h-screen items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
  </div>
);

function App() {
  return (
    <>
      <BrowserRouter>
        <Toaster position="top-right" richColors theme="dark" />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="xpro" element={<XproLanding />} />
                <Route path="xpro/operations" element={<XproOperations />} />
                <Route path="expense-statistics" element={<ExpenseStatistics />} />
                <Route path="category-expense-statistics" element={<CategoryExpenseStatistics />} />
                <Route path="reports" element={<Reports />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
      <SpeedInsights />
    </>
  );
}

export default App;
