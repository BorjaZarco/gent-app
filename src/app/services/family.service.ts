import { Injectable } from '@angular/core';
import { Family } from '../types/definitions/family';
import { Person } from '../types/definitions/person';
import { DataService } from './data.service';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class FamilyService {
  families: Record<string, Family>;
  constructor(private utils: UtilsService, private dataService: DataService) {}

  loadFamilies(familiesToLoad = {}) {
    this.families = familiesToLoad;
  }

  familiesLoaded(): boolean {
    return !!this.families && Object.keys(this.families).length > 0;
  }

  async loadFamiliesLocalDB() {
    const families = await this.dataService.loadData('families');
    console.log(families);

    this.loadFamilies(families);
  }

  async loadFamiliesFromFile(file: string = '') {
    const families: { [key: string]: any } = {};
    const familyRegex = /0 @(\w)+@ FAM/g;
    const familiesIdx = [...file.matchAll(familyRegex)].map((m) => m.index);
    for (let index = 0; index < familiesIdx.length - 1; index++) {
      const currentFamily = familiesIdx[index];
      const nextFamily = familiesIdx[index + 1] || 0;
      const familyStr = file.slice(currentFamily, nextFamily - 1);
      const family = familyStr.split('\n');
      const parsedFamily = this.parseFamily(family);
      families[parsedFamily.id as string] = parsedFamily;
    }
    await this.dataService.storeData('families', families);
    this.loadFamilies(families);
  }

  getFamilies(): Family[] {
    return Object.values(this.families || []);
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

  private parseFamily(familyData: string[]) {
    const family: { [key: string]: string | boolean | string[] } = {};
    familyData.forEach((row, i) => {
      if (row.startsWith('0')) {
        const [prefix, idx, _] = row.split('@');
        family['id'] = idx;
      } else if (row.startsWith('1 HUSB')) {
        family['husband'] = row.replace('1 HUSB ', '').replace(/@/g, '');
      } else if (row.startsWith('1 WIFE')) {
        family['wife'] = row.replace('1 WIFE ', '').replace(/@/g, '');
      } else if (row.startsWith('1 CHIL')) {
        family['children'] = [
          ...((family['children'] as string[]) || []),
          row.replace('1 CHIL ', '').replace(/@/g, ''),
        ];
      } else if (row.startsWith('1 MARR')) {
        family['marriage'] = true;
        let j = 1;
        let marriageInfoRow = familyData[i + j];
        while (marriageInfoRow && marriageInfoRow.startsWith('2')) {
          if (marriageInfoRow.startsWith('2 DATE')) {
            family['marriageDate'] = this.utils.parseDate(
              marriageInfoRow.replace('2 DATE ', '')
            );
          } else if (marriageInfoRow.startsWith('2 PLAC')) {
            family['marriagePlace'] = marriageInfoRow.replace('2 PLAC ', '');
          } else {
            console.log('unhandled marriage data: ', row);
          }
          j++;
          marriageInfoRow = familyData[i + j];
        }
      } else if (row.startsWith('1 DIV')) {
        family['divorce'] = true;
        let j = 1;
        let divorceInfoRow = familyData[i + j];
        while (divorceInfoRow && divorceInfoRow.startsWith('2')) {
          if (divorceInfoRow.startsWith('2 DATE')) {
            family['divorceDate'] = this.utils.parseDate(
              divorceInfoRow.replace('2 DATE ', '')
            );
          } else if (divorceInfoRow.startsWith('2 PLAC')) {
            family['divorcePlace'] = divorceInfoRow.replace('2 PLAC ', '');
          } else {
            console.log('unhandled divorce data: ', row);
          }
          j++;
          divorceInfoRow = familyData[i + j];
        }
      } else {
        if (!row.startsWith('2 PLAC') && !row.startsWith('2 DATE')) {
          console.log('unhandled: ', row);
        }
      }
    });
    return family;
  }
}
