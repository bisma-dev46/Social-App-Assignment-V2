import { Link } from 'react-router-dom'
import { formatDate } from '../../utils/helpers'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'

// relationship: 'self' | 'friends' | 'pending_sent' | 'pending_received' | 'none'
export default function ProfileHeader({ user, isOwner, relationship, onAdd, onAccept, onReject, onMessage, onUnfriend }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div
        className="h-40 w-full bg-gradient-to-r from-brand-500 to-purple-500"
        style={
          user.coverImage
            ? { backgroundImage: `url(${user.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : undefined
        }
      />
      <div className="px-6 pb-6">
        <div className="-mt-10 flex items-end justify-between">
          <Avatar src={user.avatar} name={user.name} size="lg" className="ring-4 ring-white dark:ring-gray-800" />

          <div className="flex gap-2">
            {isOwner && (
              <Link to="/dashboard/settings">
                <Button variant="secondary" size="sm">Edit Profile</Button>
              </Link>
            )}
            {!isOwner && relationship === 'none' && (
              <Button size="sm" onClick={onAdd}>Add Friend</Button>
            )}
            {!isOwner && relationship === 'pending_sent' && (
              <Button size="sm" variant="secondary" disabled className="cursor-not-allowed opacity-60">Request Sent</Button>
            )}
            {!isOwner && relationship === 'pending_received' && (
              <>
                <Button size="sm" onClick={onAccept}>Accept</Button>
                <Button size="sm" variant="danger" onClick={onReject}>Reject</Button>
              </>
            )}
            {!isOwner && relationship === 'friends' && (
              <>
                <Button size="sm" onClick={onMessage}>Message</Button>
                <Button size="sm" variant="danger" onClick={onUnfriend}>Unfriend</Button>
              </>
            )}
          </div>
        </div>
        <h1 className="mt-3 text-xl font-bold text-gray-900 dark:text-gray-100">{user.name}</h1>
        {user.bio && <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{user.bio}</p>}
        <div className="mt-2 flex gap-4 text-xs text-gray-500 dark:text-gray-400">
          {user.location && <span>📍 {user.location}</span>}
          <span>Joined {formatDate(user.joinedAt)}</span>
        </div>
      </div>
    </div>
  )
}
