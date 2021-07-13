import { TitleCasePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxElectronModule } from 'ngx-electron';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { RippleModule } from 'primeng/ripple';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FamilyDiagramComponent } from './components/family-diagram/family-diagram.component';
import { PersonCardComponent } from './components/person-card/person-card.component';
import { PersonDetailsComponent } from './components/person-details/person-details.component';
import { DiagramDetailsComponent } from './pages/diagram/diagram-details/diagram-details.component';
import { DiagramComponent } from './pages/diagram/diagram.component';
import { ListComponent } from './pages/list/list.component';
import { ArrayObjectPipe } from './pipes/array-object.pipe';
import { HighlightPipe } from './pipes/highlight.pipe';
import { MomentPipe } from './pipes/moment.pipe';
import { ObjectPipe } from './pipes/object.pipe';
import { FamilyService } from './services/family.service';
import { PeopleService } from './services/people.service';

@NgModule({
  declarations: [
    AppComponent,
    PersonCardComponent,
    PersonDetailsComponent,
    FamilyDiagramComponent,
    DiagramComponent,
    ListComponent,
    MomentPipe,
    DiagramDetailsComponent,
    ObjectPipe,
    ArrayObjectPipe,
    HighlightPipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    NgxUiLoaderModule,
    AutoCompleteModule,
    ButtonModule,
    RippleModule,
    DropdownModule,
    NgxElectronModule,
  ],
  providers: [ObjectPipe, TitleCasePipe, PeopleService, FamilyService],
  bootstrap: [AppComponent],
})
export class AppModule {}
