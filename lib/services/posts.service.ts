import { createClient } from "@/lib/supabase"
import { PostType } from "@/types"

export const PostsService = {
  async getAll(limit = 20) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('posts')
      .select(`*, profiles!user_id (full_name, role, avatar_url)`)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  },

  async getByType(type: PostType, limit = 20) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('posts')
      .select(`*, profiles!user_id (full_name, role, avatar_url)`)
      .eq('type', type)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  },

  async create(userId: string, type: string, content: string, tags: string[] = []) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('posts')
      .insert([{
        user_id: userId,
        type: type,
        content: content,
        tags: tags
      }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(postId: string) {
    const supabase = createClient()
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)

    if (error) throw error
  },

  async like(postId: string, userId: string) {
    const supabase = createClient()
    const { error } = await supabase
      .from('post_likes')
      .insert([{ post_id: postId, user_id: userId }])

    if (error) throw error
  },

  async unlike(postId: string, userId: string) {
    const supabase = createClient()
    const { error } = await supabase
      .from('post_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId)

    if (error) throw error
  },

  async getUserLikes(userId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('post_likes')
      .select('post_id')
      .eq('user_id', userId)

    if (error) throw error
    return data?.map((l: { post_id: string }) => l.post_id) || []
  }
}
