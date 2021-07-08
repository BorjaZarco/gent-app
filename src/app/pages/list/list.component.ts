import { Component, OnInit } from '@angular/core';
import { FamilyService } from 'src/app/services/family.service';
import { PeopleService } from 'src/app/services/people.service';
import { Family } from 'src/app/types/definitions/family';
import { Person } from 'src/app/types/definitions/person';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  people: Person[] = [];
  families: Family[] = [];

  selectedPerson = null;
  familyTops: Family[];

  constructor(
    private peopleService: PeopleService,
    private familyService: FamilyService
  ) {}

  ngOnInit() {
    this.people = this.peopleService.getPeople();
    this.familyTops = this.familyService.getFamilyTops();
    console.log('fTop: ', this.familyTops);
  }

  onSelectPerson(selectedPerson: any) {
    if (this.selectedPerson?.id === selectedPerson?.id) {
      this.selectedPerson = null;
    } else {
      this.selectedPerson = selectedPerson;
    }
  }
}
