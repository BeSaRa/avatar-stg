import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class AnimationStateService {
  private done = new Set<string | number>()
  has(id?: string | number) {
    return id !== undefined && id !== '' && this.done.has(id)
  }
  mark(id?: string | number) {
    if (id !== undefined && id !== '') this.done.add(id)
  }
  clear() {
    this.done.clear()
  }
}
