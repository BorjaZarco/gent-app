import { Pipe, PipeTransform } from '@angular/core';
import { ObjectPipe } from './object.pipe';

@Pipe({
  name: 'arrayObject',
})
export class ArrayObjectPipe implements PipeTransform {
  constructor(private objectPipe: ObjectPipe) {}
  transform(
    arrayOfObject: Record<string, any>[] = [],
    keys: string[] = [],
    spaceChar: string = ' ',
    joinChar: string = ', '
  ): string {
    const mappedArray = arrayOfObject.map((object) => {
      return this.objectPipe.transform(object, keys, spaceChar);
    });

    return mappedArray.join(joinChar);
  }
}
