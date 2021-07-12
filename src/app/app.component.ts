import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { FamilyService } from './services/family.service';
import { LoaderService } from './services/loader.service';
import { PeopleService } from './services/people.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private primengConfig: PrimeNGConfig,
    private loader: LoaderService,
    private peopleService: PeopleService,
    private familyService: FamilyService
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.loadData();
  }

  private loadData() {
    this.loader.startLoader();
    this.loader.stopLoader();
  }
}
