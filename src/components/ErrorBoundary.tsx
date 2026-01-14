import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      const isSupabaseError = this.state.error?.message?.includes('Supabase') || 
                             this.state.error?.message?.includes('environment');
      
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
          <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 shadow-xl">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-white text-center mb-2">
              Xatolik yuz berdi
            </h1>
            
            {isSupabaseError ? (
              <div className="space-y-4">
                <p className="text-gray-300 text-center">
                  Supabase sozlamalari topilmadi. Iltimos, quyidagilarni tekshiring:
                </p>
                <div className="bg-gray-900/50 rounded p-4 space-y-2 text-sm">
                  <p className="text-gray-400">
                    <strong className="text-white">Vercel'da:</strong>
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-gray-300 ml-2">
                    <li>Vercel Dashboard → Settings → Environment Variables</li>
                    <li>Quyidagi o'zgaruvchilarni qo'shing:</li>
                  </ol>
                  <div className="mt-2 space-y-1 font-mono text-xs bg-gray-800 p-2 rounded">
                    <div className="text-green-400">VITE_SUPABASE_URL</div>
                    <div className="text-green-400">VITE_SUPABASE_ANON_KEY</div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-300 text-center mb-4">
                {this.state.error?.message || 'Noma\'lum xatolik yuz berdi'}
              </p>
            )}
            
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Sahifani yangilash
            </button>
            
            <details className="mt-4">
              <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-300">
                Texnik ma'lumot
              </summary>
              <pre className="mt-2 text-xs text-gray-500 bg-gray-900/50 p-2 rounded overflow-auto max-h-40">
                {this.state.error?.stack || this.state.error?.message}
              </pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
