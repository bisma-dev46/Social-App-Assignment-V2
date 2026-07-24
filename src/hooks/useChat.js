import { useState, useEffect, useCallback } from 'react'
import { storage, generateId } from '../utils/storage'
import { getConversationId, getMessages as getMessagesHelper, getConversations as getConversationsHelper } from '../utils/chatHelpers'

// Centralizes every read/write to the 'messages' key, PLUS the real-time
// sync across browser tabs via the native `storage` event: when Tab A
// writes to localStorage, Tab B's `window` fires a `storage` event
// automatically. We listen for that here and re-read state so both tabs
// stay in sync without any backend or websocket.
export function useChat(currentUserId) {
  const [messages, setMessagesState] = useState(() => storage.getMessages())

  useEffect(() => {
    function handleStorage(event) {
      // event.key is null when localStorage.clear() is called; guard for it
      if (event.key === 'messages' || event.key === null) {
        setMessagesState(storage.getMessages())
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage) // cleanup — avoids memory leaks / stale listeners
  }, [])

  const refresh = useCallback(() => {
    setMessagesState(storage.getMessages())
  }, [])

  const sendMessage = useCallback((senderId, receiverId, type, content, aiGenerated = false) => {
    const newMessage = {
      id: generateId('msg'),
      conversationId: getConversationId(senderId, receiverId),
      senderId,
      receiverId,
      type, // 'text' | 'image' | 'video'
      content,
      timestamp: new Date().toISOString(),
      read: false,
      aiGenerated,
      reactions: {}, // { userId: emoji } — bonus emoji reactions
    }
    const next = [...storage.getMessages(), newMessage]
    storage.setMessages(next)
    setMessagesState(next)
    // NOTE: writing to localStorage in THIS tab does not fire a `storage`
    // event in this same tab (only in OTHER tabs) — that's why we also
    // update state directly above, instead of relying solely on the event.
    return newMessage
  }, [])

  const markConversationAsRead = useCallback((userId1, userId2) => {
    const conversationId = getConversationId(userId1, userId2)
    const next = storage.getMessages().map((m) =>
      m.conversationId === conversationId && m.receiverId === userId1 && !m.read
        ? { ...m, read: true }
        : m
    )
    storage.setMessages(next)
    setMessagesState(next)
  }, [])

  // Bonus: toggle an emoji reaction from the current user on a message.
  const toggleReaction = useCallback((messageId, userId, emoji) => {
    const next = storage.getMessages().map((m) => {
      if (m.id !== messageId) return m
      const reactions = { ...(m.reactions || {}) }
      if (reactions[userId] === emoji) {
        delete reactions[userId] // clicking the same emoji again removes it
      } else {
        reactions[userId] = emoji
      }
      return { ...m, reactions }
    })
    storage.setMessages(next)
    setMessagesState(next)
  }, [])

  const getMessagesForConversation = useCallback(
    (friendId) => getMessagesHelper(currentUserId, friendId),
    [currentUserId, messages]
  )

  const conversations = currentUserId ? getConversationsHelper(currentUserId) : []

  return {
    messages,
    conversations,
    refresh,
    sendMessage,
    markConversationAsRead,
    toggleReaction,
    getMessagesForConversation,
  }
}
