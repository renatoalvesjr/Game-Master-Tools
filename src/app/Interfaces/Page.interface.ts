import { Note } from './Note.interface';

export interface Page {
  pageId: string;
  pageTitle: string;
  pageNotes: Note[];
  pageCreationDate: string;
  pageIndex: number;
  pageActive: boolean;
}
