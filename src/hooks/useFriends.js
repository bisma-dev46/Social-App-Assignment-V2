import { useState, useCallback } from 'react'
import { storage, generateId } from '../utils/storage'
import { getRelationshipStatus } from '../utils/chatHelpers'

// Centralizes every read/write to the 'friendRequests' key, the same way
// usePosts.js centralizes 'posts' / 'comments' / 'likes'.
export function useFriends() {
  const [requests, setRequestsState] = useState(() => storage.getFriendRequests())

  const refresh = useCallback(() => {
    setRequestsState(storage.getFriendRequests())
  }, [])

  const sendRequest = useCallback((fromUserId, toUserId) => {
    const newRequest = {
      id: generateId('req'),
      fromUserId,
      toUserId,
      status: 'pending',
      sentAt: new Date().toISOString(),
      respondedAt: null,
    }
    const next = [...storage.getFriendRequests(), newRequest]
    storage.setFriendRequests(next)
    setRequestsState(next)
    return newRequest
  }, [])

  const acceptRequest = useCallback((requestId) => {
    const next = storage.getFriendRequests().map((r) =>
      r.id === requestId ? { ...r, status: 'accepted', respondedAt: new Date().toISOString() } : r
    )
    storage.setFriendRequests(next)
    setRequestsState(next)
  }, [])

  const rejectRequest = useCallback((requestId) => {
    const next = storage.getFriendRequests().map((r) =>
      r.id === requestId ? { ...r, status: 'rejected', respondedAt: new Date().toISOString() } : r
    )
    storage.setFriendRequests(next)
    setRequestsState(next)
  }, [])

  // Cancel a request I sent (still pending) — removes it entirely.
  const cancelRequest = useCallback((requestId) => {
    const next = storage.getFriendRequests().filter((r) => r.id !== requestId)
    storage.setFriendRequests(next)
    setRequestsState(next)
  }, [])

  // Unfriend — removes the accepted request between the two users.
  const unfriend = useCallback((userId1, userId2) => {
    const next = storage.getFriendRequests().filter(
      (r) =>
        !(
          r.status === 'accepted' &&
          ((r.fromUserId === userId1 && r.toUserId === userId2) ||
            (r.fromUserId === userId2 && r.toUserId === userId1))
        )
    )
    storage.setFriendRequests(next)
    setRequestsState(next)
  }, [])

  const getRequestBetween = useCallback(
    (userId1, userId2) =>
      requests.find(
        (r) =>
          (r.fromUserId === userId1 && r.toUserId === userId2) ||
          (r.fromUserId === userId2 && r.toUserId === userId1)
      ) || null,
    [requests]
  )

  const getReceivedRequests = useCallback(
    (userId) => requests.filter((r) => r.toUserId === userId && r.status === 'pending'),
    [requests]
  )

  const getSentRequests = useCallback(
    (userId) => requests.filter((r) => r.fromUserId === userId && r.status === 'pending'),
    [requests]
  )

  const getPendingReceivedCount = useCallback(
    (userId) => requests.filter((r) => r.toUserId === userId && r.status === 'pending').length,
    [requests]
  )

  // People You May Know — everyone who isn't the current user or a friend,
  // sorted: (1) sent me a request, (2) no connection, (3) I sent them a request.
  const getPeopleSuggestions = useCallback(
    (userId) => {
      const users = storage.getUsers()
      const candidates = users.filter((u) => {
        if (u.id === userId) return false
        const status = getRelationshipStatus(userId, u.id)
        return status !== 'friends'
      })

      const rank = { pending_received: 0, none: 1, pending_sent: 2 }
      return candidates
        .map((u) => ({ user: u, status: getRelationshipStatus(userId, u.id) }))
        .sort((a, b) => rank[a.status] - rank[b.status])
    },
    [requests]
  )

  return {
    requests,
    refresh,
    sendRequest,
    acceptRequest,
    rejectRequest,
    cancelRequest,
    unfriend,
    getRequestBetween,
    getReceivedRequests,
    getSentRequests,
    getPendingReceivedCount,
    getPeopleSuggestions,
  }
}
