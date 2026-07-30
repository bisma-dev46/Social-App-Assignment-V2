import { useState, useEffect } from 'react'

// Generic hook: state that is synced to localStorage under `key`.
// Not required by every page (most pages use storage.js + usePosts directly),
// but handy for small one-off bits of persisted UI state, e.g. dark mode.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (err) {
      console.error(`useLocalStorage: failed to persist "${key}"`, err)
    }
  }, [key, value])

  return [value, setValue]
}
