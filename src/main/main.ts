/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { spawn } from 'child_process';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

/**
 * Custom code
 */
app
  .whenReady()
  .then(() => {
    createWindow();

    // IPC handler for getting directory path
    ipcMain.handle('get-directory-path', async () => {
      const result = await dialog.showOpenDialog(mainWindow as BrowserWindow, {
        properties: ['openDirectory'],
      });
      return result;
    });

    let childProcess: any;

    ipcMain.handle('start-anvil', async (event, directoryPath) => {
      childProcess = spawn('anvil', [], {
        cwd: directoryPath,
      });

      childProcess.on('error', (err: any) => {
        console.error(`Failed to start child process: ${err}`);
      });
      childProcess.stdout.on('data', (data: Buffer) => {
        console.log(`stdout: ${data}`);
      });
      childProcess.stdout.on('data', (data: Buffer) => {
        if (mainWindow) {
          mainWindow.webContents.send('anvil-data', data);
        }
      });

      childProcess.stderr.on('data', (data: Buffer) => {
        console.error(`stderr: ${data}`);
      });
      childProcess.on('close', () => {
        console.log(`### ANVIL KILLED ###`);
      });
    });

    ipcMain.handle('kill-anvil', async () => {
      if (childProcess && !childProcess.killed) {
        try {
          childProcess.kill('SIGINT');
        } catch (err) {
          console.error(`Failed to kill process ${childProcess.pid}: ${err}`);
        }
      } else {
        console.log(
          `Process ${
            childProcess ? childProcess.pid : 'N/A'
          } either doesn't exist or has already exited`
        );
      }
    });

    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

// forge create src/Counter.sol:Counter --unlocked --from 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
