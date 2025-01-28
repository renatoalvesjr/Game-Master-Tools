import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { interval } from 'rxjs';

@Directive({
  selector: '[appElapsedTime]',
  standalone: true,
})
export class ElapsedTimeDirective implements OnInit {
  @Input('appElapsedTime') isoTime!: string;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.updateElapsedTime();
    interval(1000).subscribe(() => this.updateElapsedTime()); // Update every 15 seconds
  }

  private updateElapsedTime() {
    const elapsedTime = this.calculateElapsedTime(this.isoTime);
    this.el.nativeElement.innerText = 'Created ' + elapsedTime;
  }

  private calculateElapsedTime(isoTime: string): string {
    const startTime = new Date(isoTime).getTime();
    const currentTime = Date.now();
    const elapsed = currentTime - startTime;

    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(elapsed / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    const parentWidth = this.el.nativeElement.parentElement.offsetWidth;

    if (parentWidth > 500) {
      if (years > 0) {
        return `${years.toString()} year(s) and ${months % 12} month(s) ago`;
      } else if (months > 0) {
        return `${months.toString()} month(s) ago`;
      } else if (days > 0) {
        return `${days.toString()} day(s) ago`;
      } else if (hours > 0) {
        return `${hours.toString()} hour(s) ago`;
      } else if (minutes > 0) {
        return `${minutes.toString()} minute(s) ago`;
      } else if (seconds > 0) {
        return `${seconds.toString()} second(s) ago`;
      } else {
        return `just now`;
      }
    } else {
      if (years > 0) {
        return `${years.toString()}y ${months % 12}m ago`;
      } else if (months > 0) {
        return `${months.toString()}m ago`;
      } else if (days > 0) {
        return `${days.toString()}d ago`;
      } else if (hours > 0) {
        return `${hours.toString()}h ago`;
      } else if (minutes > 0) {
        return `${minutes.toString()}m ago`;
      } else if (seconds > 0) {
        return `${seconds.toString()}s ago`;
      } else {
        return `now`;
      }
    }
  }
}
