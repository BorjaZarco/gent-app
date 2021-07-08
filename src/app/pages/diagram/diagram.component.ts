import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { of } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { FamilyService } from 'src/app/services/family.service';
import { PeopleService } from 'src/app/services/people.service';
import { Family } from 'src/app/types/definitions/family';
import { Person } from 'src/app/types/definitions/person';

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.scss'],
})
export class DiagramComponent implements OnInit {
  people: Person[] = [];
  families: Family[] = [];

  familyTops: Family[] = [];

  selectedPerson = null;
  selectedTop: Family;
  displayPersonData: boolean;

  constructor(
    private peopleService: PeopleService,
    private familyService: FamilyService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.people = this.peopleService.getPeople();
    this.familyTops = this.familyService.getFamilyTops();
    this.selectedTop = this.familyTops[0];
    this.selectedPerson = this.route.firstChild?.snapshot?.paramMap?.get('id');
    this.router.events
      .pipe(
        filter((event) => event instanceof ActivationEnd),
        filter(
          (event: ActivationEnd) =>
            event.snapshot.component === this.route.snapshot.component
        ),
        switchMap((event) => {
          return this.route.firstChild
            ? this.route.firstChild.paramMap
            : of(null);
        })
      )
      .subscribe((params) => {
        this.selectedPerson = params?.get('id');
      });
  }

  onSelectPerson(selectedPerson: any) {
    if (this.selectedPerson?.id === selectedPerson?.id) {
      this.selectedPerson = null;
    } else {
      this.selectedPerson = selectedPerson;
    }
  }
}
