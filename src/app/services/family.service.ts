import { Injectable } from '@angular/core';
import * as db from '../../assets/db.json';
import { Family } from '../types/definitions/family';

@Injectable({
  providedIn: 'root',
})
export class FamilyService {
  families = db['families'] || {};
  constructor() {}

  getFamilies(): Family[] {
    return Object.values(this.families);
  }

  getFamily(id: string): Family {
    return this.families[id];
  }

  getAscendanceFamily(personId: string): Family {
    const families = this.getFamilies();
    return families.find((family) =>
      (family.children || []).includes(personId)
    );
  }

  getPersonFamily(personId: string, sex: 'M' | 'F'): Family[] {
    return sex === 'M'
      ? this.getManFamily(personId)
      : this.getWomanFamily(personId);
  }

  getManFamily(personId: string): Family[] {
    const families = this.getFamilies();
    return families.filter((family) => family.husband === personId);
  }

  getWomanFamily(personId: string): Family[] {
    const families = this.getFamilies();
    return families.filter((family) => family.wife === personId);
  }

  getFamilyTops(): Family[] {
    const families = this.getFamilies();
    return families.filter((possibleTop) => {
      const husbandFamily = families.find((family) =>
        (family.children || []).includes(possibleTop.husband)
      );
      const wifeFamily = families.find((family) =>
        (family.children || []).includes(possibleTop.wife)
      );

      return !husbandFamily && !wifeFamily;
    });
  }

  getCurrentPersonFamily(id: any, sex: any): Family {
    const allFamilies = this.getPersonFamily(id, sex);
    return allFamilies.length === 1
      ? allFamilies[0]
      : (allFamilies || []).find((family) => !family?.divorce);
  }
}
