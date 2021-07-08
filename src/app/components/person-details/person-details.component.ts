import { Component, Input, OnChanges, OnInit } from '@angular/core';
import * as moment from 'moment';
import { FamilyService } from 'src/app/services/family.service';
import { PeopleService } from 'src/app/services/people.service';
import { Family } from 'src/app/types/definitions/family';
import { Person } from 'src/app/types/definitions/person';

@Component({
  selector: 'app-person-details',
  templateUrl: './person-details.component.html',
  styleUrls: ['./person-details.component.scss'],
})
export class PersonDetailsComponent implements OnInit, OnChanges {
  @Input('person') person;

  families: Family[];
  ascendanceFamily: Family;

  personAge: string;
  children: Person[];
  partners: Person[];
  parents: Person[];
  siblings: Person[];

  constructor(
    private familyService: FamilyService,
    private peopleService: PeopleService
  ) {}

  ngOnInit(): void {}

  ngOnChanges() {
    if (this.person) {
      const birthMoment = moment(this.person.birthDate, 'YYYYMMDD');
      if (this.person.birthDate && birthMoment?.isValid()) {
        // this.personAge = moment().diff(birthMoment, 'year');
        this.personAge = birthMoment.fromNow(true);
      } else {
        this.personAge = null;
      }
      this.families = this.familyService.getPersonFamily(
        this.person.id,
        this.person.sex
      );

      this.partners = [];
      this.children = [];
      this.families.forEach((family) => {
        const familyChildren = (family.children || []).map((child) =>
          this.peopleService.getPerson(child)
        );

        const partner =
          family.husband === this.person.id
            ? this.peopleService.getPerson(family.wife)
            : this.peopleService.getPerson(family.husband);
        this.partners.push(partner);
        this.children = this.children.concat(familyChildren);
      });

      this.ascendanceFamily = this.familyService.getAscendanceFamily(
        this.person.id
      );
      this.parents = [
        this.peopleService.getPerson(this.ascendanceFamily?.husband),
        this.peopleService.getPerson(this.ascendanceFamily?.wife),
      ].filter((person) => !!person);
      this.siblings = (this.ascendanceFamily?.children || []).reduce(
        (sibs, child) => {
          if (child !== this.person.id) {
            sibs.push(this.peopleService.getPerson(child));
          }
          return sibs;
        },
        []
      );
    }
  }
}
