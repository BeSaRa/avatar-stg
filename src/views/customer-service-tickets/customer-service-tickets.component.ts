import { expandCollapse } from '@/animations/expand-collapse'
// eslint-disable-next-line max-len
import { UpdateTicketStatusPopupComponent } from '@/components/update-ticket-status-popup/update-ticket-status-popup.component'
import { TicketContract } from '@/contracts/ticket-contract'
import { PerfectScrollDirective } from '@/directives/perfect-scroll.directive'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import { CustomerServicesService } from '@/services/customer-services.service'
import { LocalService } from '@/services/local.service'
import { Component, inject, OnInit, signal } from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { takeUntil, tap, catchError, of, finalize, debounceTime, distinctUntilChanged } from 'rxjs'

@Component({
  selector: 'app-customer-service-tickets',
  standalone: true,
  imports: [ReactiveFormsModule, PerfectScrollDirective],
  templateUrl: './customer-service-tickets.component.html',
  styleUrl: './customer-service-tickets.component.scss',
  animations: [expandCollapse],
})
export default class CustomerServiceTicketsComponent extends OnDestroyMixin(class {}) implements OnInit {
  private readonly customerServicesService = inject(CustomerServicesService)
  private readonly dialog = inject(MatDialog)
  protected lang = inject(LocalService)

  protected loading = signal(false)
  protected tickets = signal<TicketContract[]>([])
  protected filteredTickets = signal<TicketContract[]>([])
  protected searchControl = new FormControl('', { nonNullable: true })
  protected selectedTicketId = signal('')
  protected selectedTicket = signal<TicketContract | null>(null)

  ngOnInit(): void {
    this.getAllTickets()
    this.listenToSearch()
  }

  getAllTickets(): void {
    this.loading.set(true)
    this.customerServicesService
      .getAllTickets()
      .pipe(
        takeUntil(this.destroy$),
        tap(data => {
          this.tickets.set(data)
          this.filteredTickets.set(data)
        }),
        catchError(() => {
          return of([])
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe()
  }

  listenToSearch(): void {
    this.searchControl.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(500), distinctUntilChanged())
      .subscribe(searchTerm => {
        this.filteredTickets.update(() => {
          return this.tickets().filter(ticket => ticket.sender_name.toLowerCase().includes(searchTerm.toLowerCase()))
        })
      })
  }

  toggleExpand(ticketId: string): void {
    //collapse
    if (this.selectedTicketId() === ticketId) {
      this.selectedTicketId.set('')
      this.selectedTicket.set(null)
    } else {
      //expand
      const ticket = this.filteredTickets().find(ticket => ticket.RowKey === ticketId)
      if (ticket) {
        this.selectedTicket.set(ticket)
        this.selectedTicketId.set(ticket.RowKey)
      }
    }
  }

  openUpdateTicket(ticket: TicketContract) {
    this.dialog
      .open<UpdateTicketStatusPopupComponent, { ticket: TicketContract }>(UpdateTicketStatusPopupComponent, {
        data: {
          ticket,
        },
      })
      .afterClosed()
      .pipe(
        takeUntil(this.destroy$),
        tap(() => this.getAllTickets())
      )
      .subscribe()
  }
}
