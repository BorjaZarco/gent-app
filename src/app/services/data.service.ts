import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private electronService: ElectronService) {}

  public loadData<T>(dataName: string): Promise<Record<string, T>> {
    console.log(this.electronService);

    return this.electronService.ipcRenderer.invoke('loadData', dataName);
  }

  public storeData(dataName: string, data: any): Promise<boolean> {
    console.log(this.electronService);
    return this.electronService.ipcRenderer.invoke('storeData', dataName, data);
  }
}
