import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import AOS from 'aos';
import * as moment from 'moment';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

AOS.init();
moment.locale('es');
if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
