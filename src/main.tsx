import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryProvider } from './providers/QueryProvider'

// Load theme on app start
const savedTheme = localStorage.getItem('theme') || 'blue';
if (['light', 'dark', 'blue'].includes(savedTheme)) {
  document.documentElement.classList.add(`${savedTheme}-theme`);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <App />
    </QueryProvider>
  </StrictMode>,
)
