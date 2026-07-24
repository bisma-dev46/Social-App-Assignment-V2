// Generates a reasonably-unique id: prefix_<timestamp>_<random>
// This is fine for a localStorage-only demo app (no real backend / no collisions to worry about at this scale).
export function generateId(prefix = 'id') {
  const time = Date.now().toString(36)
  const random = Math.random().toString(36).slice(2, 8)
  return `${prefix}_${time}_${random}`
}

// Turns an ISO date string into something human friendly, e.g. "2h ago", "Jan 5"
export function formatDate(isoString) {
  if (!isoString) return ''
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

// Reads a File (from an <input type="file">) and resolves to a base64 data URL string.
// We store images as base64 strings directly inside localStorage objects (see storage.js).
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
