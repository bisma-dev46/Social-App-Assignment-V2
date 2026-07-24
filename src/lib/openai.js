// Single OpenAI client, imported everywhere an AI call is needed.
// Always uses gpt-4o-mini + max_tokens: 300 per the assignment spec, to keep
// costs low and predictable across every student's app.
import OpenAI from 'openai'

export const AI_MODEL = 'gpt-4o-mini'
export const AI_MAX_TOKENS = 300

let client = null
let initError = null

// Lazy + guarded: the OpenAI SDK throws immediately if the key is missing,
// so we only build the client the first time it's actually needed, and we
// catch that error instead of letting it crash the whole app on page load.
export function getOpenAIClient() {
  if (client) return client
  if (initError) throw initError

  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  if (!apiKey) {
    initError = new Error(
      'No OpenAI API key found. Add VITE_OPENAI_API_KEY to your .env file and restart `npm run dev`.'
    )
    throw initError
  }

  try {
    client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true })
    return client
  } catch (err) {
    initError = err
    throw err
  }
}

export default getOpenAIClient