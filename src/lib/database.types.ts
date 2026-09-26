/**
 * Row shapes for the Supabase schema in supabase/migrations.
 *
 * Hand-written to match the initial migration, in the same shape the Supabase
 * generator emits. Insert/Update are spelled out rather than derived from Row:
 * supabase-js requires each table type to satisfy `Record<string, unknown>`,
 * and an intersection type (Pick & Partial<Omit>) has no implicit index
 * signature, which silently collapses the whole schema to `never`. For the same
 * reason every Row is a `type`, not an `interface` — interfaces never get an
 * implicit index signature, so `interface JobRow` breaks the client too.
 *
 * Once the Supabase CLI is set up, regenerate instead of editing by hand:
 *
 *   npx supabase gen types typescript --project-id <ref> > src/lib/database.types.ts
 */

export type UserRoleDb = "CLIENT" | "FREELANCER" | "ADMIN"
export type UserStatusDb = "ACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION"
export type PortfolioStatusDb = "draft" | "published"
export type JobStatusDb = "open" | "closed"
export type ProjectStatusDb =
  | "enquiry"
  | "active"
  | "delivered"
  | "completed"
  | "cancelled"
  | "declined"
export type PaymentStatusDb = "unfunded" | "held" | "released" | "returned"
export type ProjectEventTypeDb =
  | "created"
  | "accepted"
  | "declined"
  | "funded"
  | "delivered"
  | "revision_requested"
  | "approved"
  | "released"
  | "completed"
  | "cancelled"

export type CategoryRow = {
  id: string
  name: string
  slug: string
  sort_order: number
}

export type IndustryRow = {
  id: string
  name: string
  sort_order: number
}

export type ProfileRow = {
  id: string
  name: string
  username: string | null
  role: UserRoleDb
  email: string
  avatar_url: string | null
  status: UserStatusDb
  created_at: string
  updated_at: string
  last_login_at: string | null
}

export type FreelancerProfileRow = {
  user_id: string
  tagline: string | null
  bio: string | null
  skills: string[]
  hourly_rate: number | null
  currency: string
  public_profile_enabled: boolean
  website_url: string | null
  linkedin_url: string | null
  github_url: string | null
  updated_at: string
}

export type ClientProfileRow = {
  user_id: string
  company_name: string | null
  billing_address: string | null
  notes: string | null
  updated_at: string
}

export type PortfolioItemRow = {
  id: string
  freelancer_id: string
  title: string
  subtitle: string | null
  description: string | null
  cover_image_url: string | null
  images: string[]
  category_id: string | null
  industry_id: string | null
  status: PortfolioStatusDb
  published_at: string | null
  like_count: number
  view_count: number
  created_at: string
  updated_at: string
}

export type JobRow = {
  id: string
  client_id: string
  title: string
  description: string
  category_id: string | null
  industry_id: string | null
  status: JobStatusDb
  published_at: string
  created_at: string
  updated_at: string
}

export type ProjectRow = {
  id: string
  client_id: string
  freelancer_id: string
  title: string
  scope: string
  budget: number
  currency: string
  deadline: string | null
  status: ProjectStatusDb
  payment_status: PaymentStatusDb
  source_portfolio_item_id: string | null
  source_job_id: string | null
  /** Generated column — never written by the client. */
  platform_fee: number
  /** Generated column — never written by the client. */
  client_total: number
  created_at: string
  updated_at: string
  last_activity_at: string
}

export type DeliverableRow = {
  id: string
  project_id: string
  submitted_by: string
  note: string
  images: string[]
  created_at: string
}

export type ProjectEventRow = {
  id: string
  project_id: string
  actor_id: string | null
  type: ProjectEventTypeDb
  note: string | null
  created_at: string
}

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: CategoryRow
        Insert: {
          id: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      industries: {
        Row: IndustryRow
        Insert: {
          id: string
          name: string
          sort_order?: number
        }
        Update: {
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      profiles: {
        Row: ProfileRow
        Insert: {
          id: string
          name: string
          email: string
          username?: string | null
          role?: UserRoleDb
          avatar_url?: string | null
          status?: UserStatusDb
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
        }
        Update: {
          name?: string
          email?: string
          username?: string | null
          role?: UserRoleDb
          avatar_url?: string | null
          status?: UserStatusDb
          updated_at?: string
          last_login_at?: string | null
        }
        Relationships: []
      }
      freelancer_profiles: {
        Row: FreelancerProfileRow
        Insert: {
          user_id: string
          tagline?: string | null
          bio?: string | null
          skills?: string[]
          hourly_rate?: number | null
          currency?: string
          public_profile_enabled?: boolean
          website_url?: string | null
          linkedin_url?: string | null
          github_url?: string | null
          updated_at?: string
        }
        Update: {
          tagline?: string | null
          bio?: string | null
          skills?: string[]
          hourly_rate?: number | null
          currency?: string
          public_profile_enabled?: boolean
          website_url?: string | null
          linkedin_url?: string | null
          github_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      client_profiles: {
        Row: ClientProfileRow
        Insert: {
          user_id: string
          company_name?: string | null
          billing_address?: string | null
          notes?: string | null
          updated_at?: string
        }
        Update: {
          company_name?: string | null
          billing_address?: string | null
          notes?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      portfolio_items: {
        Row: PortfolioItemRow
        Insert: {
          freelancer_id: string
          title: string
          id?: string
          subtitle?: string | null
          description?: string | null
          cover_image_url?: string | null
          images?: string[]
          category_id?: string | null
          industry_id?: string | null
          status?: PortfolioStatusDb
          published_at?: string | null
          like_count?: number
          view_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          freelancer_id?: string
          title?: string
          subtitle?: string | null
          description?: string | null
          cover_image_url?: string | null
          images?: string[]
          category_id?: string | null
          industry_id?: string | null
          status?: PortfolioStatusDb
          published_at?: string | null
          like_count?: number
          view_count?: number
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: ProjectRow
        Insert: {
          client_id: string
          freelancer_id: string
          title: string
          scope: string
          budget: number
          id?: string
          currency?: string
          deadline?: string | null
          status?: ProjectStatusDb
          payment_status?: PaymentStatusDb
          source_portfolio_item_id?: string | null
          source_job_id?: string | null
        }
        Update: {
          title?: string
          scope?: string
          budget?: number
          deadline?: string | null
          status?: ProjectStatusDb
          payment_status?: PaymentStatusDb
        }
        Relationships: []
      }
      deliverables: {
        Row: DeliverableRow
        Insert: {
          project_id: string
          submitted_by: string
          note: string
          id?: string
          images?: string[]
          created_at?: string
        }
        Update: { note?: string; images?: string[] }
        Relationships: []
      }
      project_events: {
        Row: ProjectEventRow
        Insert: {
          project_id: string
          type: ProjectEventTypeDb
          actor_id?: string | null
          id?: string
          note?: string | null
          created_at?: string
        }
        Update: { note?: string | null }
        Relationships: []
      }
      jobs: {
        Row: JobRow
        Insert: {
          client_id: string
          title: string
          description: string
          id?: string
          category_id?: string | null
          industry_id?: string | null
          status?: JobStatusDb
          published_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          title?: string
          description?: string
          category_id?: string | null
          industry_id?: string | null
          status?: JobStatusDb
          published_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: {
      project_status: ProjectStatusDb
      payment_status: PaymentStatusDb
      project_event_type: ProjectEventTypeDb
      user_role: UserRoleDb
      user_status: UserStatusDb
      portfolio_status: PortfolioStatusDb
      job_status: JobStatusDb
    }
    CompositeTypes: { [_ in never]: never }
  }
}
