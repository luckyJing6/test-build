import fs from 'fs'
import path from 'path'
import { app, ipcMain } from 'electron'
const dbpath = app.getPath('desktop') + '/ewsdb/images'
const logoPath = path.join(__static, '/images/logo.png')

ipcMain.on('copy-logo', (event, data) => {
  let time = new Date().getTime()
  fs.copyFile(logoPath, `${dbpath}/${time}.png`, (err) => {
    if (err) {
      console.log('复制失败', err)
    } else {
      console.log('成功')
    }
  })
})