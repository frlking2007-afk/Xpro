import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="customers" element={<div className="p-4">Mijozlar sahifasi (Tez orada)</div>} />
          <Route path="reports" element={<div className="p-4">Xisobotlar sahifasi (Tez orada)</div>} />
          <Route path="settings" element={<div className="p-4">Sozlamalar sahifasi (Tez orada)</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
