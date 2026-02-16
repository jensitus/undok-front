import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'newLine'
})
export class NewLinePipe implements PipeTransform {

  transform(value: string): string {
    return value.replace(/\n/g, '<br>');
  }

}
