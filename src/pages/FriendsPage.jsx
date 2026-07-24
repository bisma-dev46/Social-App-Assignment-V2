import { useAuth } from '../hooks/useAuth'
import { useFriends } from '../hooks/useFriends'
import { getFriendsOf } from '../utils/chatHelpers'
import FriendCard from '../components/friends/FriendCard'

export default function FriendsPage() {
  const { currentUser } = useAuth()
  const { unfriend, requests } = useFriends()

  const friends = getFriendsOf(currentUser.id)

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">Friends</h1>

      {friends.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">No friends yet — go to People to connect</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {friends.map((friend) => (
            <FriendCard key={friend.id} user={friend} onUnfriend={(id) => unfriend(currentUser.id, id)} />
          ))}
        </div>
      )}
    </div>
  )
}
