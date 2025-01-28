import { Component, OnInit } from '@angular/core';
import { MButtonComponent } from '../Buttons/m-button/m-button.component';
import { CommonModule } from '@angular/common';
import { NoteEditorComponent } from '../Editor/Editor.component';

@Component({
  selector: 'app-Navigation',
  templateUrl: './Navigation.component.html',
  styleUrls: ['./Navigation.component.css'],
  imports: [CommonModule, MButtonComponent, NoteEditorComponent],
  standalone: true,
})
export class NavigationComponent implements OnInit {
  subHidden: boolean = false;
  toggleSubmenu() {
    console.log('toggleSubmenu');
    console.log('from ' + this.subHidden);
    this.subHidden = !this.subHidden;
    console.log('to ' + this.subHidden);
  }
  constructor() {}

  ngOnInit() {}
}
