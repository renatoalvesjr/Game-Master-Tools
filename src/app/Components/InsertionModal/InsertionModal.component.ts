import { Component, inject, model, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';

interface Data {
  url: string;
}

@Component({
  selector: 'app-InsertionModal',
  templateUrl: './InsertionModal.component.html',
  styleUrls: ['./InsertionModal.component.css'],
  standalone: true,
  imports: [MatDialogContent, FormsModule, MatDialogActions, MatDialogClose],
})
export class InsertionModalComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<InsertionModalComponent>);
  readonly data = inject<Data>(MAT_DIALOG_DATA);
  readonly url = model(this.data.url);

  constructor() {}

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
