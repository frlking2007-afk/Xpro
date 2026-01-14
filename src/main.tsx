import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryProvider } from './providers/QueryProvider'
import { ErrorBoundary } from './components/ErrorBoundary'

// Load theme on app start
const savedTheme = localStorage.getItem('theme') || 'blue';
if (['light', 'dark', 'blue'].includes(savedTheme)) {
  document.documentElement.classList.add(`${savedTheme}-theme`);
}

// Check for root element
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found!');
}

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryProvider>
        <App />
      </QueryProvider>
    </ErrorBoundary>
  </StrictMode>,
)
