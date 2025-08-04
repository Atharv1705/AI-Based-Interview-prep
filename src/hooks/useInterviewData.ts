import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Database } from '@/lib/database.types'

type Interview = Database['public']['Tables']['interviews']['Row']
type Question = Database['public']['Tables']['questions']['Row']

export const useInterviewData = () => {
  const { user } = useAuth()
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInterviews = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('interviews')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setInterviews(data || [])
    } catch (err: any) {
      setError(err.message)
    }
  }

  const fetchQuestions = async (category?: string, industry?: string, difficulty?: string) => {
    try {
      let query = supabase.from('questions').select('*')
      
      if (category) query = query.eq('category', category)
      if (industry) query = query.eq('industry', industry)
      if (difficulty) query = query.eq('difficulty', difficulty)

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error
      setQuestions(data || [])
    } catch (err: any) {
      setError(err.message)
    }
  }

  const createInterview = async (interviewData: Omit<Interview, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User not authenticated')

    try {
      const { data, error } = await supabase
        .from('interviews')
        .insert({
          ...interviewData,
          user_id: user.id
        })
        .select()
        .single()

      if (error) throw error
      
      setInterviews(prev => [data, ...prev])
      return data
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const updateInterview = async (id: string, updates: Partial<Interview>) => {
    try {
      const { data, error } = await supabase
        .from('interviews')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setInterviews(prev => prev.map(interview => 
        interview.id === id ? { ...interview, ...data } : interview
      ))
      
      return data
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  useEffect(() => {
    if (user) {
      fetchInterviews()
      fetchQuestions()
    }
    setLoading(false)
  }, [user])

  return {
    interviews,
    questions,
    loading,
    error,
    fetchInterviews,
    fetchQuestions,
    createInterview,
    updateInterview,
  }
}