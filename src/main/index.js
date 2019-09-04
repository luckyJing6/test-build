import { app, BrowserWindow, ipcMain } from 'electron'
import application from './application'
import viceWindowInit from './win2' // 副屏
import viceWin3Init from './win3' // 副屏
import Serial from './model/serial'
import AppUpdate from './model/app-update'
const fs = require('fs')
// require('./escpos')
require('./serial')
require('./db')
const zippath = app.getPath('desktop') + '/zippath/'
const testPath = app.getPath('desktop') + '/ewsdb/test.json'
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
  const option = JSON.parse(fs.readFileSync(testPath))
  console.log('test.json', option)
  mainWindow = new BrowserWindow(option)

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

  ipcMain.on('close', (event) => {
    app.quit()
  })

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
          let str = buf.toString('hex')
          // buf.toString()
          event.sender.send('serial-data-cb', str)
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
  ipcMain.on('serial-open-light', (event) => {
    buf = Buffer.alloc(0)
    console.log('open light', new Date())
    var data = Buffer.from('164D0D53434E4C4544312E', 'hex')
    serial.write(data, err => {
      event.sender.send('serial-open-light-cb', err)
      if (err) {
        return console.log(err)
      }
      console.log('open light write ok', new Date())
    })
  })
  // 关闭灯
  ipcMain.on('serial-close-light', (event) => {
    buf = Buffer.alloc(0)
    console.log('close light', new Date())
    var data = Buffer.from('164D0D5041505053542E164D0D53434E4C4544302E', 'hex')
    serial.write(data, err => {
      event.sender.send('serial-close-light-cb', err)
      if (err) {
        return console.log(err)
      }
      console.log('close light write ok')
    })
  })
  // 发送指定数据
  ipcMain.on('serail-write-data', (event, data) => {
    data = data.replace(/\s*/g, "")
    buf = Buffer.alloc(0)
    var str = Buffer.from(data, 'hex')
    serial.write(str, err => {
      event.sender.send('serail-write-data-cb', err)
      if (err) {
        return console.log(err)
      }
      console.log('close light write ok')
    })
  })

  ipcMain.on('run-cmd', async (event, data) => {
    try {
      await AppUpdate.install(data)
      event.sender.send('run-cmd-cb')
    } catch (error) {
      event.sender.send('run-cmd-cb', error)
    }
  })
  // 获取路径
  ipcMain.on('get-path', (event, data) => {
    event.sender.send('get-path-cb', zippath)
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
