import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

interface SystemNavList {
  name: string;
  route: string;
  icon: string;
  iconType: string;
  active: boolean;
}

@Component({
  selector: 'app-system-nav-list',
  standalone: true,
  imports: [],
  templateUrl: './system-nav-list.component.html',
  styleUrl: './system-nav-list.component.scss',
})
export class SystemNavListComponent implements OnInit {
  @Output() systemChange: EventEmitter<string> = new EventEmitter();

  navigate(system: SystemNavList) {
    this.navList.forEach((nav) => (nav.active = false));
    system.active = true;
    this.systemChange.emit(system.route);
    this.route.navigate([system.route]);
  }
  route = inject(Router);

  navList: SystemNavList[] = [
    {
      name: 'Campaigns',
      route: 'campaigns',
      icon: 'menu_book',
      iconType: 'material-symbols-outlined',
      active: true,
    },
    {
      name: 'Item Vault',
      route: 'items',
      icon: 'swords',
      iconType: 'material-symbols-outlined',
      active: false,
    },
    {
      name: 'Systems',
      route: 'systems',
      icon: 'shelves',
      iconType: 'material-symbols-outlined',
      active: false,
    },
    {
      name: 'Sound',
      route: 'sound',
      icon: 'music_cast',
      iconType: 'material-symbols-outlined',
      active: false,
    },
  ];

  constructor() {}

  ngOnInit() {}
}
