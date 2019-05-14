import { BrowserWindow, ipcMain, app } from 'electron'
var viceWin = null
export default function initWindow(url, mainWin) {
  ipcMain.on('open-vice-win', (event) => {
    console.log('副屏窗口', viceWin)
    if (viceWin) {
      return event.sender.send('open-vice-win-cb', { code: 1, msg: '副屏窗口已经打开' })
    }
    viceWin = new BrowserWindow({
      height: 512,
      useContentSize: true,
      title: 'page2',
      parent: mainWin,
      width: 320
    })
    viceWin.loadURL(url)
    viceWin.on('closed', () => {
      viceWin = null
    })
  })
  ipcMain.on('page2print-default', (event, deviceName) => {
    const printers = viceWin.webContents.getPrinters();
    printers.forEach(element => {
      if (element.name === deviceName) {
        console.log(element);
      }
      if (element.name === deviceName && element.status != 0) {
        viceWin.send('print-error', deviceName + '打印机异常');
        return;
      }
    });
    viceWin.webContents.print({ silent: true, printBackground: true, deviceName: deviceName },
      (data) => {
        console.log("回调", data);
        event.sender.send('print-successs')
      })
  })

  ipcMain.on('page2print-show', (event, deviceName) => {
    const printers = viceWin.webContents.getPrinters();
    printers.forEach(element => {
      if (element.name === deviceName) {
        console.log(element);
      }
      if (element.name === deviceName && element.status != 0) {
        viceWin.send('print-error', deviceName + '打印机异常');
        return;
      }
    });
    viceWin.webContents.print({ silent: false, printBackground: true, deviceName: deviceName },
      (data) => {
        console.log("回调", data);
        event.sender.send('print-successs')
      })
  })
}