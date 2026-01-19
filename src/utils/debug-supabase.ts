// Debug utility for Supabase API key issues
export const debugSupabaseConnection = async () => {
  console.log('🔍 Starting Supabase API key debug...')
  
  // 1. Environment variables check
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  
  console.log('📋 Environment Check:')
  console.log('  URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
  console.log('  Key:', supabaseKey ? '✅ Set' : '❌ Missing')
  console.log('  Key length:', supabaseKey?.length || 0)
  console.log('  Key starts with:', supabaseKey?.substring(0, 20) + '...')
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Environment variables missing!')
    console.error('🔧 Fix: Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to Vercel')
    return false
  }
  
  // 2. Test without headers (should fail with API key error)
  console.log('🌐 Testing WITHOUT headers (should fail)...')
  try {
    const responseWithoutHeaders = await fetch(`${supabaseUrl}/rest/v1/transactions?select=id&limit=1`)
    console.log('📊 Without headers - Status:', responseWithoutHeaders.status)
    if (responseWithoutHeaders.status === 401 || responseWithoutHeaders.status === 403) {
      const errorText = await responseWithoutHeaders.text()
      console.log('  Error body:', errorText)
      if (errorText.includes('No API key found')) {
        console.log('✅ This confirms API key is required')
      }
    }
  } catch (error) {
    console.error('❌ Request failed:', error)
  }
  
  // 3. Test with proper headers (should work)
  console.log('🌐 Testing WITH proper headers...')
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/transactions?select=id&limit=1`, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    })
    
    console.log('📊 API Response:')
    console.log('  Status:', response.status)
    console.log('  Status Text:', response.statusText)
    console.log('  Headers:', Object.fromEntries(response.headers.entries()))
    
    if (response.status === 404) {
      const errorText = await response.text()
      console.error('❌ 404: Table does not exist')
      console.error('  Error body:', errorText)
      console.error('🔧 Fix: Create transactions table in Supabase Dashboard')
      return false
    } else if (response.status === 401) {
      const errorText = await response.text()
      console.error('❌ 401: Invalid API key')
      console.error('  Error body:', errorText)
      console.error('🔧 Fix: Check VITE_SUPABASE_ANON_KEY in Vercel')
      return false
    } else if (response.ok) {
      console.log('✅ API call successful')
      const data = await response.json()
      console.log('  Data:', data)
      return true
    } else {
      const errorText = await response.text()
      console.error('❌ Unexpected status:', response.status)
      console.error('  Error body:', errorText)
      return false
    }
  } catch (error) {
    console.error('❌ API call failed:', error)
    return false
  }
}

// Quick test function
export const quickAPITest = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  
  console.log('🚀 Quick API Test:')
  console.log('Copy this to browser console:')
  console.log(`fetch('${supabaseUrl}/rest/v1/transactions?select=id', {
  headers: {
    'apikey': '${supabaseKey}',
    'Authorization': 'Bearer ${supabaseKey}'
  }
}).then(r => console.log('Status:', r.status)).catch(e => console.error('Error:', e))`)
}
