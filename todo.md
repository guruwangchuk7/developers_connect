# Project Todo: Bhutan Developer Network (BDN)

This todo list breaks down the BDN project into manageable, feature-specific tasks based on the PRD, Design Document, and Tech Stack.

## Phase 1: Foundation & Design System
- [ ] Initialize Next.js (App Router) project environment
- [ ] Configure `tailwind.config.ts` with brand "DNA":
    - [ ] Add colors: `#003E6B` (Navy), `#0F172A` (Text), etc.
    - [ ] Configure typography: Inter (Variable) with `-0.04em` letter spacing for headings.
- [ ] Install Core Dependencies:
    - [ ] `shadcn/ui` components (Button, Card, Input, Toast, Dialog, Avatar).
    - [ ] `lucide-react` for iconography.
    - [ ] `@supabase/supabase-js` and `@supabase/ssr`.
- [ ] Set up Global Layout & Navigation:
    - [ ] Implement Global Header (Logo, Text-only links, Auth CTAs).
    - [ ] Implement Landing Page Hero Section ("Build the future of Bhutanese Tech").
    - [ ] Footer with essential links.

## Phase 2: Backend & Authentication
- [ ] Initialize Supabase Project:
    - [ ] Set up Auth providers (Google & GitHub).
    - [ ] Create `users` table with schema: `id, name, email, bio, skills, github_url, availability, role, is_verified`.
- [ ] Implement Authentication Flow:
    - [ ] Login/Sign-up page using Supabase Auth.
    - [ ] Middleware for route protection.
- [ ] **Contextual Onboarding**:
    - [ ] Build multi-step onboarding flow for Role Selection ([Student, Professional, Recruiter/Founder]).
    - [ ] Save profile data & role to Supabase.

## Phase 3: Developer Profiles (Identity Layer)
- [ ] Develop Profile Detail Page (`/profile/[id]`):
    - [ ] Implement "Identity Card" design (White background, 1px border, soft shadow).
    - [ ] Display Bio, Skills (as tags), GitHub link, and Availability status.
- [ ] Build Edit Profile Interface:
    - [ ] Form to update personal details, skills (array), and availability.
    - [ ] Integrate Supabase Storage for profile photo uploads.
- [ ] Reputation Grid:
    - [ ] Implement "Directory" page showing all developers using Identity Cards.
    - [ ] Add scroll animations to cards as specified in the design doc.

## Phase 4: Interaction Feed (Core Engagement)
- [ ] Database Setup for Posts & Comments:
    - [ ] Create `posts` table: `id, user_id, type (help/team/project), content, created_at`.
    - [ ] Create `comments` table: `id, post_id, user_id, content`.
- [ ] Build Dashboard/Feed (`/dashboard`):
    - [ ] Chronological chronological feed of posts.
    - [ ] Category Filters: "Help", "Team", "Project".
- [ ] Post Creation:
    - [ ] Build Create Post Modal with type selection.
    - [ ] Implement real-time updates using Supabase Realtime.
- [ ] Post Interactions:
    - [ ] Commenting system on posts.
    - [ ] Simple "Like/React" functionality.

## Phase 5: Team Formation & Collaboration
- [ ] Enhance "Team" Posts:
    - [ ] UI for team-specific fields (Required skills, Team size).
    - [ ] "Join Team" action that notifies the creator.
- [ ] Specialized Feed View:
    - [ ] "Looking for Team" filtered view to facilitate collaboration.

## Phase 6: Bhutan Verification & Trust
- [ ] Verification Logic:
    - [ ] Implement simple email domain check or manual admin flag (`is_verified`).
    - [ ] Add "Success/Auth" brand badges to verified profiles.
- [ ] Admin Portal (MVP):
    - [ ] Basic dashboard for manual user verification and post moderation.

## Phase 7: Polish & Launch
- [ ] Responsive Audit: Ensure professional "Breathable UI" works on mobile.
- [ ] Performance Optimization: Skeleton loading states for the feed and profiles.
- [ ] SEO & Metadata: Implement Meta tags for sharing profiles/projects.
- [ ] Deployment: Final deployment to Vercel.
