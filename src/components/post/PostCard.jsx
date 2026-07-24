import { useNavigate, Link } from 'react-router-dom'
import { storage } from '../../utils/storage'
import { formatDate } from '../../utils/helpers'
import { useAuth } from '../../hooks/useAuth'
import { usePosts } from '../../hooks/usePosts'
import Avatar from '../ui/Avatar'

export default function PostCard({ post }) {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { getLikesForPost, getCommentsForPost } = usePosts()

  const author = storage.getUsers().find((u) => u.id === post.authorId)
  const likeCount = getLikesForPost(post.id).length
  const commentCount = getCommentsForPost(post.id).length

  function openPost() {
    navigate(`/posts/${post.id}`)
  }

  function goToAuthor(e) {
    e.stopPropagation()
    if (author) navigate(`/profile/${author.id}`)
  }

  function handleInteractionClick(e) {
    e.stopPropagation()
    if (!isAuthenticated) {
      navigate('/login', { state: { message: 'Please login to interact' } })
      return
    }
    navigate(`/posts/${post.id}`)
  }

  return (
    <div
      onClick={openPost}
      className="cursor-pointer rounded-2xl border border-brand-100/70 bg-white p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-glow dark:border-gray-800 dark:bg-gray-800/60"
    >
      <div className="flex items-center gap-3">
        <button onClick={goToAuthor} className="flex items-center gap-3">
          <Avatar src={author?.avatar} name={author?.name || 'Unknown'} size="md" />
          <div className="text-left">
            <p className="font-semibold text-gray-900 hover:underline dark:text-gray-100">
              {author?.name || 'Unknown user'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(post.createdAt)}</p>
          </div>
        </button>
      </div>

      <p className="mt-3 whitespace-pre-line text-gray-800 dark:text-gray-100">
        {post.description}
      </p>

      {post.image && (
        <img src={post.image} alt="Post" className="mt-3 max-h-96 w-full rounded-lg object-cover" />
      )}

      <div className="mt-3 flex items-center gap-4 border-t border-brand-50 pt-3 text-sm font-medium text-gray-600 dark:border-gray-700 dark:text-gray-300">
        <button onClick={handleInteractionClick} className="flex items-center gap-1 rounded-full px-2 py-1 transition-colors hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-gray-700">
          👍 {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
        </button>
        <button onClick={handleInteractionClick} className="flex items-center gap-1 rounded-full px-2 py-1 transition-colors hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-gray-700">
          💬 {commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}
        </button>
      </div>
    </div>
  )
}