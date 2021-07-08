import { Injectable } from '@angular/core';
import * as db from '../../assets/db.json';
import { Person } from '../types/definitions/person';

@Injectable({
  providedIn: 'root',
})
export class PeopleService {
  people = db['people'] || {};
  constructor() {}

  getPeople(): Person[] {
    return Object.values(this.people);
  }

  getPerson(id: string): Person {
    return this.people[id];
  }
}
