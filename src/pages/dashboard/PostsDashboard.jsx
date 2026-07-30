import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { usePosts } from '../../hooks/usePosts'
import { formatDate } from '../../utils/helpers'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'

function statusVariant(post) {
  if (post.isDraft) return 'draft'
  return post.isPublic ? 'public' : 'private'
}
function statusLabel(post) {
  if (post.isDraft) return 'Draft'
  return post.isPublic ? 'Public' : 'Private'
}

export default function PostsDashboard() {
  const { currentUser } = useAuth()
  const { posts, deletePost, togglePublic, publishPost, getLikesForPost, getCommentsForPost } = usePosts()
  const [deleteTarget, setDeleteTarget] = useState(null)

  const myPosts = posts
    .filter((p) => p.authorId === currentUser.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  function confirmDelete() {
    if (deleteTarget) {
      deletePost(deleteTarget.id)
      setDeleteTarget(null)
    }
  }

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">My Posts</h1>

      {myPosts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          You haven't created any posts yet. <Link to="/dashboard/create" className="text-brand-500 hover:underline">Create your first post!</Link>
        </p>
      ) : (
        <div className="space-y-3">
          {myPosts.map((post) => (
            <div key={post.id} className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm text-gray-800 dark:text-gray-100">{post.description}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Badge variant={statusVariant(post)}>{statusLabel(post)}</Badge>
                    <span>👍 {getLikesForPost(post.id).length}</span>
                    <span>💬 {getCommentsForPost(post.id).length}</span>
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Link to={`/dashboard/edit/${post.id}`}>
                  <Button variant="secondary" size="sm">Edit</Button>
                </Link>
                <Button variant="danger" size="sm" onClick={() => setDeleteTarget(post)}>
                  Delete
                </Button>
                {!post.isDraft && (
                  <Button variant="ghost" size="sm" onClick={() => togglePublic(post.id)}>
                    {post.isPublic ? 'Make Private' : 'Make Public'}
                  </Button>
                )}
                {post.isDraft && (
                  <Button variant="primary" size="sm" onClick={() => publishPost(post.id)}>
                    Publish
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete this post?">
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
          This can't be undone. The post and its comments and likes will be removed.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" size="sm" onClick={confirmDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
