// Generated using supabase-js
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
      conversations: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string | null
          status: 'active' | 'archived' | 'deleted'
          last_message_at: string | null
          user_id: string
          is_starred: boolean
          is_read: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string | null
          status?: 'active' | 'archived' | 'deleted'
          last_message_at?: string | null
          user_id: string
          is_starred?: boolean
          is_read?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string | null
          status?: 'active' | 'archived' | 'deleted'
          last_message_at?: string | null
          user_id?: string
          is_starred?: boolean
          is_read?: boolean
        }
      }
      messages: {
        Row: {
          id: string
          created_at: string
          conversation_id: string
          content: string
          sender_type: 'user' | 'bot'
          user_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          conversation_id: string
          content: string
          sender_type: 'user' | 'bot'
          user_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          conversation_id?: string
          content?: string
          sender_type?: 'user' | 'bot'
          user_id?: string | null
        }
      }
      conversation_tags: {
        Row: {
          id: string
          conversation_id: string
          tag_id: string
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          tag_id: string
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          tag_id?: string
          created_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          color: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          color?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          username: string
          full_name: string | null
          avatar_url: string | null
          email: string
          updated_at: string | null
        }
        Insert: {
          id: string
          created_at?: string
          username: string
          full_name?: string | null
          avatar_url?: string | null
          email: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          email?: string
          updated_at?: string | null
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