import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { usePosts } from '../../hooks/usePosts'

export default function PostActions({ postId }) {
  const navigate = useNavigate()
  const { isAuthenticated, currentUser } = useAuth()
  const { getLikesForPost, hasUserLiked, toggleLike, getCommentsForPost } = usePosts()

  const likeCount = getLikesForPost(postId).length
  const commentCount = getCommentsForPost(postId).length
  const liked = isAuthenticated && hasUserLiked(postId, currentUser.id)

  function handleLikeClick() {
    if (!isAuthenticated) {
      navigate('/login', { state: { message: 'Please login to interact' } })
      return
    }
    toggleLike(postId, currentUser.id)
  }

  return (
    <div className="flex items-center gap-5 border-y border-gray-100 py-3 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300">
      <button
        onClick={handleLikeClick}
        className={liked ? 'font-semibold text-brand-500' : 'hover:text-brand-500'}
      >
        {liked ? '👍 Liked' : '👍 Like'} ({likeCount})
      </button>
      <span>💬 {commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}</span>
    </div>
  )
}
