import { Injectable } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  constructor(private loader: NgxUiLoaderService) {}

  startLoader(loaderId?: string) {
    this.loader.start(loaderId);
  }

  stopLoader(loaderId?: string) {
    this.loader.stop(loaderId);
  }
}
