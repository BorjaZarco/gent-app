import { app, BrowserWindow, ipcMain } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    autoHideMenuBar: true,

    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      backgroundThrottling: false,
      enableRemoteModule: true,
      contextIsolation: false,
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
  try {
    const userDataPath = app.getPath('userData');
    const filePath = path.join(userDataPath, `${fileName}.json`);
    const data = fs.readFileSync(filePath, { encoding: 'utf-8' });
    return data.length > 0 ? JSON.parse(data) : null;
  } catch (error) {
    console.error(error);
    return null;
  }
});

ipcMain.handle('storeData', async (event, fileName, data) => {
  try {
    const userDataPath = app.getPath('userData');
    const filePath = path.join(userDataPath, `${fileName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
});
