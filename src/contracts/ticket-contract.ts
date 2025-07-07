import { TicketStatus } from '@/enums/ticket-status'

export interface TicketContract {
  PartitionKey: string
  RowKey: string
  sender_name: string
  sender_email: string
  sender_phone_number: string
  target_name: string
  target_company_name: string
  target_contact_info: string
  subject: string
  body: string
  status: TicketStatus
}
