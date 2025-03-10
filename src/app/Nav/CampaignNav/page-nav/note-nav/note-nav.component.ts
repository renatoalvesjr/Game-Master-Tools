import {Component, inject, Input, OnInit} from '@angular/core';
import {Page} from '../../../../Interfaces/Page.interface';
import {Note} from '../../../../Interfaces/Note.interface';
import {NoteService} from '../../../../Services/note.service';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {CampaignService} from '../../../../Services/campaign.service';
import {UtilsService} from '../../../../Services/utils.service';

@Component({
  selector: 'app-note-nav',
  imports: [
    MatMenuTrigger,
    MatMenu,
    MatMenuItem
  ],
  templateUrl: './note-nav.component.html',
  styleUrl: './note-nav.component.scss'
})
export class NoteNavComponent implements OnInit {
  noteService = inject(NoteService);
  campaignService = inject(CampaignService);
  utils = inject(UtilsService);

  @Input() page!: Page;
  @Input() campaignId!: string

  notes: Note[] | null = [];

  selectNote(note: Note) {
    this.noteService.selectNote(note,this.page, this.campaignId);
  }

  async ngOnInit() {
    await this.loadAllNotes();
  }

  async loadAllNotes() {
    this.notes = await this.noteService.loadAllNotes(this.campaignId, this.page.pageId).then(async () =>
      this.notes = await this.noteService.loadAllNotes(this.campaignId, this.page.pageId)
    )
  }

  deleteNote(id: string) {
    this.noteService.deleteNote(this.campaignId, this.page.pageId, id).then(async () => {
      this.notes = await this.noteService.loadAllNotes(this.campaignId, this.page.pageId);
    });
  }



  async renameNote(note: Note) {
    const noteElement = document.getElementById('note-' + note.noteId);
    if (!noteElement) {
      return;
    }
    noteElement.contentEditable = 'true';
    noteElement.focus();
    const range = document.createRange();
    range.selectNodeContents(noteElement);
    const selection = window.getSelection();
    selection!.removeAllRanges();
    selection!.addRange(range);

    const disableContentEditable = async () => {
      selection!.setPosition(noteElement, 0);
      noteElement.contentEditable = 'false';
      noteElement.removeEventListener('blur', disableContentEditable);
      noteElement.removeEventListener('keydown', disableContentEditable);

      const updatedTitle = noteElement.innerText.trim();
      if (updatedTitle !== note.noteTitle.trim()) {
        note.noteTitle = updatedTitle;
      }
      await this.noteService.updateNote(this.campaignId, this.page.pageId, note);

      const campaign = await this.campaignService.getCampaignById(this.campaignId);
      campaign.campaignUpdateDate = this.utils.getTimeNow();
      this.campaignService.updateCampaign(campaign).then();
    }

    const onKeyDown = (evt: KeyboardEvent) => {
      if (evt.key === 'Enter') {
        evt.preventDefault();
        noteElement.blur();
      }
    }

    noteElement.addEventListener('blur', disableContentEditable);
    noteElement.addEventListener('keydown', onKeyDown)
  }
}
