import { TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { of } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { FamilyService } from 'src/app/services/family.service';
import { LoaderService } from 'src/app/services/loader.service';
import { PeopleService } from 'src/app/services/people.service';
import { Family } from 'src/app/types/definitions/family';
import { Person } from 'src/app/types/definitions/person';

const ALLOWED_FILES = ['ged'];

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.scss'],
})
export class DiagramComponent implements OnInit {
  people: Person[] = [];
  filteredPeople: {
    id: string;
    fullname: string;
    splittedFullName?: string[];
    familyId: string;
    familyName: string;
  }[] = [];
  families: Family[] = [];
  familyTops: Family[] = [];

  selectedPersonId = null;
  selectedTop: Family;
  displayPersonData: boolean;
  familyTopsToDisplay: (Family & { familyName: string })[];

  query: string;

  constructor(
    private peopleService: PeopleService,
    private familyService: FamilyService,
    private route: ActivatedRoute,
    private titlecase: TitleCasePipe,
    private router: Router,
    private loader: LoaderService
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
      if (newSelectedPersonId) {
        this.onPersonSelected(newSelectedPersonId);
      } else if (this.selectedTop) {
        const selectedPersonCard = document.getElementById(
          `person-card-${this.selectedTop.husband}`
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
      }
    }, 500);
  }

  onPersonSelected(newSelectedPersonId?: string): void {
    if (!newSelectedPersonId) {
      this.selectedPersonId = null;
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

    this.selectedPersonId = newSelectedPersonId;
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

  onClearSearch() {
    this.query = '';
  }

  onSelectPerson(selection: {
    fullname: string;
    id: string;
    familyId: string;
    familyName: string;
  }) {
    if (selection.familyId !== this.selectedTop.id) {
      this.selectedTop = this.familyService.getFamily(selection.familyId);
      if (this.selectedPersonId === selection.id) {
        setTimeout(() => {
          this.onPersonSelected(this.selectedPersonId);
        }, 500);
      } else {
        setTimeout(() => {
          this.router.navigate(['./', selection.id], {
            relativeTo: this.route,
          });
        }, 500);
      }
      return;
    }

    this.router.navigate(['./', selection.id], { relativeTo: this.route });
  }

  onSelectFile() {
    const fileInput = document.getElementById('file-input');
    fileInput.click();
  }

  async onFileSelected(event: FileList | Event) {
    try {
      this.loader.startLoader();
      const file = ((event as Event)?.target as HTMLInputElement)?.files?.item(
        0
      );
      if (!file) {
        return;
      }
      const fileExtension = (file.name || '').split('.').slice(-1)[0];
      if (
        fileExtension &&
        !ALLOWED_FILES.some((fileType) => fileExtension === fileType)
      ) {
        console.error('No es un archivo válido!');
        return;
      }

      const content = await this.readGedFile(file);
      this.familyService.loadFamiliesFromFile(content);
      this.peopleService.loadPeopleFromFile(content);
      ((event as Event).target as HTMLInputElement).value = '';

      this.ngOnInit();
    } catch (error) {
      console.error(error);
    } finally {
      this.loader.stopLoader();
    }
  }

  private readGedFile(file: File) {
    return new Promise<string>((resolve, reject) => {
      if (!file) {
        resolve('');
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        const rawText = reader.result.toString();
        const text = rawText.replace(/\r/g, '');
        resolve(text);
      };

      reader.readAsText(file);
    });
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
