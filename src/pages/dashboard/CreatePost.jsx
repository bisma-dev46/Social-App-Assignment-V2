import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { usePosts } from '../../hooks/usePosts'
import PostForm from '../../components/post/PostForm'

export default function CreatePost() {
  const { currentUser } = useAuth()
  const { createPost } = usePosts()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(null)
  const [draftMessage, setDraftMessage] = useState('')
  const [formKey, setFormKey] = useState(0) // bump to reset PostForm after a draft save

  function handleSave(data, { isDraft }) {
    setSubmitting(isDraft ? 'draft' : 'publish')
    createPost(data, currentUser.id)

    if (isDraft) {
      setDraftMessage('Post saved as draft')
      setFormKey((k) => k + 1) // remount PostForm with empty defaults -> clears the form
    } else {
      navigate('/')
    }
    setSubmitting(null)
  }

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">Create Post</h1>
      {draftMessage && (
        <p className="mb-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-900 dark:text-green-300">
          {draftMessage}
        </p>
      )}
      <PostForm key={formKey} onSave={handleSave} submitting={submitting} />
    </div>
  )
}
