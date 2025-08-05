import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Database } from '@/integrations/supabase/types'

// Define types based on the database schema
type Interview = {
  id: string
  user_id: string
  title: string
  type: 'technical' | 'behavioral' | 'case_study' | 'general'
  industry: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
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
  difficulty: 'beginner' | 'intermediate' | 'advanced'
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
      // Mock interviews until database is ready
      const mockInterviews: Interview[] = [
        {
          id: '1',
          user_id: user.id,
          title: 'Technical Interview - Frontend Developer',
          type: 'technical',
          industry: 'Technology',
          difficulty: 'intermediate',
          duration: 45,
          score: 85,
          feedback: { strengths: ['Good problem solving'], areas: ['Communication'] },
          transcript: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: 'completed'
        }
      ]
      setInterviews(mockInterviews)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const fetchQuestions = async (category?: string, industry?: string, difficulty?: string) => {
    try {
      // Mock questions until database is ready
      const mockQuestions: Question[] = [
        {
          id: '1',
          category: 'technical',
          industry: 'Technology',
          difficulty: 'intermediate',
          question_text: 'Explain the difference between let, const, and var in JavaScript.',
          expected_keywords: ['hoisting', 'scope', 'temporal dead zone'],
          sample_answer: 'let and const are block-scoped while var is function-scoped...',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
      setQuestions(mockQuestions)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const createInterview = async (interviewData: Omit<Interview, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (!user) throw new Error('User not authenticated')

    try {
      // Mock creation until database is ready
      const newInterview: Interview = {
        id: Date.now().toString(),
        user_id: user.id,
        ...interviewData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      setInterviews(prev => [newInterview, ...prev])
      return newInterview
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const updateInterview = async (id: string, updates: Partial<Interview>) => {
    try {
      // Mock update until database is ready
      setInterviews(prev => prev.map(interview => 
        interview.id === id ? { ...interview, ...updates, updated_at: new Date().toISOString() } : interview
      ))
      
      const updatedInterview = interviews.find(i => i.id === id)
      return updatedInterview
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