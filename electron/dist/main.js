"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = require("path");
var mainWindow;
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        autoHideMenuBar: true,
    });
    console.log(__dirname);
    mainWindow.loadURL("file://" + path.join(__dirname, '../../dist/gent/index.html'));
    mainWindow.on('closed', function () { return (mainWindow = null); });
    mainWindow.once('ready-to-show', function () {
        mainWindow.show();
    });
}
electron_1.app.on('ready', createWindow);
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});
//# sourceMappingURL=main.js.map