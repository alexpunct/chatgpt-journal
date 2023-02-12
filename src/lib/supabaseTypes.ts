export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      journal_alex: {
        Row: {
          content: string | null
          created_at: string | null
          date: string | null
          embedding: unknown | null
          id: number
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          date?: string | null
          embedding?: unknown | null
          id?: number
        }
        Update: {
          content?: string | null
          created_at?: string | null
          date?: string | null
          embedding?: unknown | null
          id?: number
        }
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
      }
      profiles_private: {
        Row: {
          id: string
          openai_api_key: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          openai_api_key?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          openai_api_key?: string | null
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      match_documents: {
        Args: {
          query_embedding: unknown
          similarity_threshold: number
          match_count: number
        }
        Returns: {
          id: number
          date: string
          content: string
          similarity: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
