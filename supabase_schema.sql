-- Create a table for photo likes
create table if not exists public.photo_likes (
  id uuid default gen_random_uuid() primary key,
  photo_id bigint references public.photos(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(photo_id, user_id)
);

-- Enable Row Level Security (RLS)
alter table public.photo_likes enable row level security;

-- Policies

-- Everyone can view likes (needed to count)
create policy "Likes are visible to everyone"
  on public.photo_likes for select
  using ( true );

-- Authenticated users can insert their own like
create policy "Authenticated users can like photos"
  on public.photo_likes for insert
  with check ( auth.uid() = user_id );

-- Authenticated users can delete their own like
create policy "Authenticated users can unlike photos"
  on public.photo_likes for delete
  using ( auth.uid() = user_id );

-- Functionality Note:
-- To show the list of users who liked a photo to the owner:
-- We will query 'photo_likes' join 'profiles' (assuming public.profiles table exists with display_name).
-- e.g., select p.display_name from photo_likes l join profiles p on l.user_id = p.id where l.photo_id = ?
-- Add is_archived column to photos table for soft-delete/archiving
-- ALTER TABLE public.photos ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;
