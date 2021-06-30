import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PersonCardComponent } from './components/person-card/person-card.component';
import { PersonDetailsComponent } from './components/person-details/person-details.component';

@NgModule({
  declarations: [AppComponent, PersonCardComponent, PersonDetailsComponent],
  imports: [BrowserModule, AppRoutingModule, AutoCompleteModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
