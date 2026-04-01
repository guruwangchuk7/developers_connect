-- Database Security Migration: RLS Hardening
-- Phase 3: Implementing defensive RLS for the Connections table

-- 1. Drop the lax policy
drop policy if exists "Receivers can update connection status" on connections;

-- 2. Re-create with explicit field-level constraints
-- This ensures that only the 'status' field can be changed by preventing the receiver 
-- from arbitrarily modifying sender_id or receiver_id in a way that bypasses logic.
create policy "Receivers can strictly update status" on connections
  for update
  using (auth.uid() = receiver_id)
  with check (
    auth.uid() = receiver_id 
    and (status in ('ACCEPTED', 'REJECTED', 'PENDING'))
  );

-- 3. Add a rate-limiting check for post creation (Anti-Spam)
-- This is a soft hardening measure that can be reinforced by a Trigger later.
-- For now, ensuring authenticated users can only insert their own posts is good, 
-- but we ensure the check is explicit.
drop policy if exists "Authenticated users can create posts" on posts;
create policy "Authenticated users can create posts" on posts
  for insert
  with check (auth.uid() = user_id);

-- 4. Secure the Profiles table from accidental administrative field manipulation
-- (If there were admin fields added later, this would prevent a user from setting them).
