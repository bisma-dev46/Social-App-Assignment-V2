# SocialApp

A Facebook-inspired social media platform built with React — sign up, post updates, like, comment, and manage your profile, all persisted entirely in `localStorage`.

## Live Demo

> Not deployed — deployment wasn't required for this assignment. Run locally using the steps below, or see the live in-class demo.

## Screenshots



![Dashboard](./screenshots/Dashboard.png)




![Create Post](./screenshots/Create-post.png)




![People](./screenshots/People.png)




![Chat with a friend](./screenshots/Chatfrnd.png)





![Friend Request](screenshots/Frnd-request.png)



![cnversation](screenshots/cnversation.png)


## Tech Stack

- React (Vite)
- React Router v6 — routing, dynamic routes, protected routes
- Tailwind CSS — styling, dark mode
- React Hook Form — all forms + validation
- Context API — auth state (`AuthContext`)
- clsx — conditional classNames
- localStorage — all data persistence (no backend)

## Features

- Signup / login / logout with validation, session persists across page refresh
- Public feed of posts, guests redirected to `/login` when trying to like/comment
- Create posts with image upload, save as draft or publish, live character counter
- Edit / delete own posts, toggle public/private, publish drafts
- Post detail page with like/unlike and threaded comments
- Add and delete your own comments with inline "Are you sure? Yes / No" confirmation
- Public profile pages with cover image, avatar, bio, location, and public posts
- Profile settings — update name, bio, location, avatar — reflected instantly in the navbar
- Protected `/dashboard/*` routes that redirect guests to `/login`
- Search bar on the feed that filters posts live as you type
- Responsive, dark-mode-aware Tailwind UI
- Code-split pages via `React.lazy` + `Suspense`

## How to Run Locally

```bash
git clone https://github.com/YOUR-USERNAME/social-app-YOUR-NAME.git
cd social-app-YOUR-NAME
npm install
npm run dev


Open http://localhost:5173.
Folder Structure
Code
src/
├── components/
│   ├── layout/       Navbar, Footer
│   ├── post/          PostCard, PostForm, PostActions, CommentSection
│   ├── profile/       ProfileHeader
│   ├── ui/            Button, Input, Modal, Avatar, Badge
│   └── RequireAuth.jsx
├── context/
│   └── AuthContext.jsx
├── hooks/
│   ├── useAuth.js
│   ├── useLocalStorage.js
│   └── usePosts.js
├── pages/
│   ├── FeedPage.jsx, LoginPage.jsx, SignupPage.jsx
│   ├── PostDetailPage.jsx, ProfilePage.jsx, NotFoundPage.jsx
│   └── dashboard/
│       ├── DashboardLayout.jsx, PostsDashboard.jsx
│       ├── CreatePost.jsx, EditPost.jsx, ProfileSettings.jsx
├── utils/
│   ├── storage.js     the only file that touches localStorage
│   └── helpers.js     generateId, formatDate, fileToBase64
├── App.jsx
└── main.jsx

localStorage Data Structure

users
{ id, name, email, password, bio, location, avatar, coverImage, joinedAt }

 posts
 { id, authorId, description, image, isPublic, isDraft, createdAt, updatedAt }

 comments
 { id, postId, authorId, text, createdAt }

 likes
 { id, postId, userId, createdAt }


Add-On Features

Everything below was added on top of Assignment 1. Assignment 1 features above are unchanged.
New Features
Friend System — People You May Know (/people), Friend Requests (/requests, Received/Sent tabs), Friends List (/friends), and relationship-aware buttons on every profile page.


Real-Time One-to-One Chat (/chat, /chat/:userId) — text, image, and video messages between friends, synced live across two browser tabs using the native storage event (no backend, no WebSockets).


AI Integration (OpenAI gpt-4o-mini) — AI-assisted post writing, comment suggestions, profile bio optimisation, and two chat AI modes (suggested replies, and full auto-reply on the user's behalf).


AI Features — How Each One Works
AI Writing Assistant (Create/Edit Post) — a collapsible panel where you type a short idea; gpt-4o-mini returns a ready-to-edit post description. Nothing is ever auto-submitted — you always click "Use This Content" first.
AI Suggest Comment (Post Detail) — reads the post's description and generates one short, relevant comment suggestion that fills the comment box for you to edit or replace.


AI Optimise Bio (Profile Settings) — reads your current name/bio/location and returns an improved, under-150-character bio in a suggestion card.
AI Chat — Mode 1 (Suggested Replies, always on) — after your friend sends a message, 3 short reply chips appear based on the last 5 messages of context. Clicking a chip fills the input; it never sends automatically.
AI Chat — Mode 2 (Auto-Reply, opt-in only) — toggled from the ✨ icon in the chat header. When enabled, AI replies on your behalf 1-2 seconds after your friend messages you, and every AI-sent message is marked with a ✨ icon so you always know what AI actually sent.
Every AI call uses gpt-4o-mini with max_tokens: 300, and every call is wrapped in try/catch — a failed request never crashes the app (chat suggestions fail silently; other features show a small inline error).


Real-Time Chat Architecture

There is no backend, so real-time sync is simulated using the browser's built-in storage event: whenever one tab writes to localStorage, every other tab on the same origin automatically receives a storage event. useChat.js listens for this event with window.addEventListener('storage', handler) inside a useEffect, re-reads the messages key, and updates React state — so a message sent in Tab A (User A) appears instantly in Tab B (User B) with no page refresh. The listener is always cleaned up with removeEventListener in the effect's return function to avoid memory leaks. Conversation IDs are generated by sorting both user IDs alphabetically (getConversationId in utils/chatHelpers.js), so a chat opened from either side always maps to the same conversation.


Bonus Features Implemented

Message Read Receipts — single ✓ when sent, double ✓✓ once the recipient opens the conversation.
Emoji Reactions — hover any message to react with 👍❤️😂😮😢; click again to remove your reaction.
Message Search in Chat — 🔍 icon in the chat header opens a live search with match count and highlighted results.
AI Chat Personality — Friendly / Professional / Casual / Funny, selectable from the AI menu, saved per user and shown in the chat header.
Mutual Friends Count — shown under each card on the People page.