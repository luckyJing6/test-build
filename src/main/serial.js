import { ipcMain } from "electron"
const escpos = require('escpos')
ipcMain.on('open-serial', (event, data) => {
  console.log('----串口号----', data.serail)
  const device = new escpos.Serial(data.serail);
  const printer = new escpos.Printer(device);
  event.sender.send('open-serial-cb', { code: -1, data: '收到串口号:' + data.serail })
  device.open(err => {
    if (err) {
      console.error(`${vid}-${pid}USB打印机连接失败open`, err)
      event.sender.send('open-serial-cb', { code: -1, data: '串口打开失败:' + JSON.stringify(err) })
    } else {
      // 串口打开成功
      printer
        .feed(1)
        .style('B')
        .size('2', '2')
        .align('ct')
        .text('测试打印成功')
        .style('I')
        .size('1', '1')
        .control('lf') // 换行
        .control('lf')
        .cut() // 截断
        .flush() // 发送
        .close()
    }
  })
})