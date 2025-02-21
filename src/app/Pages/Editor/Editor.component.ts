import {Editor as Tiptap, Extension} from '@tiptap/core';
import {NgxTiptapModule} from 'ngx-tiptap';
import {
  Component,
  inject, Input,
  OnDestroy, OnInit,
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {ActivatedRoute} from '@angular/router';
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
import {ElapsedTimeDirective} from '../../Directives/elapsed-time.directive';
import {Campaign} from '../../Interfaces/Campaign.interface';

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
    ElapsedTimeDirective,
  ]
})
export class NoteEditorComponent implements OnDestroy, OnInit {
  utils = inject(UtilsService);
  route = inject(ActivatedRoute);
  dialog = inject(MatDialog);
  campaignService = inject(CampaignService);

  @Input() campaign: Campaign | null = null;

  content = '<p>Standard</p>';
  campaignId: string = '';
  pageId!: string;
  noteId!: string;
  note!: Note;
  page!: Page;
  url = '';

  constructor() {
  }

  async ngOnInit() {
    this.pageId = this.route.snapshot.paramMap.get('pageId')!;
    this.noteId = this.route.snapshot.paramMap.get('noteId')!;
    console.log(this.noteId)
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
    }, 1000);
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
    // const campaign = await this.campaignService.getCampaignById(this.campaignId);
    // const page = campaign.campaignPages.find((p) => p.pageId === this.pageId);
    // const note = page?.pageNotes.find((n) => n.noteId === this.noteId);
    // if (note) {
    //   note.noteContent = this.editor.getHTML();
    // }
    // campaign.campaignPages[campaign.campaignPages.indexOf(page!)].pageNotes[page!.pageNotes.indexOf(note!)] = note!;
    // campaign.campaignUpdateDate = this.utils.getTimeNow();
    //
    // await this.campaignService.updateCampaign(campaign);
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
    extensions: [...extensions],
  });

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
