import { trigger, transition, style, animate } from '@angular/animations'

export const fadeInScale = trigger('fadeInScale', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.95)' }),
    animate('800ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
  ]),
])
