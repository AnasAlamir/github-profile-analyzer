# 🚀 GitHub Profile Explorer & AI Analyzer

A full-stack web application built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Groq AI (gpt-oss-20b)** that allows users to search, analyze, compare GitHub profiles, and interact with repository codebases using grounded AI.

🔗 **Live Demo**: [https://github-profile-analyzer-pi-nine.vercel.app/](https://github-profile-analyzer-pi-nine.vercel.app/)  

---

## ✨ Features

### 1. 🔍 Profile & Repository Explorer
- **User Search**: Query any GitHub handle (e.g. `octocat`, `torvalds`, `gaearon`).
- **Profile Card**: Displays avatar, display name, handle, bio, company, location, followers, following, and public repos count.
- **On-Demand Paginated Repositories**: Displays public repositories in a 2-column grid with **10 items per page** on-demand pagination, reducing API overhead.

### 2. ⚔️ Developer Metric Comparison
- Compare two GitHub developers side-by-side.
- Calculates total public repos, total stars received, total repository forks, followers, and top programming languages.
- Highlights winners with a crown `👑` indicator using explicit type-safe logic.

### 3. ✨ AI Profile Summarization & Analysis
- Server-side Next.js API Route Handler (`POST /api/ai/summary`).
- Uses **Groq API** (`openai/gpt-oss-20b `) to generate structured AI insights:
  - 🎯 **Executive Summary**
  - ⚡ **Key Technical Strengths**
  - 🌟 **Portfolio Highlights**
- Single-click request protection (disables duplicate button clicks while loading or after completion).
- Rendered cleanly with `react-markdown`.

### 4. 🤖 Grounded AI Repository Streaming Chat
- Launch an interactive AI Chat modal for any specific repository.
- **Grounded Context**: Answers are grounded in the repository's real data:
  - 📄 **README Document** (`/repos/{owner}/{repo}/readme`)
  - 📁 **File & Directory Structure** (`/repos/{owner}/{repo}/contents`)
  - 📜 **Recent Commits** (`/repos/{owner}/{repo}/commits`)
- **Real-Time Streaming**: AI responses stream live word-by-word (`stream: true`).
- **Per-Repo History**: Conversation history automatically persists per repository in `localStorage` with option to clear history.

### 5. 📝 User & Repository Notes System
- Save custom notes for any user profile or repository.
- Notes persist in `localStorage` and automatically display when visiting a profile or repository.
- Dedicated **`📝 Saved Notes`** dashboard tab to manage all saved notes in one place.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: Groq API (`openai/gpt-oss-20b`)
- **Markdown Rendering**: `react-markdown`
- **Data Persistence**: Browser `localStorage`
- **Architecture**: Modular feature-based folder organization (`components/explorer`, `components/compare`, `components/notes`, `components/common`, `lib/`, `types/`)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Installation & Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AnasAlamir/github-profile-analyzer.git
   cd github-profile-analyzer
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Add your **Groq API Key** (get a free key at [Groq Console](https://console.groq.com/)):
   ```env
   GROQ_API_KEY=gsk_your_groq_api_key_here
   MODEL_NAME=openai/gpt-oss-20b 
   # Optional: GitHub Personal Access Token (increases API rate limit from 60 to 5,000 req/hr)
   # NEXT_PUBLIC_GITHUB_TOKEN=your_github_token_here
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```

5. **Open in Browser**:
   Visit [http://localhost:3000](http://localhost:3000).