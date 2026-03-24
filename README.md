# 🇧🇹 Bhutan Developer Network (BDN)

**Tagline:** *A working network for builders in Bhutan.*

---

## 🚀 Overview

Bhutan Developer Network (BDN) is a centralized platform designed to connect developers, engineers, and technical builders across Bhutan. It provides a structured environment where individuals can build professional identity, collaborate on projects, ask for technical help, and form teams—something currently missing in the Bhutanese tech ecosystem.

---

## ❗ Problem

The developer ecosystem in Bhutan is fragmented:
- Developers are scattered across Telegram, WhatsApp, and informal networks
- There is no centralized technical identity or reputation system
- Collaboration happens informally and inefficiently
- Students, freelancers, and professionals operate in isolation

**Impact:**
- Missed collaboration opportunities  
- Slower skill development  
- Weak ecosystem growth  

---

## 💡 Solution

BDN introduces a **Bhutan-specific collaboration layer** for developers:
- A unified identity system for builders
- A community-driven help and discussion space
- A structured way to form teams and collaborate
- A simple, focused feed for interaction

👉 BDN is not a social network—it is a **working network for builders**.

---

## 🎯 Objectives

### MVP Goals
- Establish a core developer network in Bhutan
- Enable daily interaction (posts, comments, discussions)
- Make developers visible through structured profiles
- Facilitate real collaboration and team formation

### Success Metrics
- Daily Active Users (DAU)
- Posts and comments per day
- User growth rate (weekly signups)
- Number of team formation posts and collaborations

---

## 👤 Target Users

### Primary Users
- Software developers (frontend, backend, full-stack)
- Computer engineering students
- Freelancers

### Secondary Users
- UI/UX designers
- Tech entrepreneurs
- Engineers with technical crossover (civil, architecture, etc.)

---

## 🧱 Core Features (MVP)

### 1. Developer Profiles (Identity Layer)
- Name, profile image, bio
- Skills (React, Python, etc.)
- GitHub / portfolio links
- Availability status (open to work / looking for team)

👉 Establishes credibility and discoverability

---

### 2. Help Feed (Engagement Engine)
Users can post:
- Technical questions
- Development issues
- Requests for guidance

Features:
- Create post
- Comment
- Like/react

👉 Drives daily activity and knowledge sharing

---

### 3. Team Formation
Users can:
- Post collaboration opportunities
- Define required skills
- Form teams for projects, startups, or hackathons

👉 Enables real-world outcomes

---

### 4. Unified Feed (Interaction Layer)
- Chronological feed (no algorithm initially)
- Includes help, team, and project posts
- Simple filtering (optional)

👉 Keeps the platform focused and usable

---

### 5. Bhutan Verification (Core Differentiator)
- Email verification
- Manual admin approval (MVP)
- Optional phone verification (future)

👉 Ensures a trusted, local network

---

## ⚠️ Out of Scope (MVP)

To maintain focus:
- ❌ AI features
- ❌ Blockchain integration
- ❌ Complex job marketplace
- ❌ Messaging system (future phase)
- ❌ Advanced recommendation algorithms

---

## 🛠️ Tech Stack

### Frontend
- Next.js (App Router)
- Tailwind CSS
- shadcn/ui (components)
- lucide-react (icons)

### Backend
- Supabase:
  - Authentication (Google + Email)
  - PostgreSQL database
  - Realtime updates
  - File storage

### Hosting
- Vercel (Frontend)
- Supabase (Backend)

---

## 🗄️ Data Model (Simplified)

### users
- id, name, email, bio, skills
- github_url, availability
- is_verified

### posts
- id, user_id
- type (help / team / project)
- content, created_at

### comments
- id, post_id, user_id
- content

---

## 🎨 Design Principles

- Clean, modern SaaS-style interface
- Minimal and professional (not social-media-like)
- Card-based layout with soft shadows
- “Breathable UI” with strong spacing and typography
- Fully responsive (mobile + desktop)

---

## 🔐 User Flow

1. User visits landing page  
2. Signs in (Google / Email)  
3. Selects role (Student / Professional / Founder)  
4. Completes profile  
5. Enters dashboard (feed + interactions)  

---

## 🚀 Launch Strategy

### Phase 1 — Private Beta
- Invite 20–30 developers (students + professionals)
- Seed initial content manually

### Phase 2 — Early Growth
- Expand through:
  - Colleges
  - LinkedIn Bhutan tech community
  - Telegram groups

---

## 📈 Roadmap

### Phase 2
- Messaging system
- Notifications
- Developer reputation system

### Phase 3
- Hiring marketplace
- Startup co-founder matching
- Government and institutional integration

---

## ⚠️ Risks & Mitigation

**Low Engagement**
→ Seed content and actively onboard users

**Empty Platform**
→ Pre-create posts and discussions

**Continued Fragmentation**
→ Strong Bhutan-only positioning

---

## 🧠 Vision

BDN is not:
- a social media platform  
- a job portal  

BDN is:
👉 **A collaboration infrastructure for Bhutan’s tech ecosystem**

---

## 📌 Status

🚧 MVP in development  
**Mission:** Professionalize and connect Bhutan’s tech community