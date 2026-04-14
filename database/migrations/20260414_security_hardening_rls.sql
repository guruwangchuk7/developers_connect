-- Security Hardening Migration: 2026-04-14
-- Implementing comprehensive RLS policies for all sensitive platform tables

-- ==========================================
-- 1. MESSAGES TABLE HARDENING
-- ==========================================
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own messages" ON public.messages;
CREATE POLICY "Users view own messages" ON public.messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

DROP POLICY IF EXISTS "Users can insert messages" ON public.messages;
CREATE POLICY "Users can insert messages" ON public.messages
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = sender_id);


-- ==========================================
-- 2. CONNECTIONS TABLE HARDENING
-- ==========================================
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own connections" ON public.connections;
CREATE POLICY "Users view own connections" ON public.connections
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

DROP POLICY IF EXISTS "Users send connection requests" ON public.connections;
CREATE POLICY "Users send connection requests" ON public.connections
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = sender_id);

DROP POLICY IF EXISTS "Receivers can update status" ON public.connections;
CREATE POLICY "Receivers can update status" ON public.connections
  FOR UPDATE TO authenticated
  USING (auth.uid() = receiver_id)
  WITH CHECK (auth.uid() = receiver_id);


-- ==========================================
-- 3. NOTIFICATIONS TABLE HARDENING
-- ==========================================
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users see own notifications" ON public.notifications;
CREATE POLICY "Users see own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own notifications" ON public.notifications;
CREATE POLICY "Users update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ==========================================
-- 4. APPLICATIONS TABLE HARDENING
-- ==========================================
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view relevant applications" ON public.applications;
CREATE POLICY "Users view relevant applications" ON public.applications
  FOR SELECT USING (auth.uid() = applicant_id OR auth.uid() = project_owner_id);

DROP POLICY IF EXISTS "Users can apply" ON public.applications;
CREATE POLICY "Users can apply" ON public.applications
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = applicant_id);


-- ==========================================
-- 5. TEAM MEMBERS HARDENING
-- ==========================================
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Owners can view own team members" ON public.team_members;
CREATE POLICY "Owners can view own team members" ON public.team_members
  FOR SELECT USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Owners can manage team members" ON public.team_members;
CREATE POLICY "Owners can manage team members" ON public.team_members
  FOR ALL TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);


-- ==========================================
-- 6. INTERACTION HARDENING (Likes & Comments)
-- ==========================================
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own likes" ON public.post_likes;
CREATE POLICY "Users can manage own likes" ON public.post_likes
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own comments" ON public.post_comments;
CREATE POLICY "Users can manage own comments" ON public.post_comments
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ==========================================
-- 7. EVENT HARDENING
-- ==========================================
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Events viewable by everyone" ON public.events;
CREATE POLICY "Events viewable by everyone" ON public.events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Auth users can create events" ON public.events;
CREATE POLICY "Auth users can create events" ON public.events
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = organizer_id);

DROP POLICY IF EXISTS "Organizers can manage own events" ON public.events;
CREATE POLICY "Organizers can manage own events" ON public.events
  FOR ALL TO authenticated
  USING (auth.uid() = organizer_id)
  WITH CHECK (auth.uid() = organizer_id);
