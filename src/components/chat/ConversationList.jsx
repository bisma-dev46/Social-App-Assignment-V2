import ConversationItem from './ConversationItem'

export default function ConversationList({ conversations, activeFriendId, onSelect }) {
  if (conversations.length === 0) {
    return (
      <p className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
        You have no friends yet — go to People to connect
      </p>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((conv) => (
        <ConversationItem
          key={conv.friend.id}
          conversation={conv}
          isActive={conv.friend.id === activeFriendId}
          onClick={() => onSelect(conv.friend.id)}
        />
      ))}
    </div>
  )
}
