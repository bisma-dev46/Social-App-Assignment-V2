import clsx from 'clsx'
import Avatar from '../ui/Avatar'
import { formatDate } from '../../utils/helpers'
import { isUserOnline } from '../../utils/chatHelpers'

function truncate(text, max) {
  if (!text) return ''
  return text.length > max ? text.slice(0, max).trim() + '...' : text
}

export default function ConversationItem({ conversation, isActive, onClick }) {
  const { friend, lastMessage, unreadCount } = conversation
  const online = isUserOnline(friend)

  let preview = 'Say hi 👋'
  if (lastMessage) {
    if (lastMessage.type === 'text') preview = truncate(lastMessage.content, 40)
    else if (lastMessage.type === 'image') preview = '📷 Photo'
    else preview = '🎥 Video'
  }

  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex w-full items-center gap-3 border-l-4 px-4 py-3 text-left transition-colors',
        isActive ? 'border-blue-600 bg-blue-50 dark:bg-blue-950' : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-800'
      )}
    >
      <div className="relative flex-shrink-0">
        <Avatar src={friend.avatar} name={friend.name} size="md" />
        {online && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-gray-900" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <p className="truncate font-semibold text-gray-900 dark:text-gray-100">{friend.name}</p>
          {lastMessage && (
            <span className="flex-shrink-0 text-xs text-gray-400">{formatDate(lastMessage.timestamp)}</span>
          )}
        </div>
        <p className="truncate text-sm text-gray-500 dark:text-gray-400">{preview}</p>
      </div>
      {unreadCount > 0 && (
        <span className="flex h-5 min-w-[1.25rem] flex-shrink-0 items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-bold text-white">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  )
}
