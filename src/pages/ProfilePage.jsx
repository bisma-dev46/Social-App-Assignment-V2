import { useParams, Navigate, useNavigate } from 'react-router-dom'
import { storage } from '../utils/storage'
import { useAuth } from '../hooks/useAuth'
import { usePosts } from '../hooks/usePosts'
import { useFriends } from '../hooks/useFriends'
import { getRelationshipStatus } from '../utils/chatHelpers'
import ProfileHeader from '../components/profile/ProfileHeader'
import PostCard from '../components/post/PostCard'

export default function ProfilePage() {
  const { userId } = useParams()
  const { currentUser } = useAuth()
  const { posts } = usePosts()
  const navigate = useNavigate()
  const { sendRequest, acceptRequest, rejectRequest, unfriend, getRequestBetween } = useFriends()

  const user = storage.getUsers().find((u) => u.id === userId)
  if (!user) return <Navigate to="/404" replace />

  const isOwner = currentUser?.id === user.id
  const relationship = isOwner ? 'self' : currentUser ? getRelationshipStatus(currentUser.id, user.id) : 'none'

  const publicPosts = posts
    .filter((p) => p.authorId === user.id && p.isPublic && !p.isDraft)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  function handleAdd() {
    sendRequest(currentUser.id, user.id)
  }
  function handleAccept() {
    const req = getRequestBetween(currentUser.id, user.id)
    if (req) acceptRequest(req.id)
  }
  function handleReject() {
    const req = getRequestBetween(currentUser.id, user.id)
    if (req) rejectRequest(req.id)
  }
  function handleUnfriend() {
    unfriend(currentUser.id, user.id)
  }
  function handleMessage() {
    navigate(`/chat/${user.id}`)
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <ProfileHeader
        user={user}
        isOwner={isOwner}
        relationship={relationship}
        onAdd={handleAdd}
        onAccept={handleAccept}
        onReject={handleReject}
        onMessage={handleMessage}
        onUnfriend={handleUnfriend}
      />

      <div className="mt-6 space-y-4">
        {publicPosts.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">No public posts yet</p>
        ) : (
          publicPosts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  )
}
