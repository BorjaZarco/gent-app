import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PeopleService } from 'src/app/services/people.service';
import { Person } from 'src/app/types/definitions/person';

@Component({
  selector: 'app-diagram-details',
  templateUrl: './diagram-details.component.html',
  styleUrls: ['./diagram-details.component.scss'],
})
export class DiagramDetailsComponent implements OnInit {
  personId: string;
  person: Person;

  constructor(
    private route: ActivatedRoute,
    private peopleService: PeopleService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((param) => {
      this.personId = param.get('id');
      this.person = this.peopleService.getPerson(this.personId);
    });
  }
}
