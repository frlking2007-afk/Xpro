import React, { Suspense, lazy, ErrorInfo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load pages for code splitting with error handling
const Login = lazy(() => import('./pages/Login').catch((err) => {
  console.error('Failed to load Login page:', err);
  return { default: () => <ErrorFallback message="Login sahifasi yuklanmadi" /> };
}));

const Dashboard = lazy(() => import('./pages/Dashboard').catch((err) => {
  console.error('Failed to load Dashboard page:', err);
  return { default: () => <ErrorFallback message="Dashboard sahifasi yuklanmadi" /> };
}));

const XproLanding = lazy(() => import('./pages/XproLanding').catch((err) => {
  console.error('Failed to load XproLanding page:', err);
  return { default: () => <ErrorFallback message="XproLanding sahifasi yuklanmadi" /> };
}));

const XproOperations = lazy(() => import('./pages/XproOperations').catch((err) => {
  console.error('Failed to load XproOperations page:', err);
  return { default: () => <ErrorFallback message="XproOperations sahifasi yuklanmadi" /> };
}));

const ExpenseStatistics = lazy(() => import('./pages/ExpenseStatistics').catch((err) => {
  console.error('Failed to load ExpenseStatistics page:', err);
  return { default: () => <ErrorFallback message="ExpenseStatistics sahifasi yuklanmadi" /> };
}));

const CategoryExpenseStatistics = lazy(() => import('./pages/CategoryExpenseStatistics').catch((err) => {
  console.error('Failed to load CategoryExpenseStatistics page:', err);
  return { default: () => <ErrorFallback message="CategoryExpenseStatistics sahifasi yuklanmadi" /> };
}));

const Reports = lazy(() => import('./pages/Reports').catch((err) => {
  console.error('Failed to load Reports page:', err);
  return { default: () => <ErrorFallback message="Reports sahifasi yuklanmadi" /> };
}));

const Settings = lazy(() => import('./pages/Settings').catch((err) => {
  console.error('Failed to load Settings page:', err);
  return { default: () => <ErrorFallback message="Settings sahifasi yuklanmadi" /> };
}));

// Error fallback component
const ErrorFallback = ({ message }: { message: string }) => (
  <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    <div className="text-center max-w-md p-6">
      <h2 className="text-xl font-bold text-red-400 mb-2">Xatolik</h2>
      <p className="text-gray-300 mb-4">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        Sahifani yangilash
      </button>
    </div>
  </div>
);

// Loading component
const PageLoader = () => (
  <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    <div className="text-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white mx-auto mb-4"></div>
      <p className="text-gray-400">Yuklanmoqda...</p>
    </div>
  </div>
);

function App() {
  try {
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
        <Analytics />
      </>
    );
  } catch (error) {
    console.error('App component error:', error);
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center max-w-md p-6">
          <h2 className="text-xl font-bold text-red-400 mb-2">Ilova xatosi</h2>
          <p className="text-gray-300 mb-4">
            {error instanceof Error ? error.message : 'Noma\'lum xatolik yuz berdi'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Sahifani yangilash
          </button>
        </div>
      </div>
    );
  }
}

export default App;
