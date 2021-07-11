import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight',
})
export class HighlightPipe implements PipeTransform {
  transform(value: string, highlightVal?: string): string {
    value = `<p>${value}</p>`;
    if (!highlightVal) {
      return value;
    }
    const regex = new RegExp(highlightVal, 'gi');
    value = value.replace(regex, '<b>$&</b>');
    return value;
  }
}
