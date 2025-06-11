import { DOCUMENT } from '@angular/common'
import { inject, Injectable, NgZone } from '@angular/core'
import {
  BehaviorSubject,
  fromEvent,
  map,
  merge,
  Observable,
  startWith,
  Subscription,
  switchMap,
  take,
  timer,
} from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class IdleMonitorService {
  private idle$ = new BehaviorSubject<boolean>(false)
  private fallbackSub?: Subscription
  private idleTimeoutMs = 10 * 60 * 1000 // default to 10 minutes
  private onActiveCallback: (() => void) | null = null
  private onIdleCallback: (() => void) | null = null
  private initialized = false
  private document = inject(DOCUMENT)
  private window = this.document.defaultView!

  private readonly zone = inject(NgZone)

  public async init(): Promise<void> {
    if (this.initialized) return
    this.initialized = true

    if ('IdleDetector' in this.window && typeof this.window.IdleDetector?.requestPermission === 'function') {
      try {
        let isGranted = false

        const permissionStatus = await navigator.permissions.query({ name: 'idle-detection' })
        isGranted = permissionStatus.state === 'granted'
        if (permissionStatus.state !== 'granted') {
          const permission = await this.window.IdleDetector.requestPermission()
          isGranted = permission === 'granted'
        }

        if (isGranted) {
          this.useIdleDetector()
        } else {
          console.warn('[IdleDetector] Permission not granted, using fallback.')
          this.useFallback()
        }
      } catch (err) {
        console.error('[IdleDetector] requestPermission failed:', err)
        this.useFallback()
      }
    } else {
      console.warn('[IdleDetector] Not supported, using fallback.')
      this.useFallback()
    }
  }

  public initSafelyOnFirstUserInteraction(): void {
    const safeEvents = merge(
      fromEvent(this.window, 'click'),
      fromEvent(this.window, 'keydown'),
      fromEvent(this.window, 'touchstart', { passive: true }),
      fromEvent(this.window, 'pointerdown', { passive: true })
    )

    safeEvents.pipe(take(1)).subscribe(() => {
      this.init()
    })
  }

  private async useIdleDetector() {
    try {
      const idleDetector = new this.window.IdleDetector()

      await idleDetector.start({ threshold: this.idleTimeoutMs })

      idleDetector.addEventListener('change', () => {
        const userState = idleDetector.userState
        this.zone.run(() => {
          const isIdle = userState === 'idle'
          this.idle$.next(isIdle)
          isIdle ? this.onIdleCallback?.() : this.onActiveCallback?.()
        })
      })

      console.log('[IdleDetector] Monitoring started.')
    } catch (error) {
      console.error('[IdleDetector] Failed to start:', error)
      this.useFallback()
    }
  }

  private useFallback() {
    this.zone.runOutsideAngular(() => {
      const activityEvents = merge(
        fromEvent(this.window, 'mousemove'),
        fromEvent(this.window, 'keydown'),
        fromEvent(this.window, 'click'),
        fromEvent(this.window, 'scroll'),
        fromEvent(this.window, 'touchstart', { passive: true })
      )

      activityEvents.subscribe(() => {
        this.zone.run(() => {
          this.idle$.next(false)
          this.onActiveCallback?.()
        })
      })

      this.fallbackSub = activityEvents
        .pipe(
          startWith(null),
          switchMap(() => timer(this.idleTimeoutMs).pipe(map(() => true)))
        )
        .subscribe(() => {
          this.zone.run(() => {
            this.idle$.next(true)
            this.onIdleCallback?.()
          })
        })
    })
  }

  public getIdleStatus(): Observable<boolean> {
    return this.idle$.asObservable()
  }

  public setIdleTimeout(minutes: number): void {
    this.idleTimeoutMs = minutes * 60 * 1000
  }

  public onUserActive(callback: () => void): void {
    this.onActiveCallback = callback
  }

  public onUserIdle(callback: () => void): void {
    this.onIdleCallback = callback
  }

  public destroy(): void {
    this.fallbackSub?.unsubscribe()
  }
}
