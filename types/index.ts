export type Category = 'agent' | 'vibe' | 'oss' | 'tool' | 'unknown'

export type Sort = 'votes' | 'newest' | 'active'

export interface Product {
  id: string
  name: string
  tagline: string
  description?: string | null
  url?: string | null
  category: Category
  tags: string[]
  maker_x_id: string
  maker_x_username: string
  maker_x_name?: string | null
  maker_x_avatar?: string | null
  vote_count: number
  post_count: number
  first_posted_at: string | null
  last_posted_at: string | null
  created_at: string
  updated_at?: string
  has_voted?: boolean
}

export interface XPost {
  id: string
  post_id: string
  product_id: string
  content: string
  author_x_id: string
  author_x_username: string
  media_urls: string[]
  likes: number
  retweets: number
  posted_at: string
  collected_at?: string
}

export interface ProductDetail extends Product {
  x_posts: XPost[]
}

export interface XApiTweet {
  id: string
  text: string
  created_at: string
  author_id: string
  public_metrics: {
    like_count: number
    retweet_count: number
    reply_count?: number
    quote_count?: number
    bookmark_count?: number
    impression_count?: number
  }
  attachments?: {
    media_keys?: string[]
  }
}

export interface XApiUser {
  id: string
  name: string
  username: string
  profile_image_url?: string
}

export interface XApiMedia {
  media_key: string
  type: string
  url?: string
  preview_image_url?: string
}

export interface NormalizedPost {
  id: string
  text: string
  created_at: string
  author_id: string
  username: string
  name: string
  avatar?: string
  media_urls: string[]
  public_metrics: XApiTweet['public_metrics']
}
