import { Link, useNavigate } from 'react-router-dom'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'

export default function FriendCard({ user, onUnfriend }) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <Link to={`/profile/${user.id}`} className="flex items-center gap-3">
        <Avatar src={user.avatar} name={user.name} size="md" />
        <div className="min-w-0">
          <p className="truncate font-semibold text-gray-900 hover:underline dark:text-gray-100">{user.name}</p>
          {user.bio && <p className="truncate text-sm text-gray-500 dark:text-gray-400">{user.bio}</p>}
        </div>
      </Link>
      <div className="flex gap-2">
        <Button size="sm" className="flex-1" onClick={() => navigate(`/chat/${user.id}`)}>
          Message
        </Button>
        <Button size="sm" variant="danger" onClick={() => onUnfriend(user.id)}>
          Unfriend
        </Button>
      </div>
    </div>
  )
}
