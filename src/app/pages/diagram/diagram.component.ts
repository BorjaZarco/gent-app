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
    const offset = this.getElementOffset(selectedPersonCard, diagramCanvas);
    diagramCanvas.scroll({
      top: offset.top,
      left: offset.left,
      behavior: 'smooth',
    });

    this.selectedPerson = newSelectedPersonId;
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
    offset.top -= container.offsetHeight / 2 - element.offsetHeight / 2;
    offset.left -= container.offsetWidth / 2 - element.offsetWidth / 2;
    return offset;
  }
}
