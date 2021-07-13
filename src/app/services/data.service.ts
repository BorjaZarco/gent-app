import { Injectable } from '@angular/core';
import { ipcRenderer } from 'electron';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private ipcRenderer: typeof ipcRenderer;

  constructor() {
    // Only available if running in electron
    if (this.isElectron()) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
    } else {
      // platform is web
    }
  }

  private isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  public loadData<T>(dataName: string): Promise<Record<string, T>> {
    return this.ipcRenderer.invoke('loadData', dataName);
  }

  public saveData(dataName: string, data: any): Promise<boolean> {
    return this.ipcRenderer.invoke('saveData', dataName, data);
  }
}
