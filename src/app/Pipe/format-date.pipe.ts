import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {

  transform(date: string): string {
    return new Date(date).toLocaleDateString();
  }

}
