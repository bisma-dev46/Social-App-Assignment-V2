import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useFriends } from '../hooks/useFriends'
import { storage } from '../utils/storage'
import Avatar from '../components/ui/Avatar'
import Button from '../components/ui/Button'
import clsx from 'clsx'

export default function FriendRequestsPage() {
  const { currentUser } = useAuth()
  const { getReceivedRequests, getSentRequests, acceptRequest, rejectRequest, cancelRequest } = useFriends()
  const [tab, setTab] = useState('received')

  const users = storage.getUsers()
  const received = getReceivedRequests(currentUser.id)
  const sent = getSentRequests(currentUser.id)

  function userFor(id) {
    return users.find((u) => u.id === id)
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">Friend Requests</h1>

      <div className="mb-4 flex gap-2 border-b border-gray-200 dark:border-gray-700">
        {['received', 'sent'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={clsx(
              'px-4 py-2 text-sm font-medium capitalize',
              tab === t
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
            )}
          >
            {t} {t === 'received' ? `(${received.length})` : `(${sent.length})`}
          </button>
        ))}
      </div>

      {tab === 'received' && (
        received.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">No received requests</p>
        ) : (
          <div className="space-y-3">
            {received.map((req) => {
              const sender = userFor(req.fromUserId)
              if (!sender) return null
              return (
                <div key={req.id} className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                  <Link to={`/profile/${sender.id}`} className="flex items-center gap-3">
                    <Avatar src={sender.avatar} name={sender.name} size="md" />
                    <p className="font-semibold text-gray-900 hover:underline dark:text-gray-100">{sender.name}</p>
                  </Link>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => acceptRequest(req.id)}>Accept</Button>
                    <Button size="sm" variant="danger" onClick={() => rejectRequest(req.id)}>Reject</Button>
                  </div>
                </div>
              )
            })}
          </div>
        )
      )}

      {tab === 'sent' && (
        sent.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">No sent requests</p>
        ) : (
          <div className="space-y-3">
            {sent.map((req) => {
              const receiver = userFor(req.toUserId)
              if (!receiver) return null
              return (
                <div key={req.id} className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                  <Link to={`/profile/${receiver.id}`} className="flex items-center gap-3">
                    <Avatar src={receiver.avatar} name={receiver.name} size="md" />
                    <p className="font-semibold text-gray-900 hover:underline dark:text-gray-100">{receiver.name}</p>
                  </Link>
                  <Button size="sm" variant="secondary" onClick={() => cancelRequest(req.id)}>Cancel Request</Button>
                </div>
              )
            })}
          </div>
        )
      )}
    </div>
  )
}
