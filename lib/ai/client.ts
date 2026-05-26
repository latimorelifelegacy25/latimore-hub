/**
 * lib/ai/client.ts
 *
 * FIX: Was calling /v1/responses (OpenAI Responses API) with the wrong
 * request body shape. Structured JSON output via json_schema is only
 * supported on /v1/chat/completions with response_format.
 *
 * All AI calls in the app were returning "OpenAI request failed" silently.
 */

export async function createOpenAIJsonCompletion<T>({
  model = process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
  system,
  user,
  schemaName,
  schema,
  temperature = 0.2,
}: {
  model?: string
  system: string
  user: string
  schemaName: string
  schema: Record<string, unknown>
  temperature?: number
}): Promise<{
  model: string
  output: T
  usage?: { input_tokens?: number; output_tokens?: number; total_tokens?: number }
}> {
  if (!process.env.OPENAI_API_KEY) throw new Error('Missing OPENAI_API_KEY')

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      temperature,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: schemaName,
          strict: true,
          schema,
        },
      },
    }),
    cache: 'no-store',
  })

  const json = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(json?.error?.message ?? `OpenAI request failed: ${response.status}`)
  }

  const text = json?.choices?.[0]?.message?.content

  if (!text || typeof text !== 'string') {
    throw new Error('OpenAI returned empty output')
  }

  return {
    model: json?.model ?? model,
    output: JSON.parse(text) as T,
    usage: json?.usage
      ? {
          input_tokens: json.usage.prompt_tokens,
          output_tokens: json.usage.completion_tokens,
          total_tokens: json.usage.total_tokens,
        }
      : undefined,
  }
}

export async function createTextCompletion({
  model = process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
  system,
  user,
  temperature = 0.5,
}: {
  model?: string
  system: string
  user: string
  temperature?: number
}): Promise<string> {
  if (!process.env.OPENAI_API_KEY) throw new Error('Missing OPENAI_API_KEY')

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      temperature,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
    cache: 'no-store',
  })

  const json = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(json?.error?.message ?? `OpenAI request failed: ${response.status}`)
  }

  return json?.choices?.[0]?.message?.content ?? ''
}
