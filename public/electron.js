import { app, BrowserWindow } from 'electron';

import path from 'node:path';
import isDev from 'electron-is-dev';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      webSecurity: false
    }
  })

  const indexPath = path.join(__dirname, '../public/index.html');
  if (isDev) {
    win.loadURL('http://localhost:3000');
  } else {
    setTimeout(() => {
      win.loadURL(indexPath);
    }, 2000);
  }
  win.webContents.openDevTools()
};

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
});
