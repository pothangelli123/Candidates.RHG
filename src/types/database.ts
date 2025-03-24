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
      candidates: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          position: string
          skills: string[]
          experience: number
          education: string
          resume: string | null
          status: 'new' | 'reviewing' | 'interviewed' | 'offer' | 'rejected'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          position: string
          skills: string[]
          experience: number
          education: string
          resume?: string | null
          status?: 'new' | 'reviewing' | 'interviewed' | 'offer' | 'rejected'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          position?: string
          skills?: string[]
          experience?: number
          education?: string
          resume?: string | null
          status?: 'new' | 'reviewing' | 'interviewed' | 'offer' | 'rejected'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      },
      profiles: {
        Row: {
          id: string
          created_at?: string
          updated_at?: string
          user_id?: string
          full_name?: string
          designation?: string
          phone?: string
          is_admin: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          full_name?: string
          designation?: string
          phone?: string
          is_admin?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          full_name?: string
          designation?: string
          phone?: string
          is_admin?: boolean
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