import { app, BrowserWindow, ipcMain, screen } from 'electron';
// import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url';
import path from 'node:path';

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

function createWindow() {
  win = new BrowserWindow({
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
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'));
  }
  /** 窗口移动功能封装 */
  // 窗口移动 位置刷新定时器
  let movingInterval = null;

  /**
   * 窗口移动事件
   */
  ipcMain.on('window-move-open', (event, canMoving) => {
    let winStartPosition = { x: 0, y: 0 };
    let mouseStartPosition = { x: 0, y: 0 };
    const currentWindow = getWindowByEvent(event);

    const currentWindowSize = currentWindow.getSize();

    if (currentWindow) {
      if (canMoving) {
        // 读取原位置
        const winPosition = currentWindow.getPosition();
        winStartPosition = { x: winPosition[0], y: winPosition[1] };
        // 获取当前鼠标聚焦的窗口
        mouseStartPosition = BrowserWindow.getFocusedWindow();
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
              clearInterval(movingInterval);
              movingInterval = null;
            }
            // 实时更新位置
            const cursorPosition = screen.getCursorScreenPoint();
            const x = winStartPosition.x + cursorPosition.x - mouseStartPosition.x;
            const y = winStartPosition.y + cursorPosition.y - mouseStartPosition.y;
            // 更新位置的同时设置窗口原大小， windows上设置=>显示设置=>文本缩放 不是100%时，窗口会拖拽放大
            currentWindow.setBounds({
              x: x,
              y: y,
              width: currentWindowSize[0],
              height: currentWindowSize[1],
            });
          }
        }, 10);
      } else {
        clearInterval(movingInterval);
        movingInterval = null;
      }
    }
  });
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
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
