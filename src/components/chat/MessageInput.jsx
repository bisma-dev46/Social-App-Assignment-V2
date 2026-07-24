import { useState, useRef } from 'react'
import { fileToBase64 } from '../../utils/helpers'
import MediaPreview from './MediaPreview'

export default function MessageInput({ value, onChange, onSend }) {
  const [file, setFile] = useState(null) // { type: 'image'|'video', data: base64 }
  const fileInputRef = useRef(null)
  const textareaRef = useRef(null)

  async function handleFileChange(e) {
    const selected = e.target.files?.[0]
    if (!selected) return
    const base64 = await fileToBase64(selected)
    setFile({ type: selected.type.startsWith('video') ? 'video' : 'image', data: base64 })
    e.target.value = '' // allow re-selecting the same file later
  }

  function handleTextareaChange(e) {
    onChange(e.target.value)
    // auto-grow up to 4 lines, then scroll
    const el = e.target
    el.style.height = 'auto'
    const lineHeight = 20
    const maxHeight = lineHeight * 4 + 16
    el.style.height = Math.min(el.scrollHeight, maxHeight) + 'px'
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      doSend()
    }
  }

  function doSend() {
    const trimmed = value.trim()
    if (!trimmed && !file) return
    onSend({ text: trimmed, file })
    setFile(null)
    onChange('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const canSend = value.trim().length > 0 || !!file

  return (
    <div className="border-t border-gray-200 p-3 dark:border-gray-700">
      <MediaPreview file={file} onClear={() => setFile(null)} />
      <div className="flex items-end gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-lg text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          title="Attach image or video"
        >
          📎
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="max-h-24 flex-1 resize-none rounded-2xl border border-gray-300 px-4 py-2 text-sm outline-none focus:border-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        />

        <button
          type="button"
          disabled={!canSend}
          onClick={doSend}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white disabled:opacity-40"
        >
          ➤
        </button>
      </div>
    </div>
  )
}
