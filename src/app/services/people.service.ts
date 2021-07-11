import { Injectable } from '@angular/core';
import { Person } from '../types/definitions/person';

@Injectable({
  providedIn: 'root',
})
export class PeopleService {
  people: Record<string, Person>;
  constructor() {}

  loadPeople(peopleToLoad = {}) {
    this.people = peopleToLoad;
  }

  getPeople(): Person[] {
    return Object.values(this.people);
  }

  getPerson(id: string): Person {
    return this.people[id];
  }
}
