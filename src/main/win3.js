import { BrowserWindow, ipcMain, app } from 'electron'
var viceWin3 = null
export default function initWindow(url, mainWin) {
  ipcMain.on('open-vice-win3', (event) => {
    console.log('副屏窗口', viceWin3)
    if (viceWin3) {
      return event.sender.send('open-vice-win-cb', { code: 1, msg: '副屏窗口已经打开' })
    }
    viceWin3 = new BrowserWindow({
      height: 512,
      useContentSize: true,
      title: 'page3',
      parent: mainWin,
      width: 320,
      opacity: 0,
      transparent: true
    })
    viceWin3.loadURL(url)
    viceWin3.on('closed', () => {
      viceWin3 = null
    })
  })
  ipcMain.on('page3print-default', (event, deviceName) => {
    const printers = viceWin3.webContents.getPrinters();
    printers.forEach(element => {
      if (element.name === deviceName) {
        console.log(element);
      }
      if (element.name === deviceName && element.status != 0) {
        viceWin3.send('print-error', deviceName + '打印机异常');
        return;
      }
    });
    viceWin3.webContents.print({ silent: true, printBackground: true, deviceName: deviceName },
      (data) => {
        console.log("回调", data);
        event.sender.send('print-successs')
      })
  })

  ipcMain.on('page3print-show', (event, deviceName) => {
    const printers = viceWin3.webContents.getPrinters();
    printers.forEach(element => {
      if (element.name === deviceName) {
        console.log(element);
      }
      if (element.name === deviceName && element.status != 0) {
        viceWin3.send('print-error', deviceName + '打印机异常');
        return;
      }
    });
    viceWin3.webContents.print({ silent: false, printBackground: true, deviceName: deviceName },
      (data) => {
        console.log("回调", data);
        event.sender.send('print-successs')
      })
  })
}