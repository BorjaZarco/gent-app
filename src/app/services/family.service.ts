import { Injectable } from '@angular/core';
import * as db from '../../assets/db.json';

@Injectable({
  providedIn: 'root',
})
export class FamilyService {
  families = db['families'] || {};
  constructor() {}

  getFamilies(): any[] {
    return Object.values(this.families);
  }

  getFamily(id: string) {
    return this.families[id];
  }

  getPersonFamily(personId: string, gender: 'M' | 'F') {
    return gender === 'M'
      ? this.getManFamily(personId)
      : this.getWomanFamily(personId);
  }

  getManFamily(personId: string) {
    const families = this.getFamilies();
    return families.filter((family) => family.husband === personId);
  }

  getWomanFamily(personId: string) {
    const families = this.getFamilies();
    return families.filter((family) => family.wife === personId);
  }
}
