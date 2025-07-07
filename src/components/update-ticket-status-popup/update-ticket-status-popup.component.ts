import { TicketContract } from '@/contracts/ticket-contract'
import { TicketStatus } from '@/enums/ticket-status'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import { CustomerServicesService } from '@/services/customer-services.service'
import { LocalService } from '@/services/local.service'
import { AsyncPipe, NgTemplateOutlet } from '@angular/common'
import { Component, inject, signal } from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { finalize, takeUntil } from 'rxjs'

@Component({
  selector: 'app-update-ticket-status-popup',
  standalone: true,
  imports: [AsyncPipe, MatDialogModule, ReactiveFormsModule, NgTemplateOutlet],
  templateUrl: './update-ticket-status-popup.component.html',
  styleUrl: './update-ticket-status-popup.component.scss',
})
export class UpdateTicketStatusPopupComponent extends OnDestroyMixin(class {}) {
  protected readonly data = inject<{ ticket: TicketContract }>(MAT_DIALOG_DATA)
  private readonly ref = inject<MatDialogRef<UpdateTicketStatusPopupComponent>>(MatDialogRef)
  private readonly customerServicesService = inject(CustomerServicesService)
  protected readonly lang = inject(LocalService)
  protected readonly ticketStatus$ = this.customerServicesService.getTicketStatus()
  protected readonly ticketStatusLabels: Record<string, string> = {
    OPEN: this.lang.locals.OPEN,
    IN_PROGRESS: this.lang.locals.IN_PROGRESS,
    RESOLVED: this.lang.locals.RESOLVED,
    CLOSED: this.lang.locals.CLOSED,
    ESCALATED: this.lang.locals.ESCALATED,
  }
  stautsControl = new FormControl<Uppercase<keyof typeof TicketStatus>>(this.data.ticket.status, { nonNullable: true })
  loading = signal(false)

  updateTicketStatus() {
    const status = this.stautsControl.value
    this.data.ticket.status = status as TicketStatus
    this.loading.set(true)
    this.customerServicesService
      .updateTicket({ ...this.data.ticket })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loading.set(false)
          this.ref.close()
        })
      )
      .subscribe()
  }
}
