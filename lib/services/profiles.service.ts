import { createClient } from "@/lib/supabase"
import { Profile } from "@/types"


export const ProfilesService = {
  async getById(id: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Profile
  },

  async getAll(limit = 100) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data as Profile[]
  },

  async update(id: string, updates: Partial<Profile>) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Profile
  }
}
