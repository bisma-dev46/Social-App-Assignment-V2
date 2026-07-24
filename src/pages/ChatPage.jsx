import { useState, useEffect, useRef, useMemo } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useChat } from '../hooks/useChat'
import { useAI } from '../hooks/useAI'
import { storage } from '../utils/storage'
import { areFriends, isUserOnline } from '../utils/chatHelpers'
import Avatar from '../components/ui/Avatar'
import ConversationList from '../components/chat/ConversationList'
import MessageBubble from '../components/chat/MessageBubble'
import MessageInput from '../components/chat/MessageInput'
import AISuggestionChips from '../components/chat/AISuggestionChips'
import AIChatBanner from '../components/chat/AIChatBanner'
import TypingIndicator from '../components/chat/TypingIndicator'

const PERSONALITIES = ['friendly', 'professional', 'casual', 'funny']

export default function ChatPage() {
  const { userId: friendId } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const {
    conversations,
    getMessagesForConversation,
    sendMessage,
    markConversationAsRead,
    toggleReaction,
  } = useChat(currentUser.id)
  const { generateChatSuggestions, generateAutoReply } = useAI()

  const [inputValue, setInputValue] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [aiThinking, setAiThinking] = useState(false)
  const [showAiMenu, setShowAiMenu] = useState(false)
  const [autoReplyToast, setAutoReplyToast] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const [aiSettings, setAiSettingsState] = useState(() => storage.getAiSettings())
  const mySettings = aiSettings[currentUser.id] || { aiChatEnabled: false, aiPersonality: 'friendly' }

  const messagesEndRef = useRef(null)
  const lastProcessedMsgId = useRef(null)

  // Friend must exist AND be an actual friend, otherwise bounce out.
  const friend = friendId ? storage.getUsers().find((u) => u.id === friendId) : null
  const isValidFriend = friendId ? friend && areFriends(currentUser.id, friendId) : true

  const messages = friendId ? getMessagesForConversation(friendId) : []

  const filteredMessages = useMemo(() => {
    if (!searchTerm.trim()) return messages
    return messages.filter((m) => m.type === 'text' && m.content.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [messages, searchTerm])

  function persistAiSettings(next) {
    storage.setAiSettings(next)
    setAiSettingsState(next)
  }

  function setMode(mode) {
    const next = { ...aiSettings, [currentUser.id]: { ...mySettings, aiChatEnabled: mode === 'auto' } }
    persistAiSettings(next)
    setShowAiMenu(false)
  }

  function setPersonality(p) {
    persistAiSettings({ ...aiSettings, [currentUser.id]: { ...mySettings, aiPersonality: p } })
  }

  // Mark conversation read + scroll to bottom whenever we open/refresh it
  useEffect(() => {
    if (!friendId || !isValidFriend) return
    markConversationAsRead(currentUser.id, friendId)
  }, [friendId, isValidFriend, messages.length])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [filteredMessages.length])

  // React to a NEW incoming message from the friend: generate suggestion
  // chips (Mode 1, always on) and, if Mode 2 is enabled, auto-reply.
  useEffect(() => {
    if (!friendId || !isValidFriend || messages.length === 0) return
    const last = messages[messages.length - 1]
    if (last.senderId !== friendId) return // only react to the FRIEND's messages
    if (last.id === lastProcessedMsgId.current) return
    lastProcessedMsgId.current = last.id

    const recent = messages.slice(-5).map((m) => ({
      senderName: m.senderId === currentUser.id ? currentUser.name : friend.name,
      content: m.type === 'text' ? m.content : `[${m.type}]`,
    }))

    // Mode 1 — suggestion chips (fail silently per spec)
    generateChatSuggestions({
      userName: currentUser.name,
      friendName: friend.name,
      recentMessages: recent,
      personality: mySettings.aiPersonality,
    }).then((res) => {
      if (res.success) setSuggestions(res.data)
    })

    // Mode 2 — auto-reply, only if explicitly enabled
    if (mySettings.aiChatEnabled) {
      setAiThinking(true)
      setTimeout(async () => {
        const res = await generateAutoReply({
          userName: currentUser.name,
          friendName: friend.name,
          recentMessages: recent,
          personality: mySettings.aiPersonality,
        })
        setAiThinking(false)
        if (res.success) {
          sendMessage(currentUser.id, friendId, 'text', res.data.trim(), true)
        } else {
          setAutoReplyToast('AI reply failed — please reply manually')
          setTimeout(() => setAutoReplyToast(''), 4000)
        }
      }, 1200 + Math.random() * 800) // 1-2s delay to feel natural
    }
  }, [messages, friendId, isValidFriend])

  function handleSend({ text, file }) {
    setSuggestions([])
    if (file) {
      sendMessage(currentUser.id, friendId, file.type, file.data)
    }
    if (text) {
      sendMessage(currentUser.id, friendId, 'text', text)
    }
  }

  if (friendId && !isValidFriend) {
    return <Navigate to="/friends" replace state={{ error: 'You can only chat with friends' }} />
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-5xl">
      {/* Sidebar */}
      <aside className={`w-full flex-shrink-0 border-r border-gray-200 dark:border-gray-700 md:w-80 ${friendId ? 'hidden md:flex md:flex-col' : 'flex flex-col'}`}>
        <div className="border-b border-gray-200 px-4 py-3 font-semibold text-gray-900 dark:border-gray-700 dark:text-gray-100">
          Chats
        </div>
        <ConversationList conversations={conversations} activeFriendId={friendId} onSelect={(id) => navigate(`/chat/${id}`)} />
      </aside>

      {/* Conversation panel */}
      <section className={`flex h-full min-w-0 flex-1 flex-col ${friendId ? 'flex' : 'hidden md:flex'}`}>
        {!friendId || !friend ? (
          <div className="flex flex-1 items-center justify-center text-gray-400 dark:text-gray-500">
            Select a conversation to start chatting
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <button onClick={() => navigate('/chat')} className="md:hidden">←</button>
                <button onClick={() => navigate(`/profile/${friend.id}`)} className="relative">
                  <Avatar src={friend.avatar} name={friend.name} size="sm" />
                  {isUserOnline(friend) && (
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500 dark:border-gray-900" />
                  )}
                </button>
                <div>
                  <button onClick={() => navigate(`/profile/${friend.id}`)} className="font-semibold text-gray-900 dark:text-gray-100">
                    {friend.name}
                  </button>
                  <p className="text-xs text-gray-400">
                    {isUserOnline(friend) ? 'Online' : 'Offline'}
                    {mySettings.aiChatEnabled && ` · AI: ${mySettings.aiPersonality}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button onClick={() => setSearchOpen((o) => !o)} className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800" title="Search messages">
                  🔍
                </button>
                <div className="relative">
                  <button onClick={() => setShowAiMenu((o) => !o)} className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800" title="AI settings">
                    ✨
                  </button>
                  {showAiMenu && (
                    <div className="absolute right-0 z-20 mt-1 w-56 rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                      <button onClick={() => setMode('suggest')} className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                        Suggest replies only
                      </button>
                      <button onClick={() => setMode('auto')} className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                        Let AI reply for me
                      </button>
                      <button onClick={() => setMode('off')} className="block w-full rounded px-3 py-2 text-left text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                        Turn off AI
                      </button>
                      <div className="mt-1 border-t border-gray-200 pt-1 dark:border-gray-700">
                        <p className="px-3 py-1 text-xs font-medium text-gray-400">Personality</p>
                        {PERSONALITIES.map((p) => (
                          <button
                            key={p}
                            onClick={() => setPersonality(p)}
                            className={`block w-full rounded px-3 py-1.5 text-left text-sm capitalize hover:bg-gray-100 dark:hover:bg-gray-700 ${mySettings.aiPersonality === p ? 'font-semibold text-blue-600' : ''}`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {mySettings.aiChatEnabled && <AIChatBanner onDisable={() => setMode('off')} />}
            {autoReplyToast && (
              <div className="bg-red-50 px-4 py-2 text-center text-xs text-red-600 dark:bg-red-950 dark:text-red-300">
                {autoReplyToast}
              </div>
            )}
            {searchOpen && (
              <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-2 dark:border-gray-700">
                <input
                  autoFocus
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Escape' && (setSearchOpen(false), setSearchTerm(''))}
                  placeholder="Search in conversation..."
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                />
                <span className="text-xs text-gray-400">{filteredMessages.length} match{filteredMessages.length === 1 ? '' : 'es'}</span>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {filteredMessages.map((msg, i) => {
                const isLastFriendMsg = msg.senderId === friend.id && i === filteredMessages.length - 1
                return (
                  <div key={msg.id}>
                    <MessageBubble
                      message={msg}
                      isMine={msg.senderId === currentUser.id}
                      friend={friend}
                      currentUserId={currentUser.id}
                      onToggleReaction={(msgId, emoji) => toggleReaction(msgId, currentUser.id, emoji)}
                      highlight={searchTerm}
                    />
                    {isLastFriendMsg && suggestions.length > 0 && (
                      <AISuggestionChips suggestions={suggestions} onPick={(s) => setInputValue(s)} />
                    )}
                  </div>
                )
              })}
              {aiThinking && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            <MessageInput value={inputValue} onChange={setInputValue} onSend={handleSend} />
          </>
        )}
      </section>
    </div>
  )
}
