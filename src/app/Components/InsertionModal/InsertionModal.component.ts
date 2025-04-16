import {Component, EventEmitter, inject, model, OnInit, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {WindowRef} from '../../Services/window.service';

interface Data {
  url: string;
}

@Component({
  selector: 'app-InsertionModal',
  templateUrl: './InsertionModal.component.html',
  styleUrls: ['./InsertionModal.component.css'],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    TranslateModule
  ]
})
export class InsertionModalComponent implements OnInit {
  window = inject(WindowRef).getWindow()

  readonly dialogRef = inject(MatDialogRef<InsertionModalComponent>);
  readonly data = inject<Data>(MAT_DIALOG_DATA);
  readonly url = model(this.data.url);


  constructor(private translate: TranslateService) {
    this.translate.use(this.translate.currentLang)
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  async selectFile() {
    try {
      const url: string = await this.window.electronAPI.selectImage();
      this.url.set(url);
    } catch (e) {
      console.error("Error on selecting a image: ", e);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      // Atualizando o Signal com o valor base64
      this.url.set(reader.result as string); // Usando `.set()` para atualizar o Signal
    };
    reader.readAsDataURL(file); // Lê o arquivo como base64
  }
}
