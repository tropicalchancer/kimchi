# Kimchi Cosyweb Protocol 🍲✨

## What is the Kimchi Cosyweb Protocol?

The Kimchi Cosyweb Protocol is an open standard designed to help groups, communities, or clusters of makers, collaborators, or friends build supportive online spaces. Inspired by concepts like Venkatesh Rao’s "cosyweb," Other Internet’s "Squad Wealth," Kevin Kwok’s observations on friend groups, and Edge City-style popup villages, Kimchi makes it easy for people to spin up cozy, flexible spaces suited to their specific interests and dynamics.

---

## Why Kimchi?

Kimchi is uniquely flavorful, crafted intentionally in thoughtfully-sized batches. Similarly, thriving communities emerge when crafted deliberately and authentically. Every Kimchi Cosyweb community develops its own distinct culture, flavor, and supportive rituals, fostering meaningful interactions without necessarily requiring everyone to know each other personally.

---

## Core Principles

### 1. Cosiness First
Kimchi communities prioritize warmth, friendliness, and genuine interaction. While groups don’t need to be small enough for everyone to know each other personally, they should remain manageable enough for meaningful interaction, mutual support, and accountability.

### 2. Transparent Accountability
Regularly sharing tasks, goals, or progress creates a supportive atmosphere of gentle accountability. Consistent visibility helps members feel encouraged to stay motivated, engaged, and connected.

### 3. Easy and Accessible
Setting up a Kimchi Cosyweb instance should be frictionless and simple, emphasizing immediate interaction rather than technical complexity. The goal is ease of entry and participation, allowing members to focus on the community experience itself.

---

## How It Works

To create your Kimchi Cosyweb group, choose a meaningful name, invite members aligned with your group’s interests, and establish simple guidelines. Members regularly share tasks, daily progress, or reflections. Community interactions—through comments, emoji responses, or supportive nudges—encourage accountability and positivity. Over time, communities organically celebrate milestones, consistency, and collective achievements, nurturing a vibrant and supportive atmosphere.

---

## Ideal Group Size

Kimchi communities are flexible in size, ranging comfortably from small groups to several hundred active participants. The focus isn't on strict membership limits but rather on maintaining a cozy, accountable dynamic. As communities grow larger, they can naturally split into specialized subgroups or channels, preserving meaningful connections and engagement.

---

## Example Use Cases

- **Maker Squads:** Groups of builders tracking and sharing daily productivity.
- **Study Circles:** Learners consistently sharing goals and progress.
- **Creative Pods:** Artists, musicians, or writers supporting each other’s consistent practice.
- **Wellness Groups:** Friends or peers motivating each other toward personal health and wellness goals.
- **Popup Villages:** Temporary communities inspired by Edge City-style popup villages, fostering collective accountability and shared experiences.

---

## Features

- Twitter-like post creation and feed
- Project management
- User authentication
- Responsive design
- Real-time updates

---

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Supabase (Authentication & Database)
- Tailwind CSS
- React Icons

---


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
