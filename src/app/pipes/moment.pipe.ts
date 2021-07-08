import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'moment',
})
export class MomentPipe implements PipeTransform {
  transform(value: string, format: string = 'DD/MM/YYYY'): string {
    const momentDate = moment(value, 'YYYYMMDD');
    return momentDate.isValid() ? momentDate.format(format) : value;
  }
}
