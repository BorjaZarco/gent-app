import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() {}

  parseDate(dateStr: string) {
    const possibleFormats = ['DD MMM YYYY', 'YYYY'];
    for (const format of possibleFormats) {
      const momentDate = moment(dateStr, format);
      if (momentDate.isValid()) {
        return momentDate.format('YYYYMMDD');
      }
    }
    throw new Error('Wrong date format');
  }
}
