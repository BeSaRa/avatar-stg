import { StatisticsTableContract } from '@/contracts/statistics-table-contract'
import { PerfectScrollDirective } from '@/directives/perfect-scroll.directive'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import { LocalService } from '@/services/local.service'
import { Component, inject, OnInit } from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { debounceTime } from 'rxjs/internal/operators/debounceTime'
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged'
import { takeUntil } from 'rxjs/internal/operators/takeUntil'

@Component({
  selector: 'app-statistics-table-popup',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, PerfectScrollDirective],
  templateUrl: './statistics-table-popup.component.html',
  styleUrl: './statistics-table-popup.component.scss',
})
export class StatisticsTablePopupComponent<TData> extends OnDestroyMixin(class {}) implements OnInit {
  lang = inject(LocalService)
  ref = inject<MatDialogRef<StatisticsTablePopupComponent<TData>>>(MatDialogRef)
  data = inject<StatisticsTableContract<TData>>(MAT_DIALOG_DATA)
  searchControl = new FormControl('', { nonNullable: true })
  items = this.data.items
  filteredItems = this.data.items

  ngOnInit(): void {
    this.filteredItems = this.items
    this.listenToSearch()
  }
  listenToSearch(): void {
    this.searchControl.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(300), distinctUntilChanged())
      .subscribe(searchTerm => {
        const normalized = searchTerm.trim().toLowerCase()
        this.filteredItems = this.items.filter(item =>
          (item[this.data.searchKey] as string)?.toLowerCase().includes(normalized)
        )
      })
  }
}
