export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          user_id: string
          name: string
          username: string | null
          role: "CLIENT" | "FREELANCER" | "ADMIN"
          email: string
          avatar_url: string | null
          status: "ACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION"
          created_at: string
          updated_at: string
          last_login_at: string | null
        }
        Insert: Omit<Database["public"]["Tables"]["users"]["Row"], "created_at" | "updated_at"> & {
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>
        Relationships: []
      }
      freelancer_profiles: {
        Row: {
          user_id: string
          username: string
          tagline: string | null
          bio: string | null
          skills: string[]
          hourly_rate: number | null
          currency: string
          public_profile_enabled: boolean
          social_links: { website?: string; linkedin?: string; github?: string }
        }
        Insert: Database["public"]["Tables"]["freelancer_profiles"]["Row"]
        Update: Partial<Database["public"]["Tables"]["freelancer_profiles"]["Insert"]>
        Relationships: []
      }
      project_cards: {
        Row: {
          id: string
          title: string
          subtitle: string
          cover_image_url: string
          category_id: string
          freelance_id: string
          published_at: string
          like_count: number
          view_count: number
        }
        Insert: Database["public"]["Tables"]["project_cards"]["Row"]
        Update: Partial<Database["public"]["Tables"]["project_cards"]["Insert"]>
        Relationships: []
      }
      jobs: {
        Row: {
          id: string
          client_id: string
          title: string
          description: string
          category_id: string
          industry_id: string
          status: "open" | "closed"
          published_at: string
        }
        Insert: Database["public"]["Tables"]["jobs"]["Row"]
        Update: Partial<Database["public"]["Tables"]["jobs"]["Insert"]>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}