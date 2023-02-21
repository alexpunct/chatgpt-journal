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
      chat_agent: {
        Row: {
          avatar: string | null
          created_at: string | null
          id: number
          name: string
          prompt: string
        }
        Insert: {
          avatar?: string | null
          created_at?: string | null
          id?: number
          name: string
          prompt: string
        }
        Update: {
          avatar?: string | null
          created_at?: string | null
          id?: number
          name?: string
          prompt?: string
        }
      }
      conversation: {
        Row: {
          chat_agent: number
          created_at: string | null
          id: number
          name: string
          session: string
          summary: string | null
          user_id: string
        }
        Insert: {
          chat_agent: number
          created_at?: string | null
          id?: number
          name: string
          session: string
          summary?: string | null
          user_id: string
        }
        Update: {
          chat_agent?: number
          created_at?: string | null
          id?: number
          name?: string
          session?: string
          summary?: string | null
          user_id?: string
        }
      }
      conversation_message: {
        Row: {
          conversation: number
          created_at: string | null
          id: number
          text: string
          user_id: string | null
        }
        Insert: {
          conversation: number
          created_at?: string | null
          id?: number
          text: string
          user_id?: string | null
        }
        Update: {
          conversation?: number
          created_at?: string | null
          id?: number
          text?: string
          user_id?: string | null
        }
      }
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
      match_entries: {
        Args: {
          query_embedding: unknown
          similarity_threshold: number
          match_count: number
        }
        Returns: {
          id: number
          user_id: string
          entry_day: string
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
