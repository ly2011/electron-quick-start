const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const dialog = electron.dialog;
const ipcMain = electron.ipcMain;

global.appSettings = require('config');

// Manage unhandled exceptions as early as possible
process.on('uncaughtException', e => {
  console.error(`Caught unhandled exception: ${e}`);
  dialog.showErrorBox(
    'Caught unhandled exception',
    e.message || 'Unknown error message'
  );
  app.quit();
});
require('electron-debug')({ showDevTools: true });

const path = require('path');
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  console.log('createWindow');
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    title: app.getName()
  });

  // and load the index.html of the app.
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    })
  );

  // 同渲染进程通讯
  ipcMain.on('asynchronous-message', (event, arg) => {
    console.log(arg); //输出`ping`
    event.sender.send('asynchronous-reply', 'pong');
  });
  ipcMain.on('synchronous-message', (event, arg) => {
    console.log(arg); //输出`ping`
    event.returnValue = 'pong';
  });

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    console.log('closed');
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
  mainWindow.on('unresponsive', () => {
    console.warn('The windows is not responding');
  });
  mainWindow.on('ready-to-show', () => {
    console.log('ready-to-show');
    mainWindow.show();
    mainWindow.focus();
  });

  // 当页面加载完成时,会触发`did-finish-load`事件
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('did-finish-load');
    mainWindow.webContents.send(
      'main-process-messages',
      'webContents event "did-finish-load" called'
    );
  });

  mainWindow.webContents.on('crashed', () => {
    console.error('The browser window has just crashed');
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  console.log('window-all-closed');
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  console.log('activate');
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
