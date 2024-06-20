import { app, BrowserWindow, ipcMain, screen } from 'electron';
// import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import { ChildProcess } from 'node:child_process';
import child_process from 'node:child_process';

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

let win: BrowserWindow | null;
let workerProcess: ChildProcess | null;
function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    resizable: true,
    transparent: true,
    fullscreenable: true,
    // frame: false,
    height: 800,
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
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
  /** 窗口移动功能封装 */
  // 窗口移动 位置刷新定时器
  let movingInterval: NodeJS.Timeout | null;
  /**
   * 窗口移动事件
   */
  ipcMain.on('window-move-open', (event, canMoving) => {
    // 获取当前鼠标聚焦的窗口
    const currentWindow = BrowserWindow.getFocusedWindow();

    if (currentWindow) {
      const currentWindowSize = currentWindow.getSize();
      if (canMoving) {
        // 读取原位置
        const winPosition = currentWindow.getPosition();
        let winStartPosition = screen.getCursorScreenPoint();
        // 清除旧的定时器
        if (movingInterval) {
          clearInterval(movingInterval);
        }
        // 创建定时器，每10毫秒更新一次窗口位置，保证一致
        movingInterval = setInterval(() => {
          // 窗口销毁判断，高频率的更新有可能窗口已销毁，定时器还没结束，此时就会出现执行销毁窗口方法的错误
          if (!currentWindow.isDestroyed()) {
            // 如果窗口失去焦点，则停止移动
            if (!currentWindow.isFocused()) {
              if (movingInterval) clearInterval(movingInterval);
              movingInterval = null;
            }
            // 实时更新位置
            const cursorPosition = screen.getCursorScreenPoint();
            const x = cursorPosition.x - winStartPosition.x + winPosition[0];
            const y = cursorPosition.y - winStartPosition.y + winPosition[1];
            // 更新位置的同时设置窗口原大小， windows上设置=>显示设置=>文本缩放 不是100%时，窗口会拖拽放大
            currentWindow.setBounds({
              x: x,
              y: y,
              width: currentWindowSize[0],
              height: currentWindowSize[1],
            });
          } else {
            if (movingInterval) clearInterval(movingInterval);
            movingInterval = null;
          }
        }, 10);
      } else {
        if (movingInterval) clearInterval(movingInterval);
        movingInterval = null;
      }
    }
  });
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

app.whenReady().then(createWindow);
