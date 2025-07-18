import { StreamComponent } from '@/enums/stream-component'
import {
  Component,
  effect,
  ElementRef,
  HostListener,
  inject,
  Injector,
  OnInit,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core'
import { MatRipple } from '@angular/material/core'
import { LocalService } from '@/services/local.service'
import { AsyncPipe, DOCUMENT, NgClass } from '@angular/common'
import { catchError, exhaustMap, filter, finalize, iif, map, Subject, switchMap, takeUntil, tap } from 'rxjs'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import PerfectScrollbar from 'perfect-scrollbar'
import { ChatService } from '@/services/chat.service'
import { ignoreErrors } from '@/utils/utils'
import { RecorderComponent } from '@/components/recorder/recorder.component'
import { MatTooltip } from '@angular/material/tooltip'
import { AvatarVideoComponent } from '@/components/avatar-video/avatar-video.component'
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop'
import { slideFromBottom } from '@/animations/fade-in-slide'
import { ChatHistoryService } from '@/services/chat-history.service'
import { FeedbackChat } from '@/enums/feedback-chat'
import { AvatarInterrupterBtnComponent } from '@/components/avatar-interrupter-btn/avatar-interrupter-btn.component'
import { SecureUrlDirective } from '@/directives/secure-url.directive'
import { FAQComponent } from '../faq/faq.component'
import { PerfectScrollDirective } from '@/directives/perfect-scroll.directive'
import { FAQService } from '@/services/faq.service'
import { FAQContract } from '@/contracts/FAQ-contract'
import { AppStore } from '@/stores/app.store'
import { AvatarService } from '@/services/avatar.service'
import { SanitizerPipe } from '@/pipes/sanitizer.pipe'
import { EmployeeService } from '@/services/employee.service'

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    MatRipple,
    ReactiveFormsModule,
    NgClass,
    RecorderComponent,
    MatTooltip,
    AvatarVideoComponent,
    CdkDrag,
    CdkDragHandle,
    AvatarInterrupterBtnComponent,
    AsyncPipe,
    SecureUrlDirective,
    PerfectScrollDirective,
    FAQComponent,
    SanitizerPipe,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  animations: [slideFromBottom],
})
export class ChatComponent extends OnDestroyMixin(class {}) implements OnInit {
  avatarOn = false
  recorder = viewChild<RecorderComponent>('recorder')
  injector = inject(Injector)
  document = inject(DOCUMENT)
  lang = inject(LocalService)
  chatService = inject(ChatService)
  store = inject(AppStore)
  avatarService = inject(AvatarService)
  chatHistoryService = inject(ChatHistoryService)
  employeeService = inject(EmployeeService)
  status = this.chatService.status
  chatContainer = viewChild.required<ElementRef<HTMLDivElement>>('chatContainer')
  chatBodyContainer = viewChild<ElementRef<HTMLDivElement>>('chatBody')
  messageInput = viewChild.required<ElementRef<HTMLTextAreaElement>>('textArea')
  thanksMessage = viewChild.required('thanksMessage', { read: TemplateRef })
  thanksMessageContainerRef = viewChild('thanksMessageContainer', { read: ViewContainerRef })
  fullscreenStatus = signal(false)
  answerInProgress = signal(false)
  animating = signal(false)
  stopAnimate = signal(false)
  ratingDone = signal(false)
  loadingFAQ = signal(false)
  FAQService = inject(FAQService)
  questions = signal<FAQContract[]>([])
  componentName = signal<StreamComponent>(StreamComponent.ChatbotComponent)
  selectedBot = signal(this.chatService.botNameCtrl.value)
  botNames$ = this.chatHistoryService.getAllBotNames().pipe(
    tap(bots => this.chatService.botNameCtrl.patchValue(bots.at(0)!)),
    tap(bots => this.getQuestions(3, bots.at(0)!))
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
  //greeting avatar
  greetingAvatarEffect = effect(() => {
    if (this.store.isStreamStarted() && this.store.hasStream() && this.employeeService.hasAuthenticatedUser()) {
      this.avatarService.greeting(this.getBotName(), this.lang.currentLanguage == 'ar').subscribe()
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
  showLegalEffect = effect(
    () => {
      this.getQuestions(3, this.getBotName()).subscribe()
    },
    { allowSignalWrites: true }
  )
  // noinspection JSUnusedGlobalSymbols
  statusEffect = effect(
    () => {
      // this.chatService.showLegal()
      this.animating.set(false)
      this.stopAnimate.set(true)
      if (this.status()) {
        const timeoutID = setTimeout(() => {
          this.messageInput().nativeElement.focus()
          clearTimeout(timeoutID)
        })
      }
    },
    { allowSignalWrites: true }
  )

  messageCtrl = new FormControl<string>('', { nonNullable: true })
  sendMessage$ = new Subject<void>()
  uploadDocument$ = new Subject<FileList>()
  inProgressMessage = signal<string>('')

  ngOnInit(): void {
    this.listenToSendMessage()
    this.listenToUploadDocument()
    this.listenToBotNameChange()
    this.detectFullScreenMode()
    this.listenToInProgressMessages()
  }

  listenToBotNameChange() {
    this.chatService
      .onBotNameChange()
      .pipe(
        tap(name => this.selectedBot.set(name)),
        takeUntil(this.destroy$),
        switchMap(name => this.getQuestions(3, name))
      )
      .subscribe()
  }

  toggleChat() {
    this.status.update(value => !value)
  }

  fullScreenToggle() {
    console.log(this.chatContainer().nativeElement)
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
        exhaustMap(value =>
          this.chatService
            .sendMessageStreamed(value, this.getBotName())
            .pipe(
              catchError(err => {
                this.answerInProgress.set(false)
                throw new Error(err)
              })
            )
            .pipe(ignoreErrors())
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

  private listenToUploadDocument() {
    return this.uploadDocument$
      .pipe(takeUntil(this.destroy$))
      .pipe(filter(files => files.length > 0))
      .pipe(tap(() => this.answerInProgress.set(true)))
      .pipe(
        exhaustMap(files =>
          this.chatService.uploadDocument(files, this.getBotName(), this.chatService.conversationId()).pipe(
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
    // this.loadingFAQ.set(true)
    return iif(
      () => !!botName,
      this.FAQService.getQuestions(numberOfQuestions, botName),
      this.FAQService.getQuestions(numberOfQuestions)
    ).pipe(
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

  getBotName() {
    // if (false) {
    //   return 'legal'
    // }
    return this.chatService.botNameCtrl.value
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
