import { useState } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { usePosts } from '../../hooks/usePosts'
import PostForm from '../../components/post/PostForm'

export default function EditPost() {
  const { postId } = useParams()
  const { currentUser } = useAuth()
  const { getPostById, updatePost } = usePosts()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(null)

  const post = getPostById(postId)

  // Not found, or belongs to someone else -> back to my posts list
  if (!post || post.authorId !== currentUser.id) {
    return <Navigate to="/dashboard/posts" replace />
  }

  function handleSave(data, { isDraft }) {
    setSubmitting(isDraft ? 'draft' : 'publish')
    updatePost(post.id, data)
    setSubmitting(null)
    navigate(isDraft ? '/dashboard/posts' : '/')
  }

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">Edit Post</h1>
      <PostForm defaultValues={post} onSave={handleSave} submitting={submitting} />
    </div>
  )
}
