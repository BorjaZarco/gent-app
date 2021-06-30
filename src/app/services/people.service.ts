import { Injectable } from '@angular/core';
import * as db from '../../assets/db.json';

@Injectable({
  providedIn: 'root',
})
export class PeopleService {
  people = db['people'] || {};
  constructor() {}

  getPeople(): any[] {
    return Object.values(this.people);
  }

  getPerson(id: string) {
    return this.people[id];
  }
}
