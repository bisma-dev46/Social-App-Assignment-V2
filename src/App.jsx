import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import RequireAuth from './components/RequireAuth'
import { useAuth } from './hooks/useAuth'

// Each page is its own chunk, only downloaded when the user actually visits it.
const FeedPage = lazy(() => import('./pages/FeedPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const SignupPage = lazy(() => import('./pages/SignupPage'))
const PostDetailPage = lazy(() => import('./pages/PostDetailPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

const DashboardLayout = lazy(() => import('./pages/dashboard/DashboardLayout'))
const PostsDashboard = lazy(() => import('./pages/dashboard/PostsDashboard'))
const CreatePost = lazy(() => import('./pages/dashboard/CreatePost'))
const EditPost = lazy(() => import('./pages/dashboard/EditPost'))
const ProfileSettings = lazy(() => import('./pages/dashboard/ProfileSettings'))

// Assignment 2 — new pages
const PeoplePage = lazy(() => import('./pages/PeoplePage'))
const FriendRequestsPage = lazy(() => import('./pages/FriendRequestsPage'))
const FriendsPage = lazy(() => import('./pages/FriendsPage'))
const ChatPage = lazy(() => import('./pages/ChatPage'))

function LoadingFallback() {
  return (
    <div className="flex h-64 items-center justify-center">
      <span className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
    </div>
  )
}

export default function App() {
  const { isAuthenticated, touchLastSeen } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) return
    touchLastSeen()
    const interval = setInterval(touchLastSeen, 60000)
    return () => clearInterval(interval)
  }, [isAuthenticated])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<FeedPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/posts/:postId" element={<PostDetailPage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />

            <Route path="/people" element={<RequireAuth><PeoplePage /></RequireAuth>} />
            <Route path="/requests" element={<RequireAuth><FriendRequestsPage /></RequireAuth>} />
            <Route path="/friends" element={<RequireAuth><FriendsPage /></RequireAuth>} />
            <Route path="/chat" element={<RequireAuth><ChatPage /></RequireAuth>} />
            <Route path="/chat/:userId" element={<RequireAuth><ChatPage /></RequireAuth>} />

            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <DashboardLayout />
                </RequireAuth>
              }
            >
              {/* index route -> redirect target could go here; we default to /dashboard/posts via sidebar */}
              <Route path="posts" element={<PostsDashboard />} />
              <Route path="create" element={<CreatePost />} />
              <Route path="edit/:postId" element={<EditPost />} />
              <Route path="settings" element={<ProfileSettings />} />
            </Route>

            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </div>
      <Footer />
    </div>
  )
}
