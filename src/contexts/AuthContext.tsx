import React, { createContext, useContext, useEffect, useState } from 'react'

export type Profile = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
  interview_count: number
  total_practice_time: number
  skill_level: 'beginner' | 'intermediate' | 'advanced'
  preferred_industries: string[]
  notification_preferences: any
}

interface AuthContextType {
  user: { id: string; email: string } | null
  profile: Profile | null
  loading: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => void
  signInWithGitHub: () => void
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
          if (data.user?.id) {
            await fetchProfile(data.user.id)
          }
        }
      } finally {
        setLoading(false)
      }
    }
    bootstrap()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const res = await fetch(`/api/profile/${userId}`, { credentials: 'include' })
      if (!res.ok) return
      const data = await res.json()
      const profile: Profile = {
        id: data.id,
        email: user?.email || '',
        full_name: data.full_name,
        avatar_url: data.avatar_url,
        created_at: data.created_at,
        updated_at: data.updated_at,
        interview_count: data.interview_count ?? 0,
        total_practice_time: data.total_practice_time ?? 0,
        skill_level: (data.skill_level as 'beginner' | 'intermediate' | 'advanced') || 'beginner',
        preferred_industries: data.preferred_industries ?? [],
        notification_preferences: data.notification_preferences ?? {}
      }
      setProfile(profile)
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password, fullName })
    })
    if (!res.ok) {
      const t = await res.text().catch(() => '')
      throw new Error(t || 'Sign up failed')
    }
    const data = await res.json()
    setUser(data.user)
    await fetchProfile(data.user.id)
  }

  const signIn = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    })
    if (!res.ok) {
      const t = await res.text().catch(() => '')
      throw new Error(t || 'Login failed')
    }
    const data = await res.json()
    setUser(data.user)
    await fetchProfile(data.user.id)
  }

  // Social auth functions
  const signInWithGoogle = () => {
    window.location.href = '/api/auth/google'
  }

  const signInWithGitHub = () => {
    window.location.href = '/api/auth/github'
  }

  const signOut = async () => {
    const res = await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    if (!res.ok) throw new Error('Logout failed')
    setUser(null)
    setProfile(null)
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error('No user logged in')
    const res = await fetch(`/api/profile/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(updates)
    })
    if (!res.ok) throw new Error('Failed to update profile')
    setProfile(prev => prev ? { ...prev, ...updates } : null)
  }

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithGitHub,
    signOut,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}