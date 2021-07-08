import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'object',
})
export class ObjectPipe implements PipeTransform {
  transform(
    object: Record<string, any>,
    keys: string[] = [],
    spaceChar: string = ' '
  ): string {
    if (!object) {
      return '';
    }
    return keys.reduce((str, key) => {
      return `${str}${spaceChar}${object[key]}`;
    }, '');
  }
}
