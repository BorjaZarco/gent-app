import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FamilyService } from 'src/app/services/family.service';

@Component({
  selector: 'app-person-details',
  templateUrl: './person-details.component.html',
  styleUrls: ['./person-details.component.scss'],
})
export class PersonDetailsComponent implements OnInit, OnChanges {
  @Input('person') person;
  families: any[];

  constructor(private familyService: FamilyService) {}

  ngOnInit(): void {}

  ngOnChanges() {
    if (this.person) {
      this.families = this.familyService.getPersonFamily(
        this.person.id,
        this.person.sex
      );
      console.log(this.families);
    }
  }
}
