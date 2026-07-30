import { useState } from 'react'
import { Link } from 'react-router-dom'
import { storage } from '../../utils/storage'
import { formatDate } from '../../utils/helpers'
import { useAuth } from '../../hooks/useAuth'
import { usePosts } from '../../hooks/usePosts'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'
import AICommentSuggest from '../ai/AICommentSuggest'

export default function CommentSection({ postId, postDescription }) {
  const { isAuthenticated, currentUser } = useAuth()
  const { getCommentsForPost, addComment, deleteComment } = usePosts()
  const [text, setText] = useState('')
  const [confirmingId, setConfirmingId] = useState(null)

  // Comments for THIS post only - filtered by postId, this is how the
  // section knows which post's comments to show.
  const comments = getCommentsForPost(postId)
  const users = storage.getUsers()

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    addComment(postId, currentUser.id, trimmed)
    setText('')
  }

  return (
    <div className="mt-4">
      <h3 className="mb-3 font-semibold text-gray-900 dark:text-gray-100">
        {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
      </h3>

      <div className="space-y-3">
        {comments.map((comment) => {
          const author = users.find((u) => u.id === comment.authorId)
          const isMine = isAuthenticated && currentUser.id === comment.authorId
          const isConfirming = confirmingId === comment.id

          return (
            <div key={comment.id} className="flex gap-2">
              <Avatar src={author?.avatar} name={author?.name || 'Unknown'} size="sm" />
              <div className="flex-1 rounded-lg bg-gray-100 px-3 py-2 dark:bg-gray-700">
                <div className="flex items-center justify-between">
                  <Link to={`/profile/${author?.id}`} className="text-sm font-semibold text-gray-900 hover:underline dark:text-gray-100">
                    {author?.name || 'Unknown user'}
                  </Link>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(comment.createdAt)}</span>
                </div>
                <p className="text-sm text-gray-800 dark:text-gray-100">{comment.text}</p>

                {isMine && !isConfirming && (
                  <button
                    onClick={() => setConfirmingId(comment.id)}
                    className="mt-1 text-xs text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                )}
                {isMine && isConfirming && (
                  <div className="mt-1 flex items-center gap-2 text-xs">
                    <span className="text-gray-600 dark:text-gray-300">Are you sure?</span>
                    <button
                      onClick={() => {
                        deleteComment(comment.id)
                        setConfirmingId(null)
                      }}
                      className="font-semibold text-red-500 hover:underline"
                    >
                      Yes
                    </button>
                    <button onClick={() => setConfirmingId(null)} className="text-gray-500 hover:underline">
                      No
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {isAuthenticated ? (
        <>
          <AICommentSuggest postDescription={postDescription} onSuggestion={(s) => setText(s)} />
          <form onSubmit={handleSubmit} className="mt-2 flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            />
            <Button type="submit" size="sm">Post</Button>
          </form>
        </>
      ) : (
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          <Link to="/login" className="text-brand-500 hover:underline">Login</Link> to comment
        </p>
      )}
    </div>
  )
}
