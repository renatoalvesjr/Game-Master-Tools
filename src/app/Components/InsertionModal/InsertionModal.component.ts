import {Component, inject, model, OnInit} from '@angular/core';
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
}
