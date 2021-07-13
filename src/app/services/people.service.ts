import { Injectable } from '@angular/core';
import { Person } from '../types/definitions/person';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class PeopleService {
  people: Record<string, Person>;
  constructor(private utils: UtilsService) {}

  loadPeople(peopleToLoad = {}) {
    this.people = peopleToLoad;
  }

  loadPeopleFromFile(content: string = '') {
    const people: { [key: string]: any } = {};
    const personRegex = /0 @(\w)+@ INDI/g;
    const peopleIdx = [...content.matchAll(personRegex)].map((m) => m.index);
    for (let index = 0; index < peopleIdx.length - 1; index++) {
      const currentPerson = peopleIdx[index];
      const nextPerson = peopleIdx[index + 1] || 0;
      const personStr = content.slice(currentPerson, nextPerson - 1);
      const person = personStr.split('\n');
      // person.pop();
      const parsedPerson = this.parsePerson(person);
      people[parsedPerson.id as string] = parsedPerson;
    }
    this.loadPeople(people);
  }

  peopleLoaded(): boolean {
    return !!this.people && Object.keys(this.people).length > 0;
  }

  getPeople(): Person[] {
    return Object.values(this.people || {});
  }

  getPerson(id: string): Person {
    return this.people ? this.people[id] : null;
  }

  private parsePerson(personData: string[]) {
    const person: { [key: string]: string | boolean } = {};
    personData.forEach((row, i) => {
      if (row.startsWith('0')) {
        const [prefix, idx, _] = row.split('@');
        person['id'] = idx;
      } else if (row.startsWith('1 NAME')) {
        const [name, surname] = row
          .replace('1 NAME ', '')
          .slice(0, -1)
          .split('/');
        person['name'] = name.trim();
        person['surname'] = surname.trim();
      } else if (row.startsWith('1 SEX')) {
        person['sex'] = row.replace('1 SEX ', '');
      } else if (row.startsWith('1 BIRT')) {
        let birthInfoRow = personData[i + 1];
        let j = 1;
        while (birthInfoRow && birthInfoRow.startsWith('2')) {
          if (birthInfoRow.startsWith('2 DATE')) {
            person['birthDate'] = this.utils.parseDate(
              birthInfoRow.replace('2 DATE ', '')
            );
          } else if (birthInfoRow.startsWith('2 PLAC')) {
            person['birthPlace'] = birthInfoRow.replace('2 PLAC ', '');
          } else {
            // console.log('unhandled birth data: ', row);
          }
          j++;
          birthInfoRow = personData[i + j];
        }
      } else if (row.startsWith('1 DEAT')) {
        person['dead'] = true;
        let j = 1;
        let deathInfoRow = personData[i + j];
        if (deathInfoRow && deathInfoRow.startsWith('2')) {
          if (deathInfoRow.startsWith('2 DATE')) {
            person['deathDate'] = this.utils.parseDate(
              deathInfoRow.replace('2 DATE ', '')
            );
          } else if (deathInfoRow.startsWith('2 PLAC')) {
            person['deathPlace'] = deathInfoRow.replace('2 PLAC ', '');
          } else {
            // console.log('unhandled death data: ', deathInfoRow);
          }
          j++;
          deathInfoRow = personData[i + j];
        }
      } else if (row.startsWith('1 FAM')) {
      } else {
        if (!row.startsWith('2 PLAC') && !row.startsWith('2 DATE')) {
          // console.log('unhandled: ', row);
        }
      }
    });
    return person;
  }
}
