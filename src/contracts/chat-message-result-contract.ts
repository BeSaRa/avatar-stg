import { Message } from '@/models/message'

export interface ChatMessageResultContract<TActionResult = unknown> {
  finish_reason: 'stop'
  index: number
  logprobs: unknown
  message: Message
  error: boolean
  content: string
  conversation_id: string
  action_results: TActionResult[]
}
