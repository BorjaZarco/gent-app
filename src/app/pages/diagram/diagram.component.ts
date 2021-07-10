import { TitleCasePipe } from '@angular/common';
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
  filteredPeople: {
    fullname: string;
    id: string;
    familyId: string;
    familyName: string;
  }[] = [];
  families: Family[] = [];

  familyTops: Family[] = [];

  selectedPerson = null;
  selectedTop: Family;
  displayPersonData: boolean;
  familyTopsToDisplay: (Family & { familyName: string })[];

  constructor(
    private peopleService: PeopleService,
    private familyService: FamilyService,
    private route: ActivatedRoute,
    private titlecase: TitleCasePipe,
    private router: Router
  ) {}

  ngOnInit() {
    this.people = this.peopleService.getPeople();
    this.familyTops = this.familyService.getFamilyTops();
    this.familyTopsToDisplay = this.familyTops.map((familyTop) => {
      const husband = this.peopleService.getPerson(familyTop.husband);
      const wife = this.peopleService.getPerson(familyTop.wife);
      const familyName = `${(husband?.surname || '').split(' ')[0]} ${
        (wife?.surname || '').split(' ')[0]
      } `;
      return { ...familyTop, familyName };
    });
    this.selectedTop = this.familyTops[0];
    this.subscribeToPersonSelection();
    this.onSearch();
  }

  subscribeToPersonSelection() {
    const newSelectedPersonId =
      this.route.firstChild?.snapshot?.paramMap?.get('id');
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
        const newSelectedPersonId = params?.get('id');
        this.onPersonSelected(newSelectedPersonId);
      });
    setTimeout(() => {
      this.onPersonSelected(newSelectedPersonId);
    }, 500);
  }

  onPersonSelected(newSelectedPersonId?: string): void {
    if (!newSelectedPersonId) {
      this.selectedPerson = null;
      return;
    }

    const selectedPersonCard = document.getElementById(
      `person-card-${newSelectedPersonId}`
    );
    const diagramCanvas = document.getElementById(`diagram-canvas`);
    if (!selectedPersonCard || !diagramCanvas) {
      return;
    }

    const offset = this.getElementOffset(selectedPersonCard, diagramCanvas);
    diagramCanvas.scroll({
      top: offset.top,
      left: offset.left,
      behavior: 'smooth',
    });

    this.selectedPerson = newSelectedPersonId;
  }

  onSearch(event = { query: '' }) {
    const queryStr = event.query || '';

    this.filteredPeople = this.people.reduce((parsedPeople, person) => {
      const parsedPerson = {
        id: person.id,
        fullname: this.titlecase.transform(
          `${person.name} ${person.surname}`.trim()
        ),
      };

      if (
        parsedPerson.fullname.toLowerCase().includes(queryStr.toLowerCase())
      ) {
        const familyTops = this.familyService.getPersonFamilyTops(person);
        familyTops.forEach((familyTop) => {
          const husband = this.peopleService.getPerson(familyTop.husband);
          const wife = this.peopleService.getPerson(familyTop.wife);
          const familyName = `${(husband?.surname || '').split(' ')[0]} ${
            (wife?.surname || '').split(' ')[0]
          } `;
          const personData = {
            ...parsedPerson,
            familyId: familyTop.id,
            familyName: this.titlecase.transform(familyName.trim()),
          };
          parsedPeople.push(personData);
        });
      }
      return parsedPeople;
    }, []);
  }

  onSelectPerson(event) {
    console.log(event);
  }

  private getElementOffset(
    element: HTMLElement,
    container: HTMLElement
  ): {
    top: number;
    left: number;
  } {
    const offset = {
      top: element?.offsetTop || 0,
      left: element?.offsetLeft || 0,
    };
    let parentElement = element?.offsetParent as HTMLElement;
    while (parentElement && parentElement.id !== container.id) {
      offset.top += parentElement.offsetTop;
      offset.left += parentElement.offsetLeft;
      parentElement = parentElement.offsetParent as HTMLElement;
    }

    // center element in container
    offset.top -= container.offsetHeight / 2 - element.offsetHeight;
    offset.left -= container.offsetWidth / 2 - element.offsetWidth;
    return offset;
  }
}
