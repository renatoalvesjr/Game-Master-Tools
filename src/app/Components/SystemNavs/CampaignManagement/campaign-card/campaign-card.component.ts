import {Component, inject, Input, OnInit} from '@angular/core';
import {CampaignService} from '../../../../Services/campaign.service';
import {Observable} from 'rxjs';
import {Campaign} from '../../../../Interfaces/Campaign.interface';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-campaign-card',
  imports: [
    DatePipe
  ],
  templateUrl: './campaign-card.component.html',
  styleUrl: './campaign-card.component.scss'
})
export class CampaignCardComponent {
  @Input() campaign!: Campaign;
  constructor() { }
}
