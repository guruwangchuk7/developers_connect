"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Profile } from "@/types"

import { ProfilesService } from "@/lib/services/profiles.service"
import { TeamService } from "@/lib/services/team.service"

export function useIdentityData() {
   const supabase = createClient()
   const router = useRouter()
   const [user, setUser] = React.useState<any>(null)
   const [profile, setProfile] = React.useState<Profile | null>(null)
   const [isLoading, setIsLoading] = React.useState(true)
   const [saving, setSaving] = React.useState(false)
   const [team, setTeam] = React.useState<any[]>([])
   const [activeTab, setActiveTab] = React.useState("Profile")
   
   const [editData, setEditData] = React.useState({
      bio: "",
      github_url: "",
      portfolio_url: "",
      availability: "Looking for team"
   })

   const [avatarFile, setAvatarFile] = React.useState<File | null>(null)
   const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
   const [isDragging, setIsDragging] = React.useState(false)
   const [isFilterOpen, setIsFilterOpen] = React.useState(false)

   const fetchTeam = async (userId: string) => {
      try {
         const data = await TeamService.getByOwner(userId)
         setTeam(data)
      } catch (e) {
         console.error("Team sync failed", e)
      }
   }

   React.useEffect(() => {
      async function getSession() {
         try {
            if (!supabase) return;
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
               router.push('/join')
               return
            }
            setUser(session.user)
            fetchTeam(session.user.id)

            const data = await ProfilesService.getById(session.user.id)

            if (data) {
               setProfile(data)
               setPreviewUrl(data.avatar_url || session.user.user_metadata?.avatar_url || null)
               setEditData({
                  bio: data.bio || "",
                  github_url: data.github_url || "",
                  portfolio_url: data.portfolio_url || "",
                  availability: data.availability || "Looking for team"
               })
            }
         } catch (e) {
            console.error(e)
         } finally {
            setIsLoading(false)
         }
      }
      getSession()
   }, [])

   const handleFullUpdate = async () => {
      if (!user) return
      setSaving(true)
      try {
         await ProfilesService.update(user.id, {
            bio: editData.bio,
            github_url: editData.github_url,
            portfolio_url: editData.portfolio_url,
            availability: editData.availability
         })
         router.push('/dashboard')
      } catch (e) {
         console.error("Update failed", e)
      } finally {
         setSaving(false)
      }
   }

   return {
      user,
      profile,
      isLoading,
      saving,
      team,
      setTeam,
      activeTab,
      setActiveTab,
      editData,
      setEditData,
      avatarFile,
      setAvatarFile,
      previewUrl,
      setPreviewUrl,
      isDragging,
      setIsDragging,
      isFilterOpen,
      setIsFilterOpen,
      handleFullUpdate,
      fetchTeam,
      supabase,
      router
   }
}
