import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { UrlService } from './url.service'
import { TicketContract } from '@/contracts/ticket-contract'
import { map, Observable } from 'rxjs'
import { TicketStatus } from '@/enums/ticket-status'

@Injectable({
  providedIn: 'root',
})
export class CustomerServicesService {
  private readonly http = inject(HttpClient)
  private readonly urlService = inject(UrlService)
  private readonly orderMap: Partial<Record<TicketStatus, number>> = {
    [TicketStatus.Open]: 0,
    [TicketStatus.In_Progress]: 1,
    [TicketStatus.Closed]: 2,
  }

  getAllTickets(): Observable<TicketContract[]> {
    const url = `${this.urlService.URLS.CUSTOMER_SERVICES}/tickets`

    return this.http
      .get<TicketContract[]>(url)
      .pipe(
        map(tickets =>
          tickets
            .filter(ticket => ticket.status in this.orderMap)
            .sort((a, b) => this.orderMap[a.status]! - this.orderMap[b.status]!)
        )
      )
  }

  addTicket(ticket: TicketContract) {
    const url = `${this.urlService.URLS.CUSTOMER_SERVICES}/ticket`
    return this.http.post(url, ticket)
  }

  updateTicket(ticket: TicketContract) {
    const url = `${this.urlService.URLS.CUSTOMER_SERVICES}/ticket`
    return this.http.post(url, ticket)
  }

  deleteTicket(ticket: TicketContract) {
    const url = `${this.urlService.URLS.CUSTOMER_SERVICES}/ticket`
    return this.http.delete(url, ticket)
  }

  getTicketStatus(): Observable<Uppercase<keyof typeof TicketStatus>[]> {
    const url = `${this.urlService.URLS.CUSTOMER_SERVICES}/ticket-status-types`
    return this.http
      .get<Uppercase<keyof typeof TicketStatus>[]>(url)
      .pipe(map(status => status.filter(ticketStatus => ticketStatus !== 'RESOLVED' && ticketStatus !== 'ESCALATED')))
  }
}
