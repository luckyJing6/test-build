import streamDownload from './streamDownload'
import application from '../application'
import { app, ipcMain } from 'electron'
const dbpath = app.getPath('desktop') + '/ewsdb'

ipcMain.on('down-test', (event, data) => {
  let time = new Date().getTime()
  console.log('---测下载---', time)
  // 下载apk
  streamDownload.downloadFile('http://192.168.1.229:8090/order/electron-order-jiulou-setup-0.1.7.exe', dbpath, (arg, percentage) => {
    if (arg === 'progress') {
      console.log('下载中------>', percentage)
      application.mianWindow.webContents.send('progress', percentage)
    }
    if (arg === 'finished') {
      console.log('下载完成##########>', percentage)
      application.mianWindow.webContents.send('finished', percentage)
    }
  }, `${time}.exe`)
})