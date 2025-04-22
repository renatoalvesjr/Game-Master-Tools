import {inject, Injectable} from '@angular/core';
import {WindowRef} from './window.service';
import {Page} from '../Types/Page.type';
import {Note} from '../Types/Note.type';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  window = inject(WindowRef).getWindow();
  private selectedDataSubject = new BehaviorSubject<{ note: Note | null, page: Page | null, campaignId: string}>({ note: null, page: null, campaignId: '' });
  selectedNote$ = this.selectedDataSubject.asObservable();

  selectNote(note: Note | null, page: Page | null, campaignId: string) {
    this.selectedDataSubject.next({ note: note, page: page, campaignId});
  }
  unselectNote() {
    this.selectedDataSubject.next({ note: null, page: null, campaignId: '' });
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

  async updateNote(campaignId: string | null, pageId: string, note: Note) {
    const request = {
      filePath: "Campaigns/" + campaignId + "/Pages/" + pageId+"/Notes/"+ note.noteId + "/",
      fileName: "note.json",
      content: JSON.stringify(note)
    }
    try{
      await this.window.electronAPI.saveFile(request);
    }catch(e){
      console.error('Error on updateNote:', e);
    }
  }

  async deleteNote(campaignId: string, pageId: string, noteId: string) {
    const request = {
      filePath: "Campaigns/" + campaignId + "/Pages/" + pageId + "/Notes/" + noteId + "/",
      fileName: "",
    }
    try {
      await this.window.electronAPI.deleteFile(request);
      await this.loadAllNotes(campaignId, pageId)
    } catch (e) {
      console.error('Error on delete Note:', e);
    }
  }
}
