import { HasPermissionDirective } from '@/directives/has-permission.directive'
import {
  Component,
  effect,
  ElementRef,
  HostListener,
  inject,
  Injector,
  input,
  OnInit,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core'
import { MatTooltipModule } from '@angular/material/tooltip'
import { AsyncPipe, DOCUMENT, NgClass } from '@angular/common'
import { TextWriterAnimatorDirective } from '@/directives/text-writer-animator.directive'
import { LocalService } from '@/services/local.service'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { FeedbackChat } from '@/enums/feedback-chat'
import { ChatHistoryService } from '@/services/chat-history.service'
import PerfectScrollbar from 'perfect-scrollbar'
import {
  catchError,
  defer,
  exhaustMap,
  filter,
  finalize,
  iif,
  map,
  skipWhile,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import { ignoreErrors } from '@/utils/utils'
import { RecorderComponent } from '../recorder/recorder.component'
import { AvatarVideoComponent } from '../avatar-video/avatar-video.component'
import { AvatarInterrupterBtnComponent } from '../avatar-interrupter-btn/avatar-interrupter-btn.component'
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop'
import { FAQService } from '@/services/faq.service'
import { FAQContract } from '@/contracts/FAQ-contract'
import { PerfectScrollDirective } from '@/directives/perfect-scroll.directive'
import { FAQComponent } from '../faq/faq.component'
import { BaseChatService } from '@/services/base-chat.service'
import { SecureUrlDirective } from '@/directives/secure-url.directive'
import { slideFromBottom } from '@/animations/fade-in-slide'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { StreamComponent } from '@/enums/stream-component'
import { Router } from '@angular/router'

@Component({
  selector: 'app-chat-container',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTooltipModule,
    NgClass,
    TextWriterAnimatorDirective,
    RecorderComponent,
    AvatarVideoComponent,
    AvatarInterrupterBtnComponent,
    CdkDrag,
    CdkDragHandle,
    AsyncPipe,
    PerfectScrollDirective,
    FAQComponent,
    SecureUrlDirective,
    MatSlideToggleModule,
    HasPermissionDirective,
  ],
  animations: [slideFromBottom],
  templateUrl: './chat-container.component.html',
  styleUrl: './chat-container.component.scss',
})
export class ChatContainerComponent extends OnDestroyMixin(class {}) implements OnInit {
  lang = inject(LocalService)
  chatService = inject(BaseChatService, { skipSelf: true })
  injector = inject(Injector)
  router = inject(Router)
  document = inject(DOCUMENT)
  chatHistoryService = inject(ChatHistoryService)
  status = this.chatService.status
  showAvatarBtn = input(true)
  showClearMsgBtn = input(true)
  showFullScreenBtn = input(true)
  showHideBtn = input(true)
  showRatingBox = input(true)
  showRecorderBtn = input(true)
  showUploadDocumentBtn = input(true)
  componentName = input.required<StreamComponent>()
  title = input(this.lang.locals.chat)
  containerClass = input('')
  botNameOptions = input.required<
    { showBotSelection: true; botName?: string } | { showBotSelection: false; botName: string }
  >()
  clearMessageOnly = input(false)
  greeting_message = input('')
  chatContainer = viewChild.required<ElementRef<HTMLDivElement>>('chatContainer')
  chatBodyContainer = viewChild<ElementRef<HTMLDivElement>>('chatBody')
  messageInput = viewChild.required<ElementRef<HTMLTextAreaElement>>('textArea')
  thanksMessage = viewChild.required('thanksMessage', { read: TemplateRef })
  thanksMessageContainerRef = viewChild('thanksMessageContainer', { read: ViewContainerRef })
  recorder = viewChild<RecorderComponent>('recorder')
  avatarOn = false
  fullscreenStatus = signal(false)
  answerInProgress = signal(false)
  animating = signal(false)
  stopAnimate = signal(false)
  ratingDone = signal(false)
  loadingFAQ = signal(false)
  streamResponse = this.chatService.streamResponse
  FAQService = inject(FAQService)
  questions = signal<FAQContract[]>([])
  botNames$ = this.chatHistoryService.getAllBotNames().pipe(
    tap(bots => this.chatService.botNameCtrl.patchValue(bots.at(0)!)),
    switchMap(bots => this.getQuestions(3, bots.at(0)!).pipe(map(() => bots)))
  )
  declare scrollbarRef: PerfectScrollbar
  feedbackOptions = FeedbackChat
  // noinspection JSUnusedGlobalSymbols
  chatBodyContainerEffect = effect(() => {
    if (this.chatBodyContainer()) {
      this.scrollbarRef = new PerfectScrollbar(this.chatBodyContainer()!.nativeElement)
    } else {
      this.scrollbarRef && this.scrollbarRef.destroy()
    }
  })
  // noinspection JSUnusedGlobalSymbols
  answerInProgressEffect = effect(() => {
    if (this.answerInProgress()) {
      this.messageCtrl.disable()
    } else {
      this.messageCtrl.enable()
    }
  })
  // noinspection JSUnusedGlobalSymbols
  animatingEffect = effect(() => {
    if (!this.animating()) {
      const elements = this.chatBodyContainer()?.nativeElement?.querySelectorAll('.chat-message')
      const last = elements && elements[elements.length - 1]

      last && last.scrollIntoView(true)
    }
  })

  showQuestionsEffect = effect(
    () => {
      const { showBotSelection, botName } = this.botNameOptions()
      if (!showBotSelection && this.chatService.status()) this.getQuestions(3, botName).subscribe()
    },
    { allowSignalWrites: true }
  )
  // noinspection JSUnusedGlobalSymbols
  statusEffect = effect(() => {
    if (this.status()) {
      const timeoutID = setTimeout(() => {
        this.messageInput().nativeElement.focus()
        clearTimeout(timeoutID)
      })
    }
    // if (!this.status()) {
    //   this.router.navigate([], {
    //     fragment: undefined,
    //     queryParamsHandling: 'preserve',
    //   })
    // }
  })

  messageCtrl = new FormControl<string>('', { nonNullable: true })
  sendMessage$ = new Subject<void>()
  uploadDocument$ = new Subject<FileList>()
  inProgressMessage = signal<string>('')

  ngOnInit() {
    this.listenToSendMessage()
    this.listenToUploadDocument()
    this.listenToBotNameChange()
    this.listenToInProgressMessages()
  }
  listenToBotNameChange() {
    this.chatService
      .onBotNameChange()
      .pipe(
        takeUntil(this.destroy$),
        skipWhile(() => !this.botNameOptions().showBotSelection),
        switchMap(value => this.getQuestions(3, value))
      )
      .subscribe()
  }

  toggleChat() {
    this.status.update(value => !value)
  }
  toggleStreamResponse() {
    this.chatService.streamResponse.update(value => !value)
  }

  fullScreenToggle() {
    if (!this.document.fullscreenElement) {
      this.chatContainer()
        .nativeElement.requestFullscreen()
        .then(() => this.fullscreenStatus.set(true))
    } else {
      this.document.exitFullscreen().then(() => this.fullscreenStatus.set(false))
    }
  }

  private listenToSendMessage() {
    return this.sendMessage$
      .pipe(takeUntil(this.destroy$))
      .pipe(filter(() => !!this.messageCtrl.value.trim()))
      .pipe(map(() => this.messageCtrl.value.trim()))
      .pipe(tap(() => this.stopAnimate.set(false)))
      .pipe(tap(() => this.messageCtrl.setValue('')))
      .pipe(tap(() => this.recorder()?.cleartext()))
      .pipe(tap(() => this.answerInProgress.set(true)))
      .pipe(tap(() => this.goToEndOfChat()))
      .pipe(
        exhaustMap(value => {
          const botName = this.botNameOptions().showBotSelection
            ? this.chatService.botNameCtrl.value
            : this.botNameOptions().botName!

          return iif(
            () => this.streamResponse(),
            defer(() => this.chatService.sendMessageStreamed(value, botName)),
            defer(() => this.chatService.sendMessage(value, botName))
          ).pipe(
            catchError(err => {
              this.answerInProgress.set(false)
              throw new Error(err)
            }),
            ignoreErrors()
          )
        })
      )
      .subscribe(() => {
        this.answerInProgress.set(false)
        Promise.resolve().then(() => {
          this.messageInput()?.nativeElement?.focus()
          const timeoutID = setTimeout(() => {
            this.scrollToTop()
            clearInterval(timeoutID)
          }, 50)
        })
      })
  }

  private listenToUploadDocument() {
    return this.uploadDocument$
      .pipe(takeUntil(this.destroy$))
      .pipe(filter(files => files.length > 0))
      .pipe(tap(() => this.answerInProgress.set(true)))
      .pipe(
        exhaustMap(files =>
          this.chatService.uploadDocument(files, 'website', this.chatService.conversationId()).pipe(
            catchError(err => {
              this.answerInProgress.set(false)
              throw new Error(err)
            })
          )
        )
      )
      .subscribe(() => {
        this.answerInProgress.set(false)
        Promise.resolve().then(() => {
          this.messageInput()?.nativeElement?.focus()
          const timeoutID = setTimeout(() => {
            this.scrollToTop()
            clearInterval(timeoutID)
          }, 50)
        })
      })
  }

  scrollToTop(): void {
    const elements = this.chatBodyContainer()?.nativeElement?.querySelectorAll('.chat-message')
    const lastElement = elements && elements[elements.length - 1]
    const intervalID = setInterval(() => {
      lastElement && lastElement.scrollIntoView(true)
    }, 50)

    effect(
      onCleanup => {
        !this.animating() && intervalID && clearInterval(intervalID)
        onCleanup(() => {
          intervalID && clearInterval(intervalID)
        })
      },
      { injector: this.injector }
    )
  }

  private goToEndOfChat() {
    const timeoutID = setTimeout(() => {
      const elements = this.chatBodyContainer()?.nativeElement?.querySelectorAll('.user-message')
      elements && elements[elements.length - 1]?.scrollIntoView(true)
      clearTimeout(timeoutID)
    })
  }

  clearChatHistory() {
    if (this.clearMessageOnly()) {
      this.chatService.messages.set([])
      return
    }
    this.chatService.messages.set([])
    this.chatService.conversationId.set('')
    this.ratingDone.set(false)
  }

  toggleAvatar() {
    this.avatarOn = !this.avatarOn
  }

  @HostListener('window:fullscreenchange')
  detectFullScreenMode() {
    const isFullscreen = !!this.document.fullscreenElement
    if (!isFullscreen) {
      this.fullscreenStatus.set(isFullscreen)
    }
  }

  rateConversation(feedback: FeedbackChat) {
    const conversationId = this.chatService.conversationId()
    this.chatHistoryService
      .addFeedback(conversationId, feedback)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.ratingDone.set(true)
        this.thanksMessageContainerRef()?.createEmbeddedView(this.thanksMessage())
        setTimeout(() => {
          this.thanksMessageContainerRef()?.clear()
        }, 1500)
      })
  }

  handleSuggestionsQuestions(question: string) {
    this.messageCtrl.setValue(question)
    this.sendMessage$.next()
  }
  getQuestions(numberOfQuestions: number, botName?: string) {
    this.loadingFAQ.set(true)
    return iif(
      () => !!botName,
      this.FAQService.getQuestions(numberOfQuestions, botName),
      this.FAQService.getQuestions(numberOfQuestions)
    ).pipe(
      takeUntil(this.destroy$),
      tap(questions => this.questions.set(questions)),
      finalize(() => this.loadingFAQ.set(false))
    )
  }
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
      this.uploadDocument$.next(input.files)
    }
  }
  private listenToInProgressMessages() {
    this.chatService
      .getInProgressMessage()
      .pipe(takeUntil(this.destroy$))
      .subscribe(inProgressMessage => {
        this.inProgressMessage.set(inProgressMessage)
      })
  }
}
