import { Note } from './Note.interface';

export interface Page {
  pageId: string;
  pageTitle: string;
  pageCreationDate: string;
  pageColor: string;
  pageIndex: number;
  pageActive: boolean;
}
