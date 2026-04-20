"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Profile } from "@/types"

import { ProfilesService } from "@/lib/services/profiles.service"
import { TeamService } from "@/lib/services/team.service"
import { useProfile } from "@/providers/profile-provider"

export function useIdentityData() {
   const supabase = createClient()
   const router = useRouter()
   const { user, profile, isLoading: isProfileLoading } = useProfile()
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
     if (user) {
       fetchTeam(user.id)
       if (profile) {
          setPreviewUrl(profile.avatar_url || (user as any).user_metadata?.avatar_url || null)
          setEditData({
             bio: profile.bio || "",
             github_url: profile.github_url || "",
             portfolio_url: profile.portfolio_url || "",
             availability: profile.availability || "Looking for team"
          })
       }
       setIsLoading(false)
     } else if (!isProfileLoading) {
       router.push('/join')
     }
   }, [user, profile, isProfileLoading])

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
