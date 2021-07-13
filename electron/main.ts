import { app, BrowserWindow, ipcMain } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
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

ipcMain.handle('loadData', async (event, fileName) => {
  const userDataPath = app.getPath('userData');
  const filePath = path.join(userDataPath, `${fileName}.json`);

  const data = fs.readFileSync(filePath, { encoding: 'utf-8' });
  return data.length > 0 ? JSON.parse(data) : null;
});

ipcMain.handle('storeData', async (event, fileName, data) => {
  const userDataPath = app.getPath('userData');
  const filePath = path.join(userDataPath, `${fileName}.json`);
  fs.writeFileSync(filePath, data);
  return true;
});
