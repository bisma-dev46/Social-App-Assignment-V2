import { useState } from 'react'
import { useAI } from '../../hooks/useAI'
import Button from '../ui/Button'

export default function AIPostAssistant({ onUseContent }) {
  const { generatePostContent } = useAI()
  const [open, setOpen] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [suggestion, setSuggestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleGenerate() {
    if (!prompt.trim()) return
    setLoading(true)
    setError('')
    setSuggestion('')
    const result = await generatePostContent(prompt.trim())
    setLoading(false)
    if (result.success) {
      setSuggestion(result.data)
    } else {
      setError('Could not generate content right now. Please try again.')
    }
  }

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-blue-700 dark:text-blue-300"
      >
        <span>✨ AI Writing Assistant</span>
        <span>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="space-y-3 border-t border-blue-200 px-4 py-3 dark:border-blue-800">
          <textarea
            rows={2}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Give a brief idea, e.g. 'I just completed a React project'"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />
          <Button type="button" size="sm" isLoading={loading} disabled={!prompt.trim()} onClick={handleGenerate}>
            Generate Post Content
          </Button>

          {error && <p className="text-xs text-red-500">{error}</p>}

          {suggestion && (
            <div className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-600 dark:bg-gray-800">
              <p className="text-sm text-gray-800 dark:text-gray-100">{suggestion}</p>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="mt-2"
                onClick={() => onUseContent(suggestion)}
              >
                Use This Content
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
