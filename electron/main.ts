import { app, BrowserWindow } from 'electron';
import * as path from 'path';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
  });
  console.log(__dirname);

  mainWindow.loadURL(
    `file://${path.join(__dirname, '../../dist/gent/index.html')}`
  );
  mainWindow.on('closed', () => (mainWindow = null));
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
