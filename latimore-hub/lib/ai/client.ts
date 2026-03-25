type JsonSchemaResponseFormat = {
  type: 'json_schema'
  json_schema: {
    name: string
    strict?: boolean
    schema: Record<string, unknown>
  }
}

export async function createOpenAIJsonCompletion<T>({
  model = process.env.OPENAI_MODEL ?? 'gpt-4.1-mini',
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

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      temperature,
      input: [
        { role: 'system', content: [{ type: 'input_text', text: system }] },
        { role: 'user', content: [{ type: 'input_text', text: user }] },
      ],
      text: {
        format: {
          type: 'json_schema',
          json_schema: {
            name: schemaName,
            strict: true,
            schema,
          },
        } satisfies JsonSchemaResponseFormat,
      },
    }),
    cache: 'no-store',
  })

  const json = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(json?.error?.message ?? 'OpenAI request failed')
  }

  const text =
    json?.output_text ??
    json?.output?.flatMap((item: any) => item?.content ?? [])?.find((c: any) => c?.type === 'output_text')?.text

  if (!text || typeof text !== 'string') throw new Error('OpenAI returned empty output')

  return {
    model: json?.model ?? model,
    output: JSON.parse(text) as T,
    usage: json?.usage,
  }
}
