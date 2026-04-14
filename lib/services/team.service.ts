import { createClient } from "@/lib/supabase"

const supabase = createClient()

export const TeamService = {
  async getByOwner(ownerId: string) {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data || []
  },

  async addMember(ownerId: string, fullName: string, email: string, role: string) {
    const { data, error } = await supabase
      .from('team_members')
      .insert([{
        owner_id: ownerId,
        full_name: fullName,
        email: email,
        role: role
      }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async removeMember(id: string) {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}
