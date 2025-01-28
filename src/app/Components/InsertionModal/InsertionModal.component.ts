import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-InsertionModal',
  templateUrl: './InsertionModal.component.html',
  styleUrls: ['./InsertionModal.component.css'],
  standalone: true,
  imports: [MatDialogContent, FormsModule, MatDialogActions, MatDialogClose],
})
export class InsertionModalComponent implements OnInit {
  url = '';
  readonly dialogRef = inject(MatDialogRef<InsertionModalComponent>);

  constructor() {}

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
