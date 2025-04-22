import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Note} from "../../Types/Note.type";
import {MatMenu, MatMenuTrigger} from '@angular/material/menu';
import {SvgIconComponent} from 'angular-svg-icon';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-note-nav-item',
  imports: [
    SvgIconComponent,
    MatMenuTrigger,
    TranslatePipe
  ],
  templateUrl: './note-nav-item.component.html',
  styleUrl: './note-nav-item.component.scss'
})
export class NoteNavItemComponent {

  @Input() note: Note | undefined;
  @Input() noteContext: MatMenu | undefined;
  @Output() selectNote: EventEmitter<Note> = new EventEmitter<Note>();
}
