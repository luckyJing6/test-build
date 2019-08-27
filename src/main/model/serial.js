const SerialPort = require('serialport')
const EventEmitter = require('events')
class Serial {
  constructor(port, baudRate, dataCb, closeCb) {
    if (process.platform !== 'win32') {
      port = `/dev/ttyS${+port[3] - 1}`
    }
    this.port = port
    this.options = {
      baudRate: baudRate,
      autoOpen: false
    }
    this.dataCb = dataCb
    this.closeCb = closeCb
    this.device = null
    this.init()

  }
  init() {
    let self = this
    this.device = new SerialPort(this.port, this.options);
    this.device.on('close', function () {
      self.closeCb && self.closeCb()
      self.emit('disconnect', self.device);
      self.device = null;
    });
    this.device.on('data', function(data) {
      self.dataCb && self.dataCb(data)
      self.emit('data', data);
      console.log('接收串口返回数据')
    })
    EventEmitter.call(this);
    console.log('初始化串口', this.device)
    return this
  }
  open(cb) {
    console.log('打开串口', this.port, this.options)
    this.device.open(cb);
    return this;
  }
  write(data, callback) {
    this.device.write(data, callback);
    return this;
  }
  close(callback, timeout) {
    var self = this;

    this.device.drain(function () {

      self.device.flush(function (err) {

        setTimeout(function () {

          err ? callback && callback(err, self.device) : self.device.close(function (err) {
            self.device = null;
            return callback && callback(err, self.device);
          });

        }, "number" === typeof timeout && 0 < timeout ? timeout : 0);
      });
    });
    return this;
  }
}

export default Serial