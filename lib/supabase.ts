import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for Supabase
export type Database = {
  public: {
    Tables: {
      petitions: {
        Row: {
          id: string
          title: string
          description: string
          nationality: string
          creator_name: string
          created_at: string
          signatures: number
          status: "active" | "closed" | "under_review"
        }
        Insert: {
          id?: string
          title: string
          description: string
          nationality: string
          creator_name: string
          created_at?: string
          signatures?: number
          status?: "active" | "closed" | "under_review"
        }
        Update: {
          id?: string
          title?: string
          description?: string
          nationality?: string
          creator_name?: string
          created_at?: string
          signatures?: number
          status?: "active" | "closed" | "under_review"
        }
      }
      signers: {
        Row: {
          id: string
          petition_id: string
          name: string
          nationality: string
          signed_at: string
          verified: boolean
        }
        Insert: {
          id?: string
          petition_id: string
          name: string
          nationality: string
          signed_at?: string
          verified?: boolean
        }
        Update: {
          id?: string
          petition_id?: string
          name?: string
          nationality?: string
          signed_at?: string
          verified?: boolean
        }
      }
    }
  }
}
