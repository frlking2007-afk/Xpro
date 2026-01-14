import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryProvider } from './providers/QueryProvider'
import { ErrorBoundary } from './components/ErrorBoundary'

// Ensure HTML is visible even if JS fails
document.documentElement.style.visibility = 'visible';

// Load theme on app start
try {
  const savedTheme = localStorage.getItem('theme') || 'blue';
  if (['light', 'dark', 'blue'].includes(savedTheme)) {
    document.documentElement.classList.add(`${savedTheme}-theme`);
  }
} catch (e) {
  console.warn('Failed to load theme:', e);
}

// Check for root element with better error handling
const rootElement = document.getElementById('root');
if (!rootElement) {
  // If root element doesn't exist, create it
  const newRoot = document.createElement('div');
  newRoot.id = 'root';
  document.body.appendChild(newRoot);
  
  // Show error message in the page
  document.body.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #0f172a; color: white; font-family: system-ui; padding: 20px;">
      <div style="text-align: center; max-width: 500px;">
        <h1 style="color: #ef4444; margin-bottom: 16px;">Root element topilmadi</h1>
        <p style="color: #94a3b8; margin-bottom: 24px;">index.html faylida &lt;div id="root"&gt;&lt;/div&gt; mavjudligini tekshiring.</p>
        <button onclick="window.location.reload()" style="background: #3b82f6; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 16px;">
          Sahifani yangilash
        </button>
      </div>
    </div>
  `;
  throw new Error('Root element not found and could not be created!');
}

// Render app with comprehensive error handling
try {
  const root = createRoot(rootElement);
  
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <QueryProvider>
          <App />
        </QueryProvider>
      </ErrorBoundary>
    </StrictMode>
  );
} catch (error) {
  console.error('Failed to render app:', error);
  
  // Show error message in the page
  rootElement.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #0f172a; color: white; font-family: system-ui; padding: 20px;">
      <div style="text-align: center; max-width: 500px;">
        <h1 style="color: #ef4444; margin-bottom: 16px;">Ilova yuklanmadi</h1>
        <p style="color: #94a3b8; margin-bottom: 8px;">Xatolik: ${error instanceof Error ? error.message : 'Noma\'lum xatolik'}</p>
        <p style="color: #64748b; margin-bottom: 24px; font-size: 14px;">Browser Console'ni ochib (F12) batafsil xatolikni ko'ring.</p>
        <button onclick="window.location.reload()" style="background: #3b82f6; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 16px; margin-right: 12px;">
          Sahifani yangilash
        </button>
        <details style="margin-top: 24px; text-align: left;">
          <summary style="color: #94a3b8; cursor: pointer; margin-bottom: 12px;">Texnik ma'lumot</summary>
          <pre style="background: #1e293b; padding: 16px; border-radius: 8px; overflow: auto; font-size: 12px; color: #cbd5e1;">
${error instanceof Error ? error.stack || error.message : String(error)}
          </pre>
        </details>
      </div>
    </div>
  `;
}
