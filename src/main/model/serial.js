const SerialPort = require('serialport');

class Serial {
  constructor(port, bouteRoute) {
    // 判断当前环境是否为window
    if (process.platform !== 'win32') {
      port = `/dev/ttyS${+port[3] - 1}`
    }
    this.port = port
    this.bouteRoute = bouteRoute
    this.device = null
  }
  // 打开串口
  open(cb) {
    this.device = new SerialPort(this.port, {
      baudRate: this.bouteRoute
    }, err => {
        if(err) {
            err = err + ''
            console.log('串口打开失败', err)
        }
        cb && cb(err)
    });
  }
  // 关闭串口
  close(cb) {
    if(!this.device.isOpen) {
      return cb && cb(new Error('serail is not open') + '')
    }
    this.device.close(() => {
      cb && cb()
    })
  }
  // 发送数据
  write(data, cb) {
    if(!this.device.isOpen) {
      return cb && cb(new Error('serail is not open') + '')
    }
    this.device.write(data, () => {
      // console.log('写入完毕')
      cb && cb()
    })
  }
  onData(cb) {
    this.device.on( "data", function( data ) {
      cb && cb(data)
    });
  }
}

export default Serial