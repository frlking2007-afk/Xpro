import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase-client'
import { useSupabaseAuth } from '../hooks/useSupabaseAuth'
import type { Database } from '../lib/supabase-client'

type Profile = Database['public']['Tables']['profiles']['Row']

export function Profile() {
  const { user } = useSupabaseAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      setMessage('Error loading profile')
    } else {
      setProfile(data)
      setFormData({
        username: data.username,
        full_name: data.full_name || '',
      })
    }
    setLoading(false)
  }

  const updateProfile = async () => {
    if (!user) return

    setLoading(true)
    setMessage('')

    // Upload avatar if selected
    let avatarUrl = profile?.avatar_url
    if (avatarFile) {
      const fileExt = avatarFile.name.split('.').pop()
      const fileName = `${user.id}/avatar.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, avatarFile, {
          cacheControl: '3600',
          upsert: true,
        })

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName)
        avatarUrl = publicUrl
      }
    }

    // Update profile
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        username: formData.username,
        full_name: formData.full_name || null,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setProfile(data)
      setEditing(false)
      setMessage('Profile updated successfully!')
    }

    setLoading(false)
  }

  if (loading) {
    return <div>Loading profile...</div>
  }

  if (!user) {
    return <div>Please sign in to view your profile</div>
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Profile</h2>
      
      {profile?.avatar_url && (
        <div className="mb-6">
          <img
            src={profile.avatar_url}
            alt="Avatar"
            className="w-24 h-24 rounded-full mx-auto"
          />
        </div>
      )}

      {editing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Avatar
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
              className="mt-1 block w-full"
            />
          </div>

          <div className="flex space-x-2">
            <button
              onClick={updateProfile}
              disabled={loading}
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <strong>Email:</strong> {user.email}
          </div>
          <div>
            <strong>Username:</strong> {profile?.username}
          </div>
          <div>
            <strong>Full Name:</strong> {profile?.full_name || 'Not set'}
          </div>
          <div>
            <strong>Updated:</strong> {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'Never'}
          </div>
          
          <button
            onClick={() => setEditing(true)}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Edit Profile
          </button>
        </div>
      )}

      {message && (
        <div className={`mt-4 p-3 rounded-md ${
          message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {message}
        </div>
      )}
    </div>
  )
}
