import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

// Define types based on the database schema
type Interview = {
  id: string
  user_id: string
  title: string
  type: 'technical' | 'behavioral' | 'case_study' | 'general'
  industry: string
  difficulty: 'easy' | 'medium' | 'hard'
  duration: number
  score: number | null
  feedback: any | null
  transcript: string | null
  created_at: string
  updated_at: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
}

type Question = {
  id: string
  category: string
  industry: string
  difficulty: 'easy' | 'medium' | 'hard'
  question_text: string
  expected_keywords: string[]
  sample_answer: string | null
  created_at: string
  updated_at: string
}

export const useInterviewData = () => {
  const { user } = useAuth()
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInterviews = async () => {
    if (!user) return
    try {
      const res = await fetch('/api/interviews', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setInterviews(data as any)
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  const fetchQuestions = async (interviewId?: string) => {
    try {
      if (!interviewId) return
      const res = await fetch(`/api/interviews/${interviewId}/questions`, { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setQuestions(data as any)
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  const createInterview = async (interviewData: Omit<Interview, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (!user) throw new Error('User not authenticated')

    try {
      const res = await fetch('/api/interviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(interviewData)
      })
      if (!res.ok) throw new Error('Failed to create interview')
      const data = await res.json()
      setInterviews(prev => [data, ...prev])
      return data as any
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const updateInterview = async (id: string, updates: Partial<Interview>) => {
    try {
      const res = await fetch(`/api/interviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updates)
      })
      if (!res.ok) throw new Error('Failed to update interview')
      const data = await res.json()
      setInterviews(prev => prev.map(i => i.id === id ? data : i))
      return data as any
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