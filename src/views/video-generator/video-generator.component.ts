import { fadeInScale } from '@/animations/fade-in-scale'
import { AddFileNamePopupComponent } from '@/components/add-file-name-popup/add-file-name-popup.component'
import { SpinnerLoaderComponent } from '@/components/spinner-loader/spinner-loader.component'
import { AppColors } from '@/constants/app-colors'
import { ButtonDirective } from '@/directives/button.directive'
import { StreamComponent } from '@/enums/stream-component'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import { AvatarService } from '@/services/avatar.service'
import { LocalService } from '@/services/local.service'
import { MessageService } from '@/services/message.service'
import { AppStore } from '@/stores/app.store'
import { ignoreErrors } from '@/utils/utils'
import { CommonModule } from '@angular/common'
import { AfterViewInit, Component, computed, ElementRef, inject, OnInit, viewChild } from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatTooltipModule } from '@angular/material/tooltip'
import {
  catchError,
  exhaustMap,
  filter,
  finalize,
  from,
  map,
  merge,
  Observable,
  of,
  ReplaySubject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs'

@Component({
  selector: 'app-video-generator',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    SpinnerLoaderComponent,
    MatTooltipModule,
    ButtonDirective,
  ],
  templateUrl: './video-generator.component.html',
  styleUrl: './video-generator.component.scss',
  providers: [AvatarService],
  animations: [fadeInScale],
})
export default class VideoGeneratorComponent extends OnDestroyMixin(class {}) implements OnInit, AfterViewInit {
  video = viewChild.required<ElementRef<HTMLVideoElement>>('video')
  idleVideo = viewChild<ElementRef<HTMLVideoElement>>('idleVideo')
  readonly streamComponent = StreamComponent
  lang = inject(LocalService)
  avatarService = inject(AvatarService)
  store = inject(AppStore)
  messageService = inject(MessageService)
  dialog = inject(MatDialog)

  start$ = new ReplaySubject<void>(1)
  stop$ = new ReplaySubject<void>(1)
  declare pc: RTCPeerConnection

  text = new FormControl('')
  isLoading = false
  isDownloading = false
  wordsLimitExceeded = false

  settingsOpened = false

  readonly appColors = AppColors

  onlineStatus = computed(() => {
    this.lang.localChange() // just to track any change for the languages
    switch (this.store.streamingStatusMap()[StreamComponent.VideoGeneratorComponent]) {
      case 'Started':
        return this.lang.locals.connected
      case 'InProgress':
        return this.lang.locals.connecting
      case 'Disconnecting':
        return this.lang.locals.disconnecting
      default:
        return this.lang.locals.not_connected
    }
  })

  init$: Observable<unknown> = this.start$
    .asObservable()
    .pipe(tap(() => this.store.updateStreamStatusFor(StreamComponent.VideoGeneratorComponent, 'InProgress')))
    .pipe(takeUntil(this.destroy$))
    .pipe(
      exhaustMap(() =>
        this.avatarService
          .startStream('life-size')
          .pipe(
            catchError(err => {
              this.store.updateStreamStatusFor(StreamComponent.VideoGeneratorComponent, 'Stopped') //1
              throw err
            })
          )
          .pipe(ignoreErrors())
      )
    )
    .pipe(
      switchMap(response => {
        const {
          data: {
            webrtcData: { offer, iceServers },
          },
        } = response

        this.pc = new RTCPeerConnection({
          iceServers,
          iceTransportPolicy: 'relay',
        })
        this.pc.addEventListener('icecandidate', event => {
          if (event.candidate) {
            this.avatarService.sendCandidate(event.candidate).subscribe()
          }
        })

        this.pc.addEventListener('icegatheringstatechange', event => {
          if (
            (event.target as unknown as RTCPeerConnection).iceGatheringState == 'complete' &&
            this.video().nativeElement.paused
          ) {
            this.video().nativeElement.play().then()
            this.store.updateStreamStatusFor(StreamComponent.VideoGeneratorComponent, 'Started')
          }
        })

        this.pc.addEventListener('track', event => {
          this.video().nativeElement.srcObject = event.streams[0]
        })

        this.pc.addEventListener('connectionstatechange', evt => {
          const connectionState = (evt.target as unknown as RTCPeerConnection).connectionState
          if (connectionState === 'connected') {
            this.store.updateStreamStatusFor(StreamComponent.VideoGeneratorComponent, 'Started')
          }
          if (connectionState === 'disconnected') {
            this.store.updateStreamStatusFor(StreamComponent.VideoGeneratorComponent, 'Stopped')
          }
        })

        return from(
          this.pc.setRemoteDescription(new RTCSessionDescription(offer as unknown as RTCSessionDescriptionInit))
        )
          .pipe(switchMap(() => from(this.pc.createAnswer())))
          .pipe(switchMap(answer => from(this.pc.setLocalDescription(answer)).pipe(map(() => answer))))
          .pipe(switchMap(answer => this.avatarService.sendAnswer(answer)))
      })
    )
    .pipe(map(() => ''))

  async ngOnInit(): Promise<void> {
    this.avatarService.componentName.set(StreamComponent.VideoGeneratorComponent)
    // trigger the start of stream
    // this.start$.next()
    // close when destroy component
    this.text.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(v => {
      this.wordsLimitExceeded = (v?.split(' ') ?? '').length > 70
    })
    merge(this.destroy$)
      .pipe(tap(() => this.store.updateStreamStatusFor(StreamComponent.VideoGeneratorComponent, 'Stopped'))) // 2
      .subscribe(() => {
        console.log('COMPONENT DESTROYED')
      })

    this.stop$
      .pipe(filter(() => this.store.hasStreamFor(StreamComponent.VideoGeneratorComponent)))
      .pipe(tap(() => this.store.updateStreamStatusFor(StreamComponent.VideoGeneratorComponent, 'Disconnecting')))
      .pipe(takeUntil(this.destroy$))
      .pipe(switchMap(() => this.avatarService.closeStream().pipe(ignoreErrors())))
      .subscribe(() => {
        console.log('MANUAL CLOSE')
      })

    this.start$.next()
  }

  interruptAvatar() {
    this.avatarService.interruptAvatar().subscribe()
  }

  test() {
    if (
      !this.text.value ||
      this.isLoading ||
      !this.store.isStreamStartedFor(StreamComponent.VideoGeneratorComponent) ||
      this.wordsLimitExceeded
    )
      return
    this.isLoading = true
    this.avatarService
      .renderText(this.text.value!)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe()
  }

  updateAndDownload(customFileName?: string) {
    if (!this.text.value || this.isLoading || this.isDownloading || this.wordsLimitExceeded) return
    this.isDownloading = true
    this.avatarService
      .updateVideo(this.text.value!)
      .pipe(
        switchMap(res => {
          if (res.status === 'SUCCESS') return this.avatarService.retrieveVideo()
          else if (res.status === 'RENDERING')
            this.messageService.showInfo(
              this.lang.locals.another_video_is_being_generated_please_try_again_after_a_while
            )
          return of(null)
        })
      )
      .pipe(finalize(() => (this.isDownloading = false)))
      .subscribe(url => {
        if (url) {
          customFileName ? this.downloadBlobFromUrl(url, customFileName) : this.createDownloadLink(url)
        }
      })
  }

  ngAfterViewInit(): void {
    this.playIdle()
  }

  private playIdle(): void {
    if (this.idleVideo() && this.idleVideo()?.nativeElement) {
      this.idleVideo()!.nativeElement.src = this.store.idleAvatarUrl()
      this.idleVideo()!.nativeElement.muted = true
      this.idleVideo()!.nativeElement.loop = true
      this.idleVideo()!.nativeElement.play().then()
    }
  }

  toggleStream() {
    if (this.store.isStreamStoppedFor(StreamComponent.VideoGeneratorComponent)) {
      this.start$.next()
    } else if (this.store.isStreamStartedFor(StreamComponent.VideoGeneratorComponent)) {
      this.stop$.next()
    }
  }

  private downloadBlobFromUrl(url: string, filename: string) {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const blobUrl = URL.createObjectURL(blob)
        this.createDownloadLink(blobUrl, filename)
        URL.revokeObjectURL(blobUrl)
      })
  }
  private createDownloadLink(url: string, fileName?: string) {
    const downloadLink = document.createElement('a')
    downloadLink.href = url
    downloadLink.download = fileName ?? ''
    downloadLink.click()
  }

  downloadAs() {
    this.dialog
      .open<AddFileNamePopupComponent, undefined, string>(AddFileNamePopupComponent)
      .afterClosed()
      .pipe(
        takeUntil(this.destroy$),
        tap(fileName => {
          this.updateAndDownload(fileName)
        })
      )
      .subscribe()
  }
  getAvatarService() {
    return this.avatarService
  }
}
