-- 
-- 🚀 POST LIKES INTEGRITY SYSTEM
-- This script implements a secure, database-level trigger to automate post statistics.
-- 

-- 1. Create the likes junction table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.post_likes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(post_id, user_id)
);

-- 2. Set up RLS for likes table
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all likes" ON public.post_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can toggle their own likes" ON public.post_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own likes" ON public.post_likes
  FOR DELETE USING (auth.uid() = user_id);

-- 3. Create the Function to sync likes_count
CREATE OR REPLACE FUNCTION public.handle_post_like_stat()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE public.posts 
    SET likes_count = likes_count + 1 
    WHERE id = NEW.post_id;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE public.posts 
    SET likes_count = GREATEST(0, likes_count - 1) 
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create the Trigger
DROP TRIGGER IF EXISTS on_post_like_stat ON public.post_likes;
CREATE TRIGGER on_post_like_stat
AFTER INSERT OR DELETE ON public.post_likes
FOR EACH ROW EXECUTE FUNCTION public.handle_post_like_stat();
