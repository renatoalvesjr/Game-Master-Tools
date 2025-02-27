import {Component, inject, Input, OnInit} from '@angular/core';
import {Page} from '../../../../Interfaces/Page.interface';
import {Note} from '../../../../Interfaces/Note.interface';
import {NoteService} from '../../../../Services/note.service';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-note-nav',
  imports: [
    AsyncPipe
  ],
  templateUrl: './note-nav.component.html',
  styleUrl: './note-nav.component.scss'
})
export class NoteNavComponent implements OnInit {
  noteService = inject(NoteService);

  @Input() page!: Page;
  @Input() campaignId!: string

  notes: Note[] | null = [];

  async ngOnInit() {
    await this.loadAllNotes();
  }
  async loadAllNotes() {
    this.notes = await this.noteService.loadAllNotes(this.campaignId, this.page.pageId);
    console.log(this.notes)
  }
}
