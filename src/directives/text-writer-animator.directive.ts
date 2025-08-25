import { AnimationStateService } from '@/services/animation-state.service'
import { Directive, ElementRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core'

@Directive({
  selector: '[appTextWriterAnimator]',
  standalone: true,
})
export class TextWriterAnimatorDirective implements OnInit {
  @Input() text = ''
  @Input() speed = 2
  @Input() stop = false
  @Input() disableAnimate = false
  @Input({ required: true }) trackedId: string | number = ''
  @Output() animating: EventEmitter<boolean> = new EventEmitter<boolean>()
  elementRef = inject(ElementRef)
  animationState = inject(AnimationStateService)

  ngOnInit(): void {
    this.animateText()
  }
  animateText() {
    if (this.disableAnimate || this.animationState.has(this.trackedId)) {
      this.animating.emit(false)
      this.elementRef.nativeElement.innerHTML = this.text // Render current text

      return
    }
    this.animating.emit(true)
    this.animationState.mark(this.trackedId)
    let index = 0
    let currentText = ''

    const addNextCharacter = () => {
      if (this.stop) {
        this.animating.emit(false)
        return
      }
      currentText += this.text.charAt(index)
      this.elementRef.nativeElement.innerHTML = currentText // Render current text
      // chatContainer.scrollTop = chatContainer.scrollHeight;
      index++
      if (index < this.text.length) {
        setTimeout(addNextCharacter, this.speed * Math.random()) // Adjust speed here (milliseconds)
      } else {
        this.animating.emit(false)
      }
    }
    addNextCharacter()
  }
}
