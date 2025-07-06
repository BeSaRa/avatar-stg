import { AnswerQuestionData } from '@/contracts/admin-insights-contract'
import { PerfectScrollDirective } from '@/directives/perfect-scroll.directive'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import { LocalService } from '@/services/local.service'
import { AsyncPipe } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatExpansionModule } from '@angular/material/expansion'
import { MarkdownPipe } from 'ngx-markdown'
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs'

@Component({
  selector: 'app-question-answer-popup',
  standalone: true,
  imports: [MatExpansionModule, PerfectScrollDirective, MatDialogModule, MarkdownPipe, AsyncPipe, ReactiveFormsModule],
  templateUrl: './question-answer-popup.component.html',
  styleUrl: './question-answer-popup.component.scss',
})
export class QuestionAnswerPopupComponent extends OnDestroyMixin(class {}) implements OnInit {
  lang = inject(LocalService)
  ref = inject<MatDialogRef<QuestionAnswerPopupComponent>>(MatDialogRef)
  data = inject<{ questoinsAnswers: AnswerQuestionData[]; title: string }>(MAT_DIALOG_DATA)
  searchControl = new FormControl('', { nonNullable: true })
  questions = this.data.questoinsAnswers
  filteredQuestions = this.data.questoinsAnswers

  ngOnInit(): void {
    this.filteredQuestions = this.questions
    this.listenToSearch()
  }
  listenToSearch(): void {
    this.searchControl.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(300), distinctUntilChanged())
      .subscribe(searchTerm => {
        const normalized = searchTerm.trim().toLowerCase()
        this.filteredQuestions = this.questions.filter(q => q.question?.toLowerCase().includes(normalized))
      })
  }
}
