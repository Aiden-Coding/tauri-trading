import { app, BrowserWindow, ipcMain, MessageChannelMain } from 'electron';
// import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import { ChildProcess } from 'node:child_process';
import child_process from 'node:child_process';

const windows: BrowserWindow[] = [];
// const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..');

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST;

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

let win: BrowserWindow | null;
let workerProcess: ChildProcess | null;
function createWindow() {
  // Renderer 3
  const worker = new BrowserWindow({
    // show: false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.mjs'),
    },
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    worker.loadURL('http://localhost:5174/html/node-false.html');
    worker.webContents.openDevTools();
  } else {
    worker.loadFile(path.join(__dirname, '../dist/html/node-false.html'));
  }
  windows.push(worker);
  win = new BrowserWindow({
    width: 1000,
    // resizable: true,
    // transparent: true,
    // fullscreenable: true,
    // frame: false,
    height: 800,
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: 'rgba(0,0,0,0)',
      height: 35,
      symbolColor: 'white',
    },
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  });

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'));
  }

  workerProcess = child_process.exec(
    'start /b C:\\Users\\Administrator\\.jdks\\openjdk-21.0.1\\bin\\java.exe -jar trading-life-java.jar',
    function (error, stdout, stderr) {
      if (error) {
        console.log('error');
        console.log(error.stack);
        console.log('Error code: ' + error.code);
        console.log('Signal received: ' + error.signal);
      }

      console.log('stdout');
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
    },
  );

  workerProcess.on('exit', function (code) {
    console.log('child_process');
    console.log('child_process exit ');
    console.log('child_process exit ' + code);
    console.log('child_process exit ');
  });
  console.log(workerProcess.pid);
  // 在这里我们不能使用 ipcMain.handle() , 因为回复需要传输
  // MessagePort.
  // 监听从顶级 frame 发来的消息
  win.webContents.mainFrame.ipc.on('request-worker-channel', (event) => {
    console.log(event);
    // 建立新通道  ...
    const { port1, port2 } = new MessageChannelMain();
    console.log(port1);
    console.log(port2);
    // ... 将其中一个端口发送给 Worker ...
    worker.webContents.postMessage('new-client', null, [port1]);
    // ... 将另一个端口发送给主窗口
    event.senderFrame.postMessage('provide-worker-channel', null, [port2]);
    // 现在主窗口和工作进程可以直接相互通信，无需经过主进程！
  });
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (workerProcess) {
      let result = workerProcess.kill();

      console.log('result');
      console.log(result);
    }
    app.quit();
    win = null;
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
ipcMain.handle('app_platform', () => {
  return process.platform;
});
app.whenReady().then(createWindow);
