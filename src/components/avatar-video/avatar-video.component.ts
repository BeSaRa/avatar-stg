import { StreamComponent } from '@/enums/stream-component'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import { AvatarService } from '@/services/avatar.service'
import { LocalService } from '@/services/local.service'
import { AppStore } from '@/stores/app.store'
import { ignoreErrors } from '@/utils/utils'
import { AsyncPipe, NgClass } from '@angular/common'
import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  HostBinding,
  inject,
  input,
  OnDestroy,
  OnInit,
  viewChild,
} from '@angular/core'
import {
  catchError,
  exhaustMap,
  filter,
  from,
  map,
  merge,
  Observable,
  ReplaySubject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs'

@Component({
  selector: 'app-avatar-video',
  standalone: true,
  imports: [AsyncPipe, NgClass],
  templateUrl: './avatar-video.component.html',
  styleUrl: './avatar-video.component.scss',
})
export class AvatarVideoComponent extends OnDestroyMixin(class {}) implements OnInit, OnDestroy, AfterViewInit {
  size = input<'life-size' | undefined>()
  componentName = input.required<StreamComponent>()
  hasSize = computed(() => !!this.size())
  @HostBinding('attr.class')
  fullWidth = 'w-full h-full block '
  video = viewChild.required<ElementRef<HTMLVideoElement>>('video')
  idleVideo = viewChild<ElementRef<HTMLVideoElement>>('idleVideo')
  avatarService = inject(AvatarService)
  lang = inject(LocalService)
  start$ = new ReplaySubject<void>(1)
  stop$ = new ReplaySubject<void>(1)
  declare pc: RTCPeerConnection
  store = inject(AppStore)
  init$: Observable<unknown> = this.start$
    .asObservable()
    .pipe(tap(() => this.store.updateStreamStatusFor(this.componentName(), 'InProgress')))
    .pipe(takeUntil(this.destroy$))
    .pipe(
      exhaustMap(() =>
        this.avatarService
          .startStream(this.size())
          .pipe(
            catchError(err => {
              this.store.updateStreamStatusFor(this.componentName(), 'Stopped') //1
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
            this.store.updateStreamStatusFor(this.componentName(), 'Started')
          }
        })

        this.pc.addEventListener('track', event => {
          this.video().nativeElement.srcObject = event.streams[0]
        })

        this.pc.addEventListener('connectionstatechange', evt => {
          const connectionState = (evt.target as unknown as RTCPeerConnection).connectionState
          if (connectionState === 'connected') {
            this.store.updateStreamStatusFor(this.componentName(), 'Started')
          }
          if (connectionState === 'disconnected') {
            this.store.updateStreamStatusFor(this.componentName(), 'Stopped')
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

  onlineStatus = computed(() => {
    this.lang.localChange() // just to track any change for the languages
    switch (this.store.streamingStatusMap()[this.componentName()]) {
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

  async ngOnInit(): Promise<void> {
    // trigger the start of stream
    // this.start$.next()
    // close when destroy component
    this.avatarService.componentName.set(this.componentName())

    this.store.updateStreamStatusFor(this.componentName(), 'Stopped')
    merge(this.destroy$)
      .pipe(tap(() => this.store.updateStreamStatusFor(this.componentName(), 'Stopped'))) // 2
      .pipe(switchMap(() => this.avatarService.closeStream().pipe(ignoreErrors())))
      .subscribe(() => {
        console.log('COMPONENT DESTROYED')
      })

    this.stop$
      .pipe(filter(() => this.store.hasStreamFor(this.componentName())))
      .pipe(tap(() => this.store.updateStreamStatusFor(this.componentName(), 'Disconnecting')))
      .pipe(takeUntil(this.destroy$))
      .pipe(switchMap(() => this.avatarService.closeStream().pipe(ignoreErrors())))
      .subscribe(() => {
        this.store.updateStreamStatusFor(this.componentName(), 'Stopped')
        console.log('MANUAL CLOSE')
        this.store.updateStreamStatusFor(this.componentName(), 'Stopped')
      })

    if (!this.size()) {
      this.start$.next()
    }
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
}
