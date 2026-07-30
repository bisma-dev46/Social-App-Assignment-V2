import { Link } from 'react-router-dom'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'

function truncate(text, max) {
  if (!text) return ''
  return text.length > max ? text.slice(0, max).trim() + '...' : text
}

// status: 'none' | 'pending_sent' | 'pending_received'
export default function FriendRequestCard({ user, status, mutualCount, onAdd, onAccept, onReject }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <Link to={`/profile/${user.id}`} className="flex min-w-0 flex-1 items-center gap-3">
        <Avatar src={user.avatar} name={user.name} size="md" />
        <div className="min-w-0">
          <p className="truncate font-semibold text-gray-900 hover:underline dark:text-gray-100">{user.name}</p>
          {user.bio && <p className="truncate text-sm text-gray-500 dark:text-gray-400">{truncate(user.bio, 60)}</p>}
          {typeof mutualCount === 'number' && (
            <p className="text-xs text-gray-400 dark:text-gray-500">{mutualCount} mutual friend{mutualCount === 1 ? '' : 's'}</p>
          )}
        </div>
      </Link>

      <div className="flex flex-shrink-0 items-center gap-2">
        {status === 'none' && (
          <Button size="sm" onClick={() => onAdd(user.id)}>Add Friend</Button>
        )}
        {status === 'pending_sent' && (
          <Button size="sm" variant="secondary" disabled className="cursor-not-allowed opacity-60">
            Request Sent
          </Button>
        )}
        {status === 'pending_received' && (
          <>
            <Button size="sm" onClick={() => onAccept(user.id)}>Accept</Button>
            <Button size="sm" variant="danger" onClick={() => onReject(user.id)}>Reject</Button>
          </>
        )}
      </div>
    </div>
  )
}
