const express = require('express')
const cors = require('cors')
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3001

// CORS middleware
app.use(cors())
app.use(express.json())

// Supabase admin client (Secret key bilan)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// === OPERATIONS API ===
// Get operations by type
app.get('/api/operations', async (req, res) => {
  try {
    const { type, user_id } = req.query
    let query = supabase.from('transactions').select('*')
    
    if (type) query = query.eq('type', type)
    if (user_id) query = query.eq('user_id', user_id)
    
    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    res.json(data)
  } catch (error) {
    console.error('Operations GET error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Create operation
app.post('/api/operations', async (req, res) => {
  try {
    const { user_id, type, summa, tavsif } = req.body
    
    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        user_id,
        type,
        summa: parseFloat(summa) || 0,
        tavsif: tavsif || '',
        created_at: new Date().toISOString()
      }])
      .select()
    
    if (error) throw error
    res.json(data[0])
  } catch (error) {
    console.error('Operations POST error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Delete operation
app.delete('/api/operations/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { type, user_id } = req.query
    
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', user_id)
    
    if (error) throw error
    res.json({ success: true })
  } catch (error) {
    console.error('Operations DELETE error:', error)
    res.status(500).json({ error: error.message })
  }
})

// === XARAJATLAR API ===
// Get xarajatlar
app.get('/api/xarajatlar', async (req, res) => {
  try {
    const { user_id } = req.query
    const { data, error } = await supabase
      .from('expense_categories')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    res.json(data)
  } catch (error) {
    console.error('Xarajatlar GET error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Create xarajat
app.post('/api/xarajatlar', async (req, res) => {
  try {
    const { user_id, nomi, summa, tavsif } = req.body
    
    const { data, error } = await supabase
      .from('expense_categories')
      .insert([{
        user_id,
        nomi,
        summa: parseFloat(summa) || 0,
        tavsif: tavsif || '',
        created_at: new Date().toISOString()
      }])
      .select()
    
    if (error) throw error
    res.json(data[0])
  } catch (error) {
    console.error('Xarajatlar POST error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Update xarajat
app.put('/api/xarajatlar/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { user_id, nomi, summa, tavsif } = req.body
    
    const { data, error } = await supabase
      .from('expense_categories')
      .update({
        nomi,
        summa: parseFloat(summa) || 0,
        tavsif: tavsif || '',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user_id)
      .select()
    
    if (error) throw error
    res.json(data[0])
  } catch (error) {
    console.error('Xarajatlar PUT error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Delete xarajat
app.delete('/api/xarajatlar/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { user_id } = req.query
    
    const { error } = await supabase
      .from('expense_categories')
      .delete()
      .eq('id', id)
      .eq('user_id', user_id)
    
    if (error) throw error
    res.json({ success: true })
  } catch (error) {
    console.error('Xarajatlar DELETE error:', error)
    res.status(500).json({ error: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
})
