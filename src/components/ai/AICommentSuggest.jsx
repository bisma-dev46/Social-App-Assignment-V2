import { useState } from 'react'
import { useAI } from '../../hooks/useAI'

export default function AICommentSuggest({ postDescription, onSuggestion }) {
  const { generateComment } = useAI()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleClick() {
    setLoading(true)
    setError('')
    const result = await generateComment(postDescription)
    setLoading(false)
    if (result.success) {
      onSuggestion(result.data.trim())
    } else {
      setError('Could not generate a suggestion. Try again.')
    }
  }

  return (
    <div className="mt-2 flex items-center gap-2">
      <button
        type="button"
        disabled={loading}
        onClick={handleClick}
        className="flex items-center gap-1 rounded-full border border-blue-200 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-50 disabled:opacity-60 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-950"
      >
        {loading ? (
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          '✨'
        )}
        Suggest Comment
      </button>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
}
