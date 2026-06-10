import type { Category } from '@/types'

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-sonnet-4-20250514'

export interface ProductAnalysis {
  name: string
  tagline: string
  description: string | null
  url: string | null
  category: Category
  tags: string[]
}

interface ClaudeTextBlock {
  type: 'text'
  text: string
}

interface ClaudeResponse {
  content: ClaudeTextBlock[]
}

function parseJsonResponse(text: string) {
  return JSON.parse(text.replace(/```json|```/g, '').trim())
}

function normalizeAnalysis(value: ProductAnalysis): ProductAnalysis {
  const validCategories: Category[] = ['agent', 'vibe', 'oss', 'tool', 'unknown']

  return {
    name: value.name || 'Untitled Product',
    tagline: value.tagline || 'Build in public from #ANS posts',
    description: value.description ?? null,
    url: value.url ?? null,
    category: validCategories.includes(value.category) ? value.category : 'unknown',
    tags: Array.isArray(value.tags) ? value.tags.slice(0, 8) : [],
  }
}

async function createClaudeMessage(content: string, maxTokens: number) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is required')

  const res = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content }],
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Claude API error: ${res.status} ${body}`)
  }

  return (await res.json()) as ClaudeResponse
}

export async function analyzePostsAndGenerateProduct(posts: {
  content: string
  posted_at: string
  media_urls: string[]
}[]): Promise<ProductAnalysis> {
  const postsText = posts.map((p, i) => `[${i + 1}] ${p.posted_at}\n${p.content}`).join('\n\n')

  const message = await createClaudeMessage(
    `以下はあるバイブコーダーの #ANS タグ付きポスト群です。
このポスト群から作られているプロダクトを解析し、ANSのプロダクトページ情報をJSONで生成してください。

ポスト群：
${postsText}

以下のJSON形式のみで返してください。前置き・後置き不要：
{
  "name": "プロダクト名（推測）",
  "tagline": "一行説明（50文字以内）",
  "description": "プロダクトの説明（200文字以内）",
  "url": "URLが投稿に含まれていれば抽出、なければnull",
  "category": "agent | vibe | oss | tool | unknown",
  "tags": ["タグ1", "タグ2", "タグ3"]
}`,
    1000
  )

  const text = message.content[0]?.type === 'text' ? message.content[0].text : ''
  return normalizeAnalysis(parseJsonResponse(text))
}

export async function updateProductFromNewPost(
  existing: { name: string; tagline: string; description: string | null; url?: string | null; category?: string; tags: string[] },
  newPostContent: string
): Promise<Partial<ProductAnalysis>> {
  const message = await createClaudeMessage(
    `既存のプロダクト情報に新しいポストの内容を反映して更新してください。

既存情報：
${JSON.stringify(existing)}

新しいポスト：
${newPostContent}

更新が必要な場合のみ変更し、同じJSON形式で返してください。変更不要なフィールドはそのまま返してください。JSONのみ返すこと：`,
    500
  )

  const text = message.content[0]?.type === 'text' ? message.content[0].text : ''
  return normalizeAnalysis(parseJsonResponse(text))
}
