import { VideoData } from '@/contracts/media-video-result-contract'
import { PerfectScrollDirective } from '@/directives/perfect-scroll.directive'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import { LocalService } from '@/services/local.service'
import { VideoAnalyzerService } from '@/services/video-analyzer.service'
import { NgClass } from '@angular/common'
import { Component, inject, OnInit, signal } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { takeUntil, tap } from 'rxjs'
import { SupportedLanguageComponent } from '../insights/supported-language/supported-language.component'

@Component({
  selector: 'app-list-videos-popup',
  standalone: true,
  imports: [MatDialogModule, PerfectScrollDirective, NgClass, SupportedLanguageComponent],
  templateUrl: './list-videos-popup.component.html',
  styleUrl: './list-videos-popup.component.scss',
})
export class ListVideosPopupComponent extends OnDestroyMixin(class {}) implements OnInit {
  lang = inject(LocalService)
  videoAnalyzerService = inject(VideoAnalyzerService)
  ref = inject<MatDialogRef<ListVideosPopupComponent>>(MatDialogRef)
  data = inject<{ videos: VideoData[] }>(MAT_DIALOG_DATA)
  videos = signal<VideoData[]>([])
  selectedVideo = signal<VideoData | undefined>(undefined)
  isLoading = signal(true)
  language = signal('')

  ngOnInit(): void {
    this.videos.set(this.data.videos)
    this.isLoading.set(false)
  }
  onVideoSelect() {
    this.ref.close(this.selectedVideo())
  }

  getAllVideos() {
    this.videoAnalyzerService
      .getListOfVideos()
      .pipe(
        takeUntil(this.destroy$),
        tap(res => {
          this.videos.set(res)
          this.isLoading.set(false)
        })
      )
      .subscribe()
  }
}
