// Friend + chat helper functions.
// These are pure functions that read from storage.js — no React here, so
// they can be reused by hooks (useFriends, useChat) and pages alike.
import { storage } from './storage'

// ---------------------------------------------------------------------
// conversationId — ALWAYS sort both user ids alphabetically so A->B and
// B->A resolve to the exact same conversation, regardless of who opens
// the chat first.
// ---------------------------------------------------------------------
export function getConversationId(userId1, userId2) {
  return [userId1, userId2].sort().join('_')
}

// ---------------------------------------------------------------------
// Friend requests
// ---------------------------------------------------------------------

// Are these two users already friends? (an 'accepted' request exists between them)
export function areFriends(userId1, userId2) {
  const requests = storage.getFriendRequests()
  return requests.some(
    (r) =>
      r.status === 'accepted' &&
      ((r.fromUserId === userId1 && r.toUserId === userId2) ||
        (r.fromUserId === userId2 && r.toUserId === userId1))
  )
}

// Returns 'friends' | 'pending_sent' | 'pending_received' | 'none'
// describing userId1's relationship to userId2.
export function getRelationshipStatus(userId1, userId2) {
  const requests = storage.getFriendRequests()
  const req = requests.find(
    (r) =>
      (r.fromUserId === userId1 && r.toUserId === userId2) ||
      (r.fromUserId === userId2 && r.toUserId === userId1)
  )
  if (!req || req.status === 'rejected') return 'none'
  if (req.status === 'accepted') return 'friends'
  // pending
  return req.fromUserId === userId1 ? 'pending_sent' : 'pending_received'
}

// All accepted-friend user objects for a given user.
export function getFriendsOf(userId) {
  const requests = storage.getFriendRequests()
  const users = storage.getUsers()
  const friendIds = requests
    .filter((r) => r.status === 'accepted' && (r.fromUserId === userId || r.toUserId === userId))
    .map((r) => (r.fromUserId === userId ? r.toUserId : r.fromUserId))
  return users.filter((u) => friendIds.includes(u.id))
}

// Bonus: mutual friends between two users.
export function getMutualFriends(userId1, userId2) {
  const friends1 = getFriendsOf(userId1).map((u) => u.id)
  const friends2 = getFriendsOf(userId2).map((u) => u.id)
  const mutualIds = friends1.filter((id) => friends2.includes(id))
  return storage.getUsers().filter((u) => mutualIds.includes(u.id))
}

// ---------------------------------------------------------------------
// Messages / conversations
// ---------------------------------------------------------------------

// All messages between two users, oldest first.
export function getMessages(userId1, userId2) {
  const conversationId = getConversationId(userId1, userId2)
  return storage
    .getMessages()
    .filter((m) => m.conversationId === conversationId)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
}

// Conversation list for the sidebar: one row per friend the user has
// messaged (or who is a friend at all), sorted by most recent message.
export function getConversations(userId) {
  const friends = getFriendsOf(userId)
  const allMessages = storage.getMessages()

  return friends
    .map((friend) => {
      const conversationId = getConversationId(userId, friend.id)
      const messages = allMessages
        .filter((m) => m.conversationId === conversationId)
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      const lastMessage = messages[messages.length - 1] || null
      const unreadCount = messages.filter((m) => m.receiverId === userId && !m.read).length

      return { friend, conversationId, lastMessage, unreadCount }
    })
    .sort((a, b) => {
      const aTime = a.lastMessage ? new Date(a.lastMessage.timestamp).getTime() : 0
      const bTime = b.lastMessage ? new Date(b.lastMessage.timestamp).getTime() : 0
      return bTime - aTime
    })
}

// Total unread messages across all conversations (for the navbar badge).
export function getTotalUnreadCount(userId) {
  return storage.getMessages().filter((m) => m.receiverId === userId && !m.read).length
}

// Is the user "online"? (active within the last 5 minutes)
export function isUserOnline(user) {
  if (!user?.lastSeen) return false
  const diffMs = Date.now() - new Date(user.lastSeen).getTime()
  return diffMs < 5 * 60 * 1000
}
