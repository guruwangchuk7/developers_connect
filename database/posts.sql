-- 1. Create the 'posts' table (if you haven't yet)
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

-- 2. Create the 'connections' table
create table if not exists connections (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references profiles(id) on delete cascade not null,
  receiver_id uuid references profiles(id) on delete cascade not null,
  status text check (status in ('PENDING', 'ACCEPTED', 'REJECTED')) default 'PENDING',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (sender_id, receiver_id)
);

-- 3. Set up Row Level Security
alter table posts enable row level security;
alter table connections enable row level security;

create policy "Posts are viewable by everyone" on posts for select using (true);
create policy "Authenticated users can create posts" on posts for insert with check (auth.uid() = user_id);
