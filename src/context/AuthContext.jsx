import { createContext, useContext, useState } from 'react'
import { storage, generateId } from '../utils/storage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // Lazy initializer: only runs once on mount, reads whatever was saved
  // last time so a page refresh keeps the user logged in.
  const [currentUser, setCurrentUser] = useState(() => storage.getCurrentUser())

  function signup({ name, email, password }) {
    const users = storage.getUsers()
    const emailTaken = users.some(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    )
    if (emailTaken) {
      throw new Error('Email already registered')
    }

    const newUser = {
      id: generateId('usr'),
      name,
      email,
      password, // NOTE: plain text on purpose - this is a localStorage-only demo, never do this with a real backend
      bio: '',
      location: '',
      avatar: null,
      coverImage: null,
      joinedAt: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
    }

    storage.setUsers([...users, newUser])
    return newUser
  }

  function login(email, password) {
    const users = storage.getUsers()
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (!found) {
      throw new Error('Invalid email or password')
    }

    // Strip the password before it ever touches state or the currentUser key
    const { password: _pw, ...safeUser } = found
    const withLastSeen = { ...safeUser, lastSeen: new Date().toISOString() }
    setCurrentUser(withLastSeen)
    storage.setCurrentUser(withLastSeen)
    storage.setUsers(users.map((u) => (u.id === found.id ? { ...u, lastSeen: withLastSeen.lastSeen } : u)))
    return withLastSeen
  }

  // Called periodically while the user is active in the app, so other users
  // see an accurate "online" (green dot) status in chat.
  function touchLastSeen() {
    if (!currentUser) return
    const now = new Date().toISOString()
    setCurrentUser((prev) => (prev ? { ...prev, lastSeen: now } : prev))
    storage.setCurrentUser({ ...storage.getCurrentUser(), lastSeen: now })
    const users = storage.getUsers()
    storage.setUsers(users.map((u) => (u.id === currentUser.id ? { ...u, lastSeen: now } : u)))
  }

  function logout() {
    setCurrentUser(null)
    storage.clearCurrentUser()
  }

  function updateCurrentUser(updatedFields) {
    if (!currentUser) return

    const merged = { ...currentUser, ...updatedFields }

    // 1. update in-memory state so the UI (navbar, etc.) re-renders immediately
    setCurrentUser(merged)
    // 2. update the currentUser session key
    storage.setCurrentUser(merged)
    // 3. update the users array too, so the change survives logout/login
    const users = storage.getUsers()
    const nextUsers = users.map((u) =>
      u.id === merged.id ? { ...u, ...updatedFields } : u
    )
    storage.setUsers(nextUsers)
  }

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    signup,
    login,
    logout,
    updateCurrentUser,
    touchLastSeen,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside an AuthProvider')
  return ctx
}

export default AuthContext
