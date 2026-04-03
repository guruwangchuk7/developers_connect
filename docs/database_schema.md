# DevelopersConnect Supabase Schema & SQL

This artifact contains the complete database schema for the **DevelopersConnect** application, based on a full analysis of the frontend codebase.

## 1. Detected Entities & Relationships

Based on the inspection of `app/dashboard/page.tsx`, `app/directory/page.tsx`, and `app/onboarding/page.tsx`, the following entity structure has been identified:

- **Profiles**: Extended user identity.
  - Linked to `auth.users` (id).
  - Stores: `full_name`, `role`, `bio`, `avatar_url`, `skills`, `availability`, `github_url`, `portfolio_url`, `location`.
- **Posts (Network Feed)**: Multi-type content.
  - Types: `UPDATE`, `HELP`, `TEAM`, `PROJECT`.
  - Content: Technical breakthrough, Blockers, Roles needed, Launched projects.
- **Connections**: Peer-to-peer networking.
  - Stores: `sender_id`, `receiver_id`, `status` (`PENDING`, `ACCEPTED`, `REJECTED`).
- **Interactions**:
  - `post_likes`: User-post relations.
  - `post_comments`: Discussion threads.
- **Communications**:
  - `messages`: Workspace direct text/synchronization.
- **Engagements**:
  - `events`: Community-driven uploads and workshops.
- **Insights**:
  - `leaderboard`: Rank-based view of high-impact contributors.

---

## 2. Complete Supabase SQL (Copy-Paste Ready)

Run the following SQL in the [Supabase SQL Editor](https://app.supabase.com/project/_/sql).

```sql
/**
 * DEVELOPERS CONNECT - DATABASE SCHEMA
 * Version: 2.1 (Optimized for Production)
 */

-- 1. ENUM TYPES
DO $$ BEGIN
    CREATE TYPE post_type AS ENUM ('UPDATE', 'HELP', 'TEAM', 'PROJECT');
    CREATE TYPE connection_status AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. PROFILES TABLE (Extends Auth.Users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  full_name TEXT,
  role TEXT,
  bio TEXT,
  avatar_url TEXT,
  skills TEXT[] DEFAULT '{}',
  availability TEXT DEFAULT 'Open to work',
  github_url TEXT,
  portfolio_url TEXT,
  location TEXT DEFAULT 'Bhutan',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. POSTS TABLE (The Network Feed)
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type post_type NOT NULL DEFAULT 'UPDATE',
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. CONNECTIONS TABLE (Networking)
CREATE TABLE IF NOT EXISTS public.connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status connection_status DEFAULT 'PENDING',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE (sender_id, receiver_id),
  CONSTRAINT different_users CHECK (sender_id <> receiver_id)
);

-- 5. POST LIKES (Normalized Relationships)
CREATE TABLE IF NOT EXISTS public.post_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE (post_id, user_id)
);

-- 6. POST COMMENTS
CREATE TABLE IF NOT EXISTS public.post_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. MESSAGES (Workspace Synchronizations)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. EVENTS
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organizer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  venue TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

---
--- TRIGGERS FOR AUTO-STATS
---

-- Function to handle likes count
CREATE OR REPLACE FUNCTION public.handle_post_like()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE public.posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE public.posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_post_like
AFTER INSERT OR DELETE ON public.post_likes
FOR EACH ROW EXECUTE FUNCTION public.handle_post_like();

-- Function to handle comments count
CREATE OR REPLACE FUNCTION public.handle_post_comment()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE public.posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE public.posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_post_comment
AFTER INSERT OR DELETE ON public.post_comments
FOR EACH ROW EXECUTE FUNCTION public.handle_post_comment();

---
--- ROW LEVEL SECURITY (RLS)
---

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can edit their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Posts Policies
CREATE POLICY "Posts are viewable by everyone" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts" ON public.posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own posts" ON public.posts FOR DELETE USING (auth.uid() = user_id);

-- Connections Policies
CREATE POLICY "Users can view their own connections" ON public.connections FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send requests" ON public.connections FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Receivers can update status" ON public.connections FOR UPDATE USING (auth.uid() = receiver_id);

-- Messages Policies
CREATE POLICY "Private syncs are visible only to participants" ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Events Policies
CREATE POLICY "Events are viewable by everyone" ON public.events FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create events" ON public.events FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

---

## 3. CRUD Example Queries

### **CREATE (Insert)**
```sql
-- Create a new Technical Update post
INSERT INTO public.posts (user_id, type, content, tags) 
VALUES ('YOUR_USER_UUID', 'UPDATE', 'Just synchronized the national auth layer! 🚀', '{"auth", "security"}');

-- Send a connection request
INSERT INTO public.connections (sender_id, receiver_id)
VALUES ('USER_A_UUID', 'USER_B_UUID');
```

### **READ (Select with Joins)**
```sql
-- Fetch feed with profile information
SELECT p.*, pr.full_name, pr.role, pr.avatar_url
FROM public.posts p
JOIN public.profiles pr ON p.user_id = pr.id
ORDER BY p.created_at DESC
LIMIT 20;

-- Fetch active DMs for a user
SELECT * FROM public.messages
WHERE (sender_id = 'YOUR_UUID' OR receiver_id = 'YOUR_UUID')
ORDER BY created_at ASC;
```

### **UPDATE**
```sql
-- Accept a connection request
UPDATE public.connections 
SET status = 'ACCEPTED' 
WHERE sender_id = 'SENDER_UUID' AND receiver_id = 'YOUR_UUID';
```

### **DELETE**
```sql
-- Unlike a post
DELETE FROM public.post_likes 
WHERE post_id = 'POST_UUID' AND user_id = 'YOUR_UUID';
```

---

## 4. Leaderboard View (Performance Optimized)

Run this to create the leaderboard logic that factors in connections and posts.

```sql
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT 
  pr.id,
  pr.full_name,
  pr.role,
  pr.avatar_url,
  (SELECT count(*) FROM public.posts WHERE user_id = pr.id) as post_count,
  (SELECT count(*) FROM public.connections WHERE (sender_id = pr.id OR receiver_id = pr.id) AND status = 'ACCEPTED') as connection_count,
  ((SELECT count(*) FROM public.posts WHERE user_id = pr.id) * 10 + 
   (SELECT count(*) FROM public.connections WHERE (sender_id = pr.id OR receiver_id = pr.id) AND status = 'ACCEPTED') * 5) as impact_score
FROM public.profiles pr
ORDER BY impact_score DESC;
```

---

## 5. Integration Notes

### Database → Frontend Mapping
- **Profiles**: Used across GlobalHeader, Sidebar, ProfilePage, and Onboarding.
- **Posts**: Feeds all tabs in the Dashboard (Updates, Help, Teams, Projects).
- **Connections**: Powers the "Connect" buttons in the Directory and Dashboard Sidebar.
- **Messages**: Designed to back the `MessagesOverlay` component.

### Suggested Storage Structure
For high-performance media handling, create two buckets in Supabase Storage:
1.  `avatars`: (Public) - For profile pictures.
2.  `projects`: (Public) - For project hero images and attachments.

### Minimal Code Changes Required
To fully integrate this schema:
1.  In `app/dashboard/page.tsx`, the `fetchPosts` logic already targets the `posts` table name. Now with RLS enabled, ensure user sessions are valid.
2.  The `leaderboard` view can be queried directly via Supabase client: `supabase.from('leaderboard').select('*')`.
3.  Add `avatar_url` to the `onboarding` flow (`app/onboarding/page.tsx`) to allow users to set their sign-in image.
