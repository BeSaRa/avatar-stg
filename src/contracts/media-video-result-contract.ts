export interface MediaVideoResultContract<TData> {
  status_code?: number
  status: string
  message: string
  data: TData
}

export interface VideoData {
  name: string
  id: string
  thumbnail_url: string
  text?: string
}

export interface VideoSearchResult {
  text: string
  video_id: string
  video_name: string
}

export interface VideoIndexInfo {
  conversation_id: string
  bot_name: string
}
