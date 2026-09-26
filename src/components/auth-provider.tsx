/* eslint-disable react-refresh/only-export-components */
import * as React from "react"
import type { Session } from "@supabase/supabase-js"

import type { User } from "@/interface/user"
import { RoleName } from "@/interface/user"
import type { ProfileRow } from "@/lib/database.types"
import { clearIdentityScopedCaches } from "@/lib/cache"
import { supabase } from "@/lib/supabase"
import { toUser } from "@/services/mappers"

export interface SignUpInput {
  name: string
  email: string
  password: string
  role: RoleName
  username?: string
}

interface AuthState {
  /** The Supabase session, or null when signed out. */
  session: Session | null
  /** The public.profiles row for the session, once loaded. */
  user: User | null
  /** True until the initial session lookup settles. */
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (input: SignUpInput) => Promise<{ needsEmailConfirmation: boolean }>
  signOut: () => Promise<void>
  /** Re-reads the profile row, e.g. after the user edits it. */
  refreshProfile: () => Promise<void>
}

const AuthContext = React.createContext<AuthState | undefined>(undefined)

async function fetchProfile(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle()
    .returns<ProfileRow>()

  if (error || !data) return null
  return toUser(data)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<Session | null>(null)
  const [user, setUser] = React.useState<User | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    let active = true

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setSession(data.session)
      if (!data.session) setIsLoading(false)
    })

    // Fires on sign-in, sign-out, token refresh and cross-tab changes.
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event, nextSession) => {
        setSession(nextSession)

        // A different person is now using this browser, so any cached response
        // shaped by the previous session must go. See src/lib/cache.ts.
        if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
          void clearIdentityScopedCaches()
        }

        if (!nextSession) {
          setUser(null)
          setIsLoading(false)
        }
      }
    )

    return () => {
      active = false
      subscription.subscription.unsubscribe()
    }
  }, [])

  const userId = session?.user.id ?? null

  React.useEffect(() => {
    if (!userId) return

    let active = true

    // Same reason as useAsyncData: the profile fetch starts because the session
    // id changed, and the UI must not claim "loaded" while it is in flight.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true)

    fetchProfile(userId)
      .then((profile) => {
        if (active) setUser(profile)
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [userId])

  const signIn = React.useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    if (error) throw new Error(error.message)
  }, [])

  const signUp = React.useCallback(async (input: SignUpInput) => {
    const { data, error } = await supabase.auth.signUp({
      email: input.email.trim(),
      password: input.password,
      options: {
        // handle_new_user() reads these to build the profiles row.
        data: {
          name: input.name.trim(),
          username: input.username?.trim().toLowerCase() || null,
          role: input.role,
        },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    })

    if (error) throw new Error(error.message)

    // With "Confirm email" on, Supabase returns a user but no session.
    return { needsEmailConfirmation: Boolean(data.user) && !data.session }
  }, [])

  const signOut = React.useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(error.message)
  }, [])

  const refreshProfile = React.useCallback(async () => {
    if (!userId) return
    setUser(await fetchProfile(userId))
  }, [userId])

  const value = React.useMemo(
    () => ({
      session,
      user,
      isLoading,
      signIn,
      signUp,
      signOut,
      refreshProfile,
    }),
    [session, user, isLoading, signIn, signUp, signOut, refreshProfile]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = React.useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}
