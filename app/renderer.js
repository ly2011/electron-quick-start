// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// 引入ipcRenderer对象
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;
// 设置监听
ipcRenderer.on('main-process-messages', (event, message) => {
  console.log(`message from Main Process: ${message}`);
});

// 向主线程发送信息
ipcRenderer.send('render-process-messages', 'Hello Main Messages');

console.log(ipcRenderer.sendSync('synchronous-message', 'ping'));
ipcRenderer.on('asynchronous-reply', (event, arg) => {
  console.log(arg); // 输出`pong`
});
ipcRenderer.send('asynchronous-message', 'ping');
