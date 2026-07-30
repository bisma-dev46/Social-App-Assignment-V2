import { useCallback } from 'react'
import { getOpenAIClient, AI_MODEL, AI_MAX_TOKENS } from '../lib/openai'

// Every OpenAI call in the app goes through one of these functions, so the
// model name, token limit, and error handling only live in one place.
// Every function returns { success, data, error } and NEVER throws —
// a failed API call must never crash the component that called it.
export function useAI() {
  async function callAI(systemPrompt, userPrompt) {
    try {
      const openai = getOpenAIClient()
      const response = await openai.chat.completions.create({
        model: AI_MODEL,
        max_tokens: AI_MAX_TOKENS,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      })
      const text = response.choices[0].message.content
      return { success: true, data: text, error: null }
    } catch (err) {
      console.error('AI call failed:', err)
      return { success: false, data: null, error: err.message || 'AI request failed' }
    }
  }

  // Strips ```json fences etc. before JSON.parse, since models sometimes
  // wrap JSON in markdown even when told not to.
  function safeParseJSON(text, fallback) {
    try {
      const clean = text.replace(/```json|```/g, '').trim()
      return JSON.parse(clean)
    } catch {
      return fallback
    }
  }

  // 3A — Post creation
  const generatePostContent = useCallback(async (userIdea) => {
    const systemPrompt =
      'You are a social media writing assistant. The user will give you a brief idea for their post. ' +
      'Generate an engaging social media post. Return JSON: { "description": "..." }. ' +
      'Keep under 280 characters. Be natural and warm. No hashtags unless requested.'
    const result = await callAI(systemPrompt, userIdea)
    if (!result.success) return result
    const parsed = safeParseJSON(result.data, { description: result.data })
    return { success: true, data: parsed.description, error: null }
  }, [])

  // 3B — Comment suggestion
  const generateComment = useCallback(async (postDescription) => {
    const systemPrompt =
      `You are helping a user write a comment on a social media post. The post is: ${postDescription}. ` +
      'Write a short genuine comment (1-2 sentences). Be conversational. Do not use hashtags. ' +
      'Do not be generic like "Great post".'
    const result = await callAI(systemPrompt, 'Write the comment now.')
    return result
  }, [])

  // 3C — Profile bio optimisation
  const optimizeBio = useCallback(async ({ bio, name, location }) => {
    const systemPrompt =
      `You are a professional profile writer. Current bio: ${bio || '(empty)'}. Name: ${name}. ` +
      `Location: ${location || 'unknown'}. Write an improved bio that is professional, warm and engaging. ` +
      'Keep it under 150 characters. Return only the bio text.'
    const result = await callAI(systemPrompt, 'Write the improved bio now.')
    return result
  }, [])

  // 3D Mode 1 — chat reply suggestions (3 chips)
  const generateChatSuggestions = useCallback(async ({ userName, friendName, recentMessages, personality }) => {
    const conversationText = recentMessages.map((m) => `${m.senderName}: ${m.content}`).join('\n')
    const systemPrompt =
      `You are ${userName}'s messaging assistant. You are helping ${userName} reply to ${friendName}. ` +
      `Recent conversation: ${conversationText}. Generate 3 short natural reply options. ` +
      'Return JSON: { "suggestions": ["reply1", "reply2", "reply3"] }. ' +
      `Each suggestion under 100 characters. Match the conversational tone.` +
      (personality ? ` Adopt a ${personality} personality.` : '')
    const result = await callAI(systemPrompt, 'Generate the suggestions now.')
    if (!result.success) return result
    const parsed = safeParseJSON(result.data, { suggestions: [] })
    return { success: true, data: parsed.suggestions || [], error: null }
  }, [])

  // 3D Mode 2 — auto-reply on the user's behalf
  const generateAutoReply = useCallback(async ({ userName, friendName, recentMessages, personality }) => {
    const conversationText = recentMessages.map((m) => `${m.senderName}: ${m.content}`).join('\n')
    const systemPrompt =
      `You are replying to ${friendName} on behalf of ${userName}. Recent conversation: ${conversationText}. ` +
      `Reply naturally as ${userName} would. Keep it short (1-3 sentences max). ` +
      'Do not reveal you are an AI unless directly asked.' +
      (personality ? ` Adopt a ${personality} personality.` : '')
    const result = await callAI(systemPrompt, 'Write the reply now.')
    return result
  }, [])

  return {
    generatePostContent,
    generateComment,
    optimizeBio,
    generateChatSuggestions,
    generateAutoReply,
  }
}