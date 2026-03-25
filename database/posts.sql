-- Create a table for dashboard posts
create table if not exists posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  type text not null check (type in ('HELP', 'TEAM', 'PROJECT')),
  content text not null,
  tags text[] default array[]::text[],
  likes_count integer default 0,
  comments_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table posts enable row level security;

create policy "Posts are viewable by everyone" on posts for select using (true);

create policy "Authenticated users can create posts" on posts for insert with check (auth.uid() = user_id);

create policy "Users can delete their own posts" on posts for delete using (auth.uid() = user_id);
