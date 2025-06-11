import { FILE_NAME_PATTERN } from '@/constants/file-name-pattern'
import { LocalService } from '@/services/local.service'
import { NgClass } from '@angular/common'
import { Component, inject } from '@angular/core'
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'app-add-file-name-popup',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './add-file-name-popup.component.html',
  styleUrl: './add-file-name-popup.component.scss',
})
export class AddFileNamePopupComponent {
  ref = inject<MatDialogRef<AddFileNamePopupComponent>>(MatDialogRef)
  fileNameControl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.pattern(FILE_NAME_PATTERN),
      Validators.minLength(3),
      Validators.maxLength(20),
    ],
  })
  lang = inject(LocalService)

  save() {
    let filename = this.fileNameControl.value.trim()
    if (!filename.endsWith('.mp4')) {
      filename += '.mp4'
    }
    this.ref.close(filename)
  }

  cancel() {
    this.ref.close()
  }
}
