import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { UrlService } from './url.service'
import { TicketContract } from '@/contracts/ticket-contract'
import { Observable } from 'rxjs'
import { TicketStatus } from '@/enums/ticket-status'

@Injectable({
  providedIn: 'root',
})
export class CustomerServicesService {
  private readonly http = inject(HttpClient)
  private readonly urlService = inject(UrlService)

  getAllTickets(): Observable<TicketContract[]> {
    const url = `${this.urlService.URLS.CUSTOMER_SERVICES}/tickets`
    return this.http.get<TicketContract[]>(url)
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

  getTicketStatus(): Observable<Uppercase<keyof typeof TicketStatus>> {
    const url = `${this.urlService.URLS.CUSTOMER_SERVICES}/ticket-status-types`
    return this.http.get<Uppercase<keyof typeof TicketStatus>>(url)
  }
}
