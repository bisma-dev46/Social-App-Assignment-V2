// storage.js
// This is the ONLY file allowed to talk to localStorage directly.
// Every component/hook goes through the `storage` object below.
// Keys used: 'users', 'posts', 'comments', 'likes', 'currentUser'

const KEYS = {
  USERS: 'users',
  POSTS: 'posts',
  COMMENTS: 'comments',
  LIKES: 'likes',
  CURRENT_USER: 'currentUser',
  FRIEND_REQUESTS: 'friendRequests',
  MESSAGES: 'messages',
  AI_SETTINGS: 'aiSettings',
}

// Generic safe read/write so we don't repeat try/catch + JSON.parse everywhere
function getItem(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch (err) {
    console.error(`storage: failed to read "${key}"`, err)
    return fallback
  }
}

function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.error(`storage: failed to write "${key}"`, err)
  }
}

export const storage = {
  // ---------- users ----------
  getUsers() {
    return getItem(KEYS.USERS, [])
  },
  setUsers(users) {
    setItem(KEYS.USERS, users)
  },

  // ---------- posts ----------
  getPosts() {
    return getItem(KEYS.POSTS, [])
  },
  setPosts(posts) {
    setItem(KEYS.POSTS, posts)
  },

  // ---------- comments ----------
  getComments() {
    return getItem(KEYS.COMMENTS, [])
  },
  setComments(comments) {
    setItem(KEYS.COMMENTS, comments)
  },

  // ---------- likes ----------
  getLikes() {
    return getItem(KEYS.LIKES, [])
  },
  setLikes(likes) {
    setItem(KEYS.LIKES, likes)
  },

  // ---------- session ----------
  getCurrentUser() {
    return getItem(KEYS.CURRENT_USER, null)
  },
  setCurrentUser(user) {
    setItem(KEYS.CURRENT_USER, user)
  },
  clearCurrentUser() {
    localStorage.removeItem(KEYS.CURRENT_USER)
  },

  // ---------- friend requests (Assignment 2) ----------
  getFriendRequests() {
    return getItem(KEYS.FRIEND_REQUESTS, [])
  },
  setFriendRequests(requests) {
    setItem(KEYS.FRIEND_REQUESTS, requests)
  },

  // ---------- messages (Assignment 2) ----------
  getMessages() {
    return getItem(KEYS.MESSAGES, [])
  },
  setMessages(messages) {
    setItem(KEYS.MESSAGES, messages)
  },

  // ---------- AI settings (Assignment 2) ----------
  getAiSettings() {
    return getItem(KEYS.AI_SETTINGS, {})
  },
  setAiSettings(settings) {
    setItem(KEYS.AI_SETTINGS, settings)
  },
}

export { generateId } from './helpers.js'
