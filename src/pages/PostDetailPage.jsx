import { useParams, Link, Navigate } from 'react-router-dom'
import { storage } from '../utils/storage'
import { formatDate } from '../utils/helpers'
import { usePosts } from '../hooks/usePosts'
import Avatar from '../components/ui/Avatar'
import PostActions from '../components/post/PostActions'
import CommentSection from '../components/post/CommentSection'

export default function PostDetailPage() {
  const { postId } = useParams()
  const { getPostById } = usePosts()
  const post = getPostById(postId)

  if (!post) return <Navigate to="/404" replace />

  const author = storage.getUsers().find((u) => u.id === post.authorId)

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <Link to={`/profile/${author?.id}`} className="flex items-center gap-3">
          <Avatar src={author?.avatar} name={author?.name || 'Unknown'} size="md" />
          <div>
            <p className="font-semibold text-gray-900 hover:underline dark:text-gray-100">
              {author?.name || 'Unknown user'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(post.createdAt)}</p>
          </div>
        </Link>

        <p className="mt-4 whitespace-pre-line text-gray-800 dark:text-gray-100">{post.description}</p>

        {post.image && <img src={post.image} alt="Post" className="mt-4 w-full rounded-lg" />}

        <PostActions postId={post.id} />
        <CommentSection postId={post.id} postDescription={post.description} />
      </div>
    </div>
  )
}
