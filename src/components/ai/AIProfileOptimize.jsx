import { useState } from 'react'
import { useAI } from '../../hooks/useAI'
import Button from '../ui/Button'

export default function AIProfileOptimize({ name, bio, location, onUseSuggestion }) {
  const { optimizeBio } = useAI()
  const [suggestion, setSuggestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleClick() {
    setLoading(true)
    setError('')
    setSuggestion('')
    const result = await optimizeBio({ name, bio, location })
    setLoading(false)
    if (result.success) {
      setSuggestion(result.data.trim())
    } else {
      setError('Could not optimise your bio right now. Please try again.')
    }
  }

  return (
    <div className="space-y-2">
      <Button type="button" variant="secondary" size="sm" isLoading={loading} onClick={handleClick}>
        ✨ Optimise with AI
      </Button>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {suggestion && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-800">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Suggested bio:</p>
          <p className="mt-1 text-sm text-gray-800 dark:text-gray-100">{suggestion}</p>
          <Button
            type="button"
            size="sm"
            className="mt-2"
            onClick={() => onUseSuggestion(suggestion)}
          >
            Use Suggestion
          </Button>
        </div>
      )}
    </div>
  )
}
