export default function MediaPreview({ file, onClear }) {
  if (!file) return null

  return (
    <div className="relative mb-2 inline-block">
      {file.type === 'image' ? (
        <img src={file.data} alt="Preview" className="max-h-32 rounded-lg" />
      ) : (
        <video src={file.data} className="max-h-32 rounded-lg" muted />
      )}
      <button
        type="button"
        onClick={onClear}
        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 text-xs text-white"
      >
        ✕
      </button>
    </div>
  )
}
