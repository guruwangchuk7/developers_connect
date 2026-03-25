-- Create a table for developer connections
create table if not exists connections (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references auth.users on delete cascade not null,
  receiver_id uuid references auth.users on delete cascade not null,
  status text check (status in ('PENDING', 'ACCEPTED', 'REJECTED')) default 'PENDING',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (sender_id, receiver_id)
);

-- Set up Row Level Security (RLS)
alter table connections enable row level security;

-- Policy: Users can view connections they are part of
create policy "Users can view their own connections." on connections
  for select using (auth.uid() = sender_id or auth.uid() = receiver_id);

-- Policy: Users can send connection requests
create policy "Users can send connection requests." on connections
  for insert with check (auth.uid() = sender_id);

-- Policy: Receivers can update connection status (Accept/Reject)
create policy "Receivers can update connection status." on connections
  for update using (auth.uid() = receiver_id);

-- Enable realtime
alter table connections replica identity full;
