"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase"
import { Profile } from "@/types"
import { Session, User, AuthChangeEvent } from "@supabase/supabase-js"
import { analytics } from "@/lib/analytics"

interface ProfileContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  isLoading: boolean
  refreshProfile: () => Promise<void>
}

const ProfileContext = React.createContext<ProfileContextType | undefined>(undefined)

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null)
  const [session, setSession] = React.useState<Session | null>(null)
  const [profile, setProfile] = React.useState<Profile | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const supabase = React.useMemo(() => createClient(), [])

  const fetchProfile = React.useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()
    if (data) setProfile(data)
  }, [supabase])

  const refreshProfile = React.useCallback(async () => {
    if (user) await fetchProfile(user.id)
  }, [user, fetchProfile])

  React.useEffect(() => {
    async function init() {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      setSession(currentSession)
      setUser(currentSession?.user ?? null)
      
      if (currentSession?.user) {
        analytics.identify(currentSession.user.id)
        await fetchProfile(currentSession.user.id)
      } else {
        analytics.identify(null)
      }
      setIsLoading(false)
    }

    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        analytics.identify(session.user.id)
        fetchProfile(session.user.id)
      } else {
        analytics.identify(null)
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, fetchProfile])

  return (
    <ProfileContext.Provider value={{ user, profile, session, isLoading, refreshProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const context = React.useContext(ProfileContext)
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider")
  }
  return context
}
