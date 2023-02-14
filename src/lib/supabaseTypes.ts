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
      journal: {
        Row: {
          content: string | null
          day: string | null
          embedding: unknown | null
          id: number
          inserted_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          day?: string | null
          embedding?: unknown | null
          id?: number
          inserted_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          day?: string | null
          embedding?: unknown | null
          id?: number
          inserted_at?: string
          updated_at?: string
          user_id?: string
        }
      }
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
      test: {
        Row: {
          created_at: string | null
          id: number
        }
        Insert: {
          created_at?: string | null
          id?: number
        }
        Update: {
          created_at?: string | null
          id?: number
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
