import { useAuth } from '../hooks/useAuth'
import { useFriends } from '../hooks/useFriends'
import { getMutualFriends } from '../utils/chatHelpers'
import FriendRequestCard from '../components/friends/FriendRequestCard'

export default function PeoplePage() {
  const { currentUser } = useAuth()
  const { getPeopleSuggestions, sendRequest, acceptRequest, rejectRequest, getRequestBetween } = useFriends()

  const suggestions = getPeopleSuggestions(currentUser.id)

  function handleAdd(userId) {
    sendRequest(currentUser.id, userId)
  }

  function handleAccept(userId) {
    const req = getRequestBetween(currentUser.id, userId)
    if (req) acceptRequest(req.id)
  }

  function handleReject(userId) {
    const req = getRequestBetween(currentUser.id, userId)
    if (req) rejectRequest(req.id)
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">People You May Know</h1>

      {suggestions.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">No one new to suggest right now</p>
      ) : (
        <div className="space-y-3">
          {suggestions.map(({ user, status }) => (
            <FriendRequestCard
              key={user.id}
              user={user}
              status={status}
              mutualCount={getMutualFriends(currentUser.id, user.id).length}
              onAdd={handleAdd}
              onAccept={handleAccept}
              onReject={handleReject}
            />
          ))}
        </div>
      )}
    </div>
  )
}
