import { app, BrowserWindow, ipcMain } from 'electron'
import application from './application'
import viceWindowInit from './win2' // 副屏
import viceWin3Init from './win3' // 副屏
import Serial from './model/serial'
// require('./escpos')
require('./serial')
require('./db')

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

// 单开程序
// const gotTheLock = app.requestSingleInstanceLock()

// if (!gotTheLock) {
//   app.quit()
// } else {
//   app.on('second-instance', (event, commandLine, workingDirectory) => {
//     // 当运行第二个实例时,将会聚焦到myWindow这个窗口
//     if (mainWindow) {
//       if (mainWindow.isMinimized()) mainWindow.restore()
//       mainWindow.focus()
//     }
//   })
// }
// end
let serial = null
function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    title: 'page1',
    width: 1000
  })

  mainWindow.loadURL(winURL)
  application.mianWindow = mainWindow

  mainWindow.on('closed', () => {
    mainWindow = null
  })
  require('./usb')
  require('./download/apk')
  require('./download/logo')
  // 副屏
  viceWindowInit(winURL, mainWindow)
  viceWin3Init(winURL, mainWindow)

  ipcMain.on('do', (event, deviceName) => {
    const printers = mainWindow.webContents.getPrinters();
    printers.forEach(element => {
      if (element.name === deviceName) {
        console.log(element);
      }
      if (element.name === deviceName && element.status != 0) {
        mainWindow.send('print-error', deviceName + '打印机异常');
        return;
      }
    });
    mainWindow.webContents.print({ silent: true, printBackground: true, deviceName: deviceName },
      (data) => {
        console.log("回调", data);
        event.sender.send('print-successs')
      })
  })

  ipcMain.on('do2', (event, deviceName) => {
    const printers = mainWindow.webContents.getPrinters();
    printers.forEach(element => {
      if (element.name === deviceName) {
        console.log(element);
      }
      if (element.name === deviceName && element.status != 0) {
        mainWindow.send('print-error', deviceName + '打印机异常');
        return;
      }
    });
    mainWindow.webContents.print({ silent: false, printBackground: true, deviceName: deviceName },
      (data) => {
        console.log("回调", data);
        event.sender.send('print-successs')
      })
  })
  var buf = Buffer.alloc(0)
  // 打开串口
  ipcMain.on('serial-open', (event, data) => {
    serial = new Serial(data.port, +data.baudRate)
    serial.open(err => {
      event.sender.send('serial-open-cb', err)
      if (!err) {
        console.log('serial open ok')
        serial.onData(data => {
          const totalLength = data.length + buf.length;
          buf = Buffer.concat([buf, data], totalLength)
          console.log(buf)
          event.sender.send('serial-data-cb', buf)
        })
      }
    })
  })
  // close
  ipcMain.on('serial-close', (event, data) => {
    serial.close(err => {
      event.sender.send('serial-close-cb', err)
      if (err) {
        return console.log(err)
      }
      console.log('关闭串口')
    })
  })
  // 打开灯
  ipcMain.on('serial-open-light', () => {
    var data = Buffer.from('164D0D53434E4C4544312E', 'hex')
    serial.write(data, err => {
      event.sender.send('serial-open-light-cb', err)
      if (err) {
        return console.log(err)
      }
      console.log('open light write ok')
    })
  })
  // 关闭灯
  ipcMain.on('serial-close-light', () => {
    var data = Buffer.from('164D0D53434E4C4544302E', 'hex')
    serial.write(data, err => {
      event.sender.send('serial-close-light-cb', err)
      if (err) {
        return console.log(err)
      }
      console.log('close light write ok')
    })
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
