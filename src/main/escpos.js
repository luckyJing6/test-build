import { ipcMain } from "electron";
import { app } from 'electron'
const escpos = require('escpos')
// 测试打印
let device = new escpos.Network('192.168.2.155', '9100')
let printer = new escpos.Printer(device)
console.log(logoImage)

export function textPrinter() {
  device.open(err => {
    if (err) {
      console.error(`网口打印机连接失败open`, err)
    } else {
      escpos.Image.load(logoImage, function (image) {
        printer
          .align('ct')
          .style('I')
          .raster(image, 'dwdh')
        printer
          .feed(1)
          .style('B')
          .size('2', '2')
          .align('ct')
          .text('测试打印成功')
          .style('I')
          .size('1', '1')
        printer
          .qrimage('http://www.vuecli.com', function (err) {
            printer
              .control('lf') // 换行
              .control('lf')
              .cut() // 截断
              .flush() // 发送
          });
      })
    }
  })
}

ipcMain.on('test-print', (event) => {
  textPrinter()
})