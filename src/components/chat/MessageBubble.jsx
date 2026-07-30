import { useState } from 'react'
import clsx from 'clsx'
import Avatar from '../ui/Avatar'
import Modal from '../ui/Modal'
import { formatDate } from '../../utils/helpers'

const REACTION_EMOJIS = ['👍', '❤️', '😂', '😮', '😢']

export default function MessageBubble({ message, isMine, friend, currentUserId, onToggleReaction, highlight }) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [showPicker, setShowPicker] = useState(false)

  const reactions = message.reactions || {}
  // Group reactions by emoji -> count, e.g. { '👍': 2, '❤️': 1 }
  const reactionCounts = Object.values(reactions).reduce((acc, emoji) => {
    acc[emoji] = (acc[emoji] || 0) + 1
    return acc
  }, {})
  const myReaction = reactions[currentUserId]

  function highlightText(text) {
    if (!highlight) return text
    const parts = text.split(new RegExp(`(${highlight})`, 'ig'))
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <mark key={i} className="rounded bg-yellow-300 dark:bg-yellow-500 dark:text-gray-900">{part}</mark>
      ) : (
        part
      )
    )
  }

  return (
    <div className={clsx('group flex items-end gap-2', isMine ? 'flex-row-reverse' : 'flex-row')}>
      {!isMine && <Avatar src={friend?.avatar} name={friend?.name} size="sm" />}

      <div className={clsx('flex max-w-[70%] flex-col', isMine ? 'items-end' : 'items-start')}>
        <div
          className={clsx(
            'relative px-4 py-2 text-sm',
            isMine
              ? 'rounded-2xl rounded-br-sm bg-blue-600 text-white'
              : 'rounded-2xl rounded-bl-sm bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
          )}
          onMouseEnter={() => setShowPicker(true)}
          onMouseLeave={() => setShowPicker(false)}
        >
          {message.aiGenerated && (
            <span className="mr-1 align-middle" title="AI-generated message">✨</span>
          )}

          {message.type === 'text' && <span className="whitespace-pre-line">{highlightText(message.content)}</span>}

          {message.type === 'image' && (
            <>
              <img
                src={message.content}
                alt="Shared"
                className="max-h-56 cursor-pointer rounded-lg"
                onClick={() => setLightboxOpen(true)}
              />
              <Modal isOpen={lightboxOpen} onClose={() => setLightboxOpen(false)}>
                <img src={message.content} alt="Full size" className="max-h-[80vh] w-full rounded-lg object-contain" />
              </Modal>
            </>
          )}

          {message.type === 'video' && (
            <video src={message.content} controls className="max-h-56 rounded-lg" />
          )}

          {/* Emoji reaction picker — shows on hover */}
          {showPicker && (
            <div
              className={clsx(
                'absolute -top-9 z-10 flex gap-1 rounded-full border border-gray-200 bg-white px-2 py-1 shadow-md dark:border-gray-600 dark:bg-gray-800',
                isMine ? 'right-0' : 'left-0'
              )}
            >
              {REACTION_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  className="text-sm hover:scale-125 transition-transform"
                  onClick={() => onToggleReaction(message.id, emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Reaction counts */}
        {Object.keys(reactionCounts).length > 0 && (
          <div className="mt-1 flex gap-1">
            {Object.entries(reactionCounts).map(([emoji, count]) => (
              <button
                key={emoji}
                onClick={() => onToggleReaction(message.id, emoji)}
                className={clsx(
                  'rounded-full border px-1.5 py-0.5 text-xs',
                  myReaction === emoji
                    ? 'border-blue-400 bg-blue-50 dark:bg-blue-900'
                    : 'border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800'
                )}
              >
                {emoji} {count}
              </button>
            ))}
          </div>
        )}

        <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
          <span>{formatDate(message.timestamp)}</span>
          {/* Bonus: read receipts — single tick sent, double tick read */}
          {isMine && <span>{message.read ? '✓✓' : '✓'}</span>}
        </div>
      </div>
    </div>
  )
}
