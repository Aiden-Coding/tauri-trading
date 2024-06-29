const doWork = (input) => {
  // 一些对CPU要求较高的任务
  return input * 2;
};

// 我们可能会得到多个 clients, 比如有多个 windows,
// 或者假如 main window 重新加载了.
console.log(window.ipcRenderer);
