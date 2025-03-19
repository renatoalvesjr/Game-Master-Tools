import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Note} from "../../Interfaces/Note.interface";
import {MatMenu, MatMenuTrigger} from '@angular/material/menu';
import {SvgIconComponent} from 'angular-svg-icon';

@Component({
  selector: 'app-note-nav-item',
  imports: [
    SvgIconComponent,
    MatMenuTrigger
  ],
  templateUrl: './note-nav-item.component.html',
  styleUrl: './note-nav-item.component.scss'
})
export class NoteNavItemComponent {

  @Input() note: Note | undefined;
  @Input() noteContext: MatMenu | undefined;
  @Output() selectNote: EventEmitter<Note> = new EventEmitter<Note>();
}
