import { Injectable } from '@angular/core';
import { Family } from '../types/definitions/family';
import { Person } from '../types/definitions/person';

@Injectable({
  providedIn: 'root',
})
export class FamilyService {
  families: Record<string, Family>;
  constructor() {}

  loadFamilies(familiesToLoad = {}) {
    this.families = familiesToLoad;
  }

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
      const husbandFamily = this.getAscendanceFamily(possibleTop.husband);
      const wifeFamily = this.getAscendanceFamily(possibleTop.wife);

      return !husbandFamily && !wifeFamily;
    });
  }

  getPersonFamilyTops(person: Person): Family[] {
    const personFamily = this.getAscendanceFamily(person.id);

    const familyTops = personFamily
      ? this.getFamilyAscendanceRecursive([], personFamily)
      : this.getPersonFamily(person.id, person.sex);

    const uniqueFamilyTops = (familyTops || []).reduce((uniques, family) => {
      uniques[family.id] = family;
      return uniques;
    }, {});
    return Object.values(uniqueFamilyTops);
  }

  getFamilyAscendanceRecursive(familyTops: Family[], family: Family): Family[] {
    const husbandFamily = this.getAscendanceFamily(family.husband);
    const wifeFamily = this.getAscendanceFamily(family.wife);
    const hasNoAscendance = !husbandFamily && !wifeFamily;
    if (hasNoAscendance) {
      return [family];
    } else {
      if (husbandFamily) {
        const husbandTop = this.getFamilyAscendanceRecursive(
          familyTops,
          husbandFamily
        );
        familyTops = familyTops.concat(husbandTop);
      }
      if (wifeFamily) {
        const wifeTop = this.getFamilyAscendanceRecursive(
          familyTops,
          wifeFamily
        );
        familyTops = familyTops.concat(wifeTop);
      }
      return familyTops;
    }
  }

  getCurrentPersonFamily(id: string, sex: 'M' | 'F'): Family {
    const allFamilies = this.getPersonFamily(id, sex);
    return allFamilies.length === 1
      ? allFamilies[0]
      : (allFamilies || []).find((family) => !family?.divorce);
  }
}
