import { ipcRenderer, contextBridge } from 'electron';

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args));
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args;
    return ipcRenderer.off(channel, ...omit);
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args;
    return ipcRenderer.send(channel, ...omit);
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    return ipcRenderer.invoke(channel, ...omit);
  },
  once(...args: Parameters<typeof ipcRenderer.once>) {
    const [channel, listener] = args;
    return ipcRenderer.once(channel, (event, ...args) => listener(event, ...args));
  },
  // You can expose other APTs you need here.
  // ...
});
ipcRenderer.on('new-client', (e) => {
  console.log(e);
  // 接收到端口，使其全局可用。
  window.electronMessagePort = e.ports[0];

  window.electronMessagePort.onmessage = (messageEvent) => {
    console.log(messageEvent);
    console.log('hel2o');
    // 事件数据可以是任何可序列化的对象 (事件甚至可以
    // 携带其他 MessagePorts 对象!)
    // const result = doWork(event.data);
    window.electronMessagePort.postMessage('result2');
  };
});
ipcRenderer.on('provide-worker-channel', (e) => {
  console.log(e);
  // 接收到端口，使其全局可用。
  window.electronMessagePorts1 = e.ports[0];

  window.electronMessagePorts1.onmessage = (messageEvent) => {
    console.log('helo');

    console.log(messageEvent);
    // 事件数据可以是任何可序列化的对象 (事件甚至可以
    // 携带其他 MessagePorts 对象!)
    // const result = doWork(event.data);
    // window.electronMessagePort.postMessage(result);
  };

  window.electronMessagePorts1.postMessage('result');
});
