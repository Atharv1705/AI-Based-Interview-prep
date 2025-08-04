export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
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
          notification_preferences: Json
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          interview_count?: number
          total_practice_time?: number
          skill_level?: 'beginner' | 'intermediate' | 'advanced'
          preferred_industries?: string[]
          notification_preferences?: Json
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          interview_count?: number
          total_practice_time?: number
          skill_level?: 'beginner' | 'intermediate' | 'advanced'
          preferred_industries?: string[]
          notification_preferences?: Json
        }
      }
      interviews: {
        Row: {
          id: string
          user_id: string
          title: string
          type: 'technical' | 'behavioral' | 'case_study' | 'general'
          industry: string
          difficulty: 'beginner' | 'intermediate' | 'advanced'
          duration: number
          score: number | null
          feedback: Json | null
          transcript: string | null
          created_at: string
          updated_at: string
          status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          type: 'technical' | 'behavioral' | 'case_study' | 'general'
          industry: string
          difficulty: 'beginner' | 'intermediate' | 'advanced'
          duration: number
          score?: number | null
          feedback?: Json | null
          transcript?: string | null
          created_at?: string
          updated_at?: string
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled'
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          type?: 'technical' | 'behavioral' | 'case_study' | 'general'
          industry?: string
          difficulty?: 'beginner' | 'intermediate' | 'advanced'
          duration?: number
          score?: number | null
          feedback?: Json | null
          transcript?: string | null
          created_at?: string
          updated_at?: string
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled'
        }
      }
      questions: {
        Row: {
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
        Insert: {
          id?: string
          category: string
          industry: string
          difficulty: 'beginner' | 'intermediate' | 'advanced'
          question_text: string
          expected_keywords: string[]
          sample_answer?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category?: string
          industry?: string
          difficulty?: 'beginner' | 'intermediate' | 'advanced'
          question_text?: string
          expected_keywords?: string[]
          sample_answer?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}