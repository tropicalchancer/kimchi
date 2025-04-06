# Kimchi - Twitter Clone with Projects

A Twitter-like application built with Next.js and Supabase, featuring a unique projects feature that allows users to organize their posts into projects.

## Features

- Twitter-like post creation and feed
- Project management
- User authentication
- Responsive design
- Real-time updates

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Supabase (Authentication & Database)
- Tailwind CSS
- React Icons

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your Supabase project:
   - Create a new project at [Supabase](https://supabase.com)
   - Get your project URL and anon key
   - Create the following tables in your Supabase database:

   ```sql
   -- Profiles table
   create table profiles (
     id uuid references auth.users on delete cascade,
     username text unique,
     full_name text,
     avatar_url text,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null,
     primary key (id)
   );

   -- Projects table
   create table projects (
     id uuid default uuid_generate_v4() primary key,
     name text not null,
     description text,
     user_id uuid references profiles(id) on delete cascade,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null
   );

   -- Posts table
   create table posts (
     id uuid default uuid_generate_v4() primary key,
     content text not null,
     user_id uuid references profiles(id) on delete cascade,
     project_id uuid references projects(id) on delete set null,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null
   );
   ```

4. Create a `.env.local` file in the root directory with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `src/app` - Next.js app router pages
- `src/components` - Reusable React components
- `src/lib` - Utility functions and configurations
- `src/types` - TypeScript type definitions

## Contributing

Feel free to submit issues and enhancement requests!
