import {Editor as Tiptap, Extension} from '@tiptap/core';
import {NgxTiptapModule} from 'ngx-tiptap';
import {
  Component,
  inject,
  OnDestroy,
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
import {extensions, fonts} from '../../Extensions/editor-extenstions';
import {InsertionModalComponent} from '../../Components/InsertionModal/InsertionModal.component';
import {ElectronService} from '../../Services/electron.service';
import {CampaignService} from '../../Services/campaign.service';

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
  ],
  standalone: true,
})
export class NoteEditorComponent implements OnDestroy {
  es = inject(ElectronService);
  route = inject(ActivatedRoute);
  dialog = inject(MatDialog);
  campaignService = inject(CampaignService);
  content = '<p>Standard</p>';
  campaignId: string = '';
  pageId: string = this.route.snapshot.paramMap.get('pageId')!;
  noteId: string = this.route.snapshot.paramMap.get('noteId')!;
  note!: Note;
  fontList = fonts;
  url = '';

  constructor() {
    this.route.params.subscribe((params) => {
      this.campaignId = this.route.parent?.snapshot.paramMap.get('campaignId')!;
      this.pageId = params['pageId'];
      this.noteId = params['noteId'];
      this.note = this.campaignService.getNoteById(this.campaignId, this.pageId, this.noteId);
      this.content = this.note.noteContent;
    })
  }

  private typingTimeout: any;

  onEditorUpdate() {
    clearTimeout(this.typingTimeout);
    this.typingTimeout = setTimeout(() => {
      this.saveNote().then()
    }, 3000);
  }

  textColor = '#000000';
  editable = true;

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

  /**
   * Toggles the link in the editor. If a link is already present, it opens a dialog to edit the URL.
   * If the URL is empty, it removes the link. If a new URL is provided, it sets the link to the new URL.
   *
   * @remarks
   * This method uses the editor's chainable commands to focus, extend the mark range, and set or unset the link.
   *
   * @returns {void}
   */
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

  /**
   * Prompts the user for an image URL and inserts the image into the editor.
   * If the user provides a valid URL, the image is added at the current cursor position.
   */
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

  /**
   * Saves the current content of the editor to the note and updates the note content on the screen.
   * This method retrieves the HTML content from the editor, updates the note content in the service,
   * and then refreshes the note content on the screen.
   */
  async saveNote() {
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

  /**
   * Initializes a new instance of the Tiptap editor with the specified content and extensions.
   *
   *  @property {Tiptap} editor - The Tiptap editor instance.
   * @property {Object} editor.content - The initial content configuration for the editor.
   * @property {string} editor.content.type - The type of the document, set to 'doc'.
   * @property {Array} editor.extensions - The array of extensions to be used by the editor.
   */
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
