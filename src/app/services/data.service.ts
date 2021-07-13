import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private electronService: ElectronService) {}

  public loadData<T>(dataName: string): Promise<Record<string, T>> {
    return this.electronService.isElectronApp
      ? this.electronService.ipcRenderer.invoke('loadData', dataName)
      : JSON.parse(localStorage.getItem(dataName) || '');
  }

  public storeData(dataName: string, data: any): Promise<boolean> {
    if (this.electronService.isElectronApp) {
      return this.electronService.ipcRenderer.invoke(
        'storeData',
        dataName,
        data
      );
    } else {
      localStorage.setItem(dataName, JSON.stringify(data));
    }
  }
}
