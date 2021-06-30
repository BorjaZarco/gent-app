import { Component, OnInit } from '@angular/core';
import { PeopleService } from './services/people.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  people: any[] = [];

  selectedPerson = null;

  constructor(private peopleService: PeopleService) {}

  ngOnInit() {
    this.people = this.peopleService.getPeople();
  }

  onSelectPerson(selectedPerson: any) {
    if (this.selectedPerson?.id === selectedPerson?.id) {
      this.selectedPerson = null;
    } else {
      this.selectedPerson = selectedPerson;
    }
    console.log(this.selectedPerson);
  }
}
