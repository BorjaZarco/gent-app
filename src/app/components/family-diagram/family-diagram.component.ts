import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FamilyService } from 'src/app/services/family.service';
import { PeopleService } from 'src/app/services/people.service';
import { Family } from 'src/app/types/definitions/family';
import { Person } from 'src/app/types/definitions/person';

@Component({
  selector: 'app-family-diagram',
  templateUrl: './family-diagram.component.html',
  styleUrls: ['./family-diagram.component.scss'],
})
export class FamilyDiagramComponent implements OnInit, OnChanges {
  @Input('parentPersonId') parentPersonId: string;
  @Input('personId') personId: string;
  family: Family;
  person: Person;
  husband: Person;
  wife: Person;

  constructor(
    private familyService: FamilyService,
    private peopleService: PeopleService
  ) {}

  ngOnInit(): void {
    this.setFamily();
  }

  ngOnChanges(): void {
    this.setFamily();
  }

  setFamily() {
    if (this.personId) {
      this.person = this.peopleService.getPerson(this.personId);
      this.family = this.familyService.getCurrentPersonFamily(
        this.person.id,
        this.person.sex
      );
      if (this.family) {
        this.husband = this.peopleService.getPerson(this.family.husband);
        this.wife = this.peopleService.getPerson(this.family.wife);
      }
    }
  }
}
