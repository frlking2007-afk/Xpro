import React, { useEffect } from 'react'
import { debugSupabaseConnection, quickAPITest } from '../utils/debug-supabase'

export const DebugSupabase = () => {
  useEffect(() => {
    // Auto-run debug on component mount
    debugSupabaseConnection()
  }, [])

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg max-w-md z-50">
      <h3 className="font-bold mb-2">🔍 Supabase Debug</h3>
      <p className="text-sm mb-2">Check browser console for detailed results</p>
      <button 
        onClick={() => debugSupabaseConnection()}
        className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-sm mr-2"
      >
        Run Debug
      </button>
      <button 
        onClick={() => quickAPITest()}
        className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded text-sm"
      >
        Quick Test
      </button>
    </div>
  )
}

// Add to App.tsx temporarily:
// import { DebugSupabase } from './components/DebugSupabase'
// <DebugSupabase />
