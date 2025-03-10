import {Editor as Tiptap, Extension} from '@tiptap/core';
import {NgxTiptapModule} from 'ngx-tiptap';
import {
  Component,
  inject, Input, OnChanges,
  OnDestroy, OnInit, SimpleChanges,
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {Note} from '../../Interfaces/Note.interface';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {extensions,} from './editor-extenstions';
import {InsertionModalComponent} from '../../Components/InsertionModal/InsertionModal.component';
import {CampaignService} from '../../Services/campaign.service';
import {UtilsService} from '../../Services/utils.service';
import {Page} from '../../Interfaces/Page.interface';
import {NoteService} from '../../Services/note.service';

@Component({
  selector: 'app-note-editor',
  styleUrl: './Editor.component.css',
  templateUrl: './Editor.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxTiptapModule,
    MatSelectModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ]
})
export class NoteEditorComponent implements OnChanges, OnDestroy, OnInit {
  utils = inject(UtilsService);
  dialog = inject(MatDialog);
  noteService = inject(NoteService);
  campaignService = inject(CampaignService);

  @Input() note: Note | null = null;
  @Input() page: Page | null = null;
  @Input() campaignId!: string | null;

  content = '';
  url = '';

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['note'] && changes['note'].currentValue) {
      this.content = changes['note'].currentValue.noteContent;
    } else {
      this.content = '';
    }
  }

  async ngOnInit() {
    this.content = this.note?.noteContent || '';
    // this.note = this.campaign?.campaignPages.find(
    //   page => page.pageId === this.pageId)?.pageNotes.find(
    //   note => note.noteId === this.noteId)!;
    this.editor.on('update', () => {
      this.onEditorUpdate();
    })
  }

  private typingTimeout: any;

  onEditorUpdate() {
    clearTimeout(this.typingTimeout);
    this.typingTimeout = setTimeout(() => {
      this.saveFile().then()
    }, 200);
  }

  textColor = '#000000';

  LiteralTab = Extension.create({
    name: 'literalTab',

    addKeyboardShortcuts() {
      return {
        Tab: () => {
          return this.editor.commands.insertContent('\t');
        },
      };
    },
  });

  async saveFile() {
    if(this.note) {
      const campaign = await this.campaignService.getCampaignById(this.campaignId!);
      campaign.campaignUpdateDate = this.utils.getTimeNow();
      this.campaignService.updateCampaign(campaign).then();

      this.note!.noteContent = this.content;
      this.note!.noteUpdateDate = this.utils.getTimeNow();
      await this.noteService.updateNote(this.campaignId, this.page!.pageId, this.note!);
    }
  }

  onTextColorChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    this.textColor = value;
    this.editor.chain().focus().setColor(value).run();
  }

  fontFamilyChanges(event: Event) {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    this.editor.chain().focus().setFontFamily(value).run();
  }

  openDialog(oldUrl: string): Promise<string> {
    return new Promise((resolve) => {
      const dialogRef = this.dialog.open(InsertionModalComponent, {
        data: {url: oldUrl || ''},
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result !== undefined) {
          this.url = result;
        }
        resolve(this.url);
      });
    });
  }

  async toggleLink(): Promise<void> {
    const previousUrl = this.editor.getAttributes('link')['href'] || '';
    this.url = await this.openDialog(previousUrl);

    if (this.url === null) {
      return;
    }

    if (this.url === '') {
      this.editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    this.editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({href: this.url})
      .run();
  }

  async addImage(): Promise<void> {
    await this.openDialog('');
    const url = this.url;

    if (url) {
      this.editor.chain().focus().setImage({src: url}).run();
    }
  }

  parseInt(arg: string) {
    return parseInt(arg);
  }

  onHeadingChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;

    if (value === 'paragraph') {
      this.editor.chain().focus().setParagraph().run();
    } else if (value.startsWith('heading')) {
      const level = parseInt(value.replace('heading', ''), 10);

      this.editor
        .chain()
        .focus()
        .setHeading({level: level as any})
        .run();
    }
  }

  editor = new Tiptap({
    content: {
      type: 'doc',
    },
    extensions: [...extensions, this.LiteralTab],
  });

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
