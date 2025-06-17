import { inject, Injectable, NgZone, OnDestroy } from '@angular/core'
import { distinctUntilChanged, Observable, Subject } from 'rxjs'
import { ConfigService } from '@/services/config.service'

@Injectable({ providedIn: 'root' })
export class IdleService implements OnDestroy {
  private idleTime = 0
  private idleThreshold: number
  private checkInterval: number
  declare idleInterval: null | unknown
  private readonly configService = inject(ConfigService)
  private ngZone = inject(NgZone)
  private idleStateChanged = new Subject<boolean>()
  private idleTimeoutReached = new Subject<void>()

  onIdleStateChanged$ = this.idleStateChanged.pipe(distinctUntilChanged())

  constructor() {
    // to get the seconds of max idle threshold
    this.idleThreshold =
      (this.configService.CONFIG.ACCESS_TOKEN_TTL_IN_MINUTES -
        this.configService.CONFIG.REFRESH_ACCESS_TOKEN_BEFORE_ENDING_IN_MINUTES) *
        60 -
      10
    this.checkInterval = 1000 // 1 second default
  }

  // Configuration method
  configure(options: { idleThreshold?: number; checkInterval?: number }): void {
    if (options.idleThreshold) this.idleThreshold = options.idleThreshold
    if (options.checkInterval) this.checkInterval = options.checkInterval
  }

  // Start monitoring
  startWatching(): void {
    this.ngZone.runOutsideAngular(() => {
      this.resetIdleTime()
      this.setupEventListeners()
      this.startInterval()
    })
  }

  // Stop monitoring
  stopWatching(): void {
    this.clearInterval()
    this.removeEventListeners()
  }

  // Observable for when an idle threshold is reached
  onIdleTimeout(): Observable<void> {
    return this.idleTimeoutReached.asObservable()
  }

  // Get current idle time
  getIdleTime(): number {
    return this.idleTime
  }

  private resetIdleTime(): void {
    if (this.idleTime > 0) {
      this.idleStateChanged.next(false)
    }
    this.idleTime = 0
  }

  private setupEventListeners(): void {
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']
    events.forEach(event => {
      document.addEventListener(event, this.resetIdleTime.bind(this), { passive: true })
    })
  }

  private removeEventListeners(): void {
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']
    events.forEach(event => {
      document.removeEventListener(event, this.resetIdleTime.bind(this))
    })
  }

  private startInterval(): void {
    this.clearInterval()

    this.idleInterval = setInterval(() => {
      this.idleTime++
      // Emit when reaching a threshold
      if (this.idleTime === this.idleThreshold) {
        this.ngZone.run(() => {
          this.idleTimeoutReached.next()
          this.idleStateChanged.next(true)
        })
      }
    }, this.checkInterval)
  }

  private clearInterval(): void {
    if (this.idleInterval) {
      clearInterval(this.idleInterval as number)
      this.idleInterval = null
    }
  }

  ngOnDestroy(): void {
    this.stopWatching()
    this.idleStateChanged.complete()
    this.idleTimeoutReached.complete()
  }
}
