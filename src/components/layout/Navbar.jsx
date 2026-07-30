import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useFriends } from '../../hooks/useFriends'
import { useTheme } from '../../context/ThemeContext'
import { getTotalUnreadCount } from '../../utils/chatHelpers'
import { useState, useEffect } from 'react'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'

export default function Navbar() {
  const { currentUser, isAuthenticated, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const { getPendingReceivedCount } = useFriends()
  const [unreadCount, setUnreadCount] = useState(0)

  const pendingCount = isAuthenticated ? getPendingReceivedCount(currentUser.id) : 0

  useEffect(() => {
    if (!isAuthenticated) return
    function refresh() {
      setUnreadCount(getTotalUnreadCount(currentUser.id))
    }
    refresh()
    window.addEventListener('storage', refresh)
    const interval = setInterval(refresh, 3000)
    return () => {
      window.removeEventListener('storage', refresh)
      clearInterval(interval)
    }
  }, [isAuthenticated, currentUser?.id])

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-brand-100 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-[#14101F]/85">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="font-display text-2xl font-extrabold text-gradient">
          SocialApp
        </Link>

        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            <nav className="hidden items-center gap-1 text-sm font-semibold text-gray-600 dark:text-gray-300 md:flex">
              <Link to="/people" className="rounded-full px-3 py-1.5 transition-colors hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-gray-800 dark:hover:text-brand-300">
                People
              </Link>
              <Link to="/requests" className="relative rounded-full px-3 py-1.5 transition-colors hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-gray-800 dark:hover:text-brand-300">
                🔔
                {pendingCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-white">
                    {pendingCount > 9 ? '9+' : pendingCount}
                  </span>
                )}
              </Link>
              <Link to="/friends" className="rounded-full px-3 py-1.5 transition-colors hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-gray-800 dark:hover:text-brand-300">
                Friends
              </Link>
              <Link to="/chat" className="relative rounded-full px-3 py-1.5 transition-colors hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-gray-800 dark:hover:text-brand-300">
                Chat
                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
              <Link to="/dashboard/posts" className="rounded-full px-3 py-1.5 transition-colors hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-gray-800 dark:hover:text-brand-300">
                Dashboard
              </Link>
            </nav>

            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="flex h-9 w-9 items-center justify-center rounded-full text-lg text-gray-500 transition-colors hover:bg-brand-50 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            <Link to={`/profile/${currentUser.id}`}>
              <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" />
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="flex h-9 w-9 items-center justify-center rounded-full text-lg text-gray-500 transition-colors hover:bg-brand-50 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <Link to="/login">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link to="/signup">
              <Button variant="primary" size="sm">Sign up</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}