import {inject, Injectable} from '@angular/core';
import {WindowRef} from './window.service';
import {Page} from '../Interfaces/Page.interface';
import {Note} from '../Interfaces/Note.interface';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  window = inject(WindowRef).getWindow();

  constructor() {
  }

  async loadAllNotes(campaignId: string, pageId: string): Promise<Note[] | null> {
    const request = {
      filePath: "Campaigns/" + campaignId + "/Pages/" + pageId + "/Notes/",
      fileName: "/note.json"
    }
    try {
      const notes: Note[] = [];
      await this.window.electronAPI.returnAllFiles(request).then((value: string[]) => {
        value.forEach((note) => {
          notes.push(JSON.parse(note) as Note);
        });
      })
      return notes;
    } catch (e) {
      console.error('Error on loadAllNotes:', e);
    }
    return null;
  }

  async addNote(campaignId: string, pageId: string, note: Note) {
    try {
      const request = {
        filePath: "Campaigns/" + campaignId + "/Pages/" + pageId + "/Notes/" + note.noteId + "/",
        fileName: "note.json",
        content: JSON.stringify(note)
      }

      await this.window.electronAPI.saveFile(request);
    } catch (e) {
      console.error('Error on addNote:', e);
    }
  }
}
