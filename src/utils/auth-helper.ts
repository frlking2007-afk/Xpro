// Auth helper utilities
export const createTestUser = async () => {
  const response = await fetch('https://mdqgvtrysmeulcmjgvvr.supabase.co/auth/v1/signup', {
    method: 'POST',
    headers: {
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kcWd2dHJ5c21ldWxjbWpndnZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NjY2MzksImV4cCI6MjA4NDE0MjYzOX0.qy8k5Fdt05tAtdOZf8K_cRFJ7sR8urFCaeFAA_GAuQU',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'frlking2007@gmail.com',
      password: '123456',
      options: {
        data: {
          username: 'frlking2007',
          full_name: 'FRL King'
        }
      }
    })
  })

  const data = await response.json()
  console.log('Create user response:', data)
  return data
}

export const testLogin = async () => {
  const response = await fetch('https://mdqgvtrysmeulcmjgvvr.supabase.co/auth/v1/token?grant_type=password', {
    method: 'POST',
    headers: {
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kcWd2dHJ5c21ldWxjbWpndnZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NjY2MzksImV4cCI6MjA4NDE0MjYzOX0.qy8k5Fdt05tAtdOZf8K_cRFJ7sR8urFCaeFAA_GAuQU',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'frlking2007@gmail.com',
      password: '123456'
    })
  })

  const data = await response.json()
  console.log('Login test response:', data)
  return data
}

// Usage in browser console:
// import { createTestUser, testLogin } from './utils/auth-helper'
// await createTestUser()
// await testLogin()
