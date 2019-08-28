<template>
  <!-- <div>
    <img :src="logo" alt="" srcset="">
    <div>下载进度 {{isfinsh}}</div>
    <button @click="downTest">下载</button>
    <button @click="usbTap">usb</button>
    <button @click="page2Default">page2打印页面,默认打印</button>
    <button @click="page2printShow">page2打印页面</button>
    <button @click="page3Default">page3打印页面,默认打印</button>
    <button @click="page3printShow">page3打印页面</button>
    <div>
      <div 
        v-for="(item, index) in list" :key="index"
      >{{item}}</div>
    </div>
  </div>-->
  <div>
    <div>
      <div>
        <input v-model="port" placeholder="手动输入串口" type="text" />
        <input v-model="baudRate" placeholder="手动输入波特率" type="text" />
      </div>
      <div>
        <span>
          <span>串口号</span>
          <select @change="comChange">
            <option v-for="item in comList" :key="item.value" :value="item.value">{{item.text}}</option>
          </select>
        </span>
        <span>
          <span>波特率</span>
          <select @change="baudChange">
            <option v-for="item in baudRateList" :key="item.value" :value="item.value">{{item.text}}</option>
          </select>
        </span>
        <span>当前选中串口号{{port}}</span>
        <span>当前选中波特率{{baudRate}}</span>
      </div>
    </div>
    <div>串口是否已经打开：{{isOpen}}</div>
    <div>接收到串口返回数据为：{{baudData}}</div>
    <div>
      <button @click="openSerial">打开串口</button>
      <button @click="closeSerial">关闭串口</button>
      <button @click="openLight">开启照明灯</button>
      <button @click="closeLight">关闭照明灯</button>
      <button @click="clearData">清空数据</button>
    </div>
  </div>
</template>

<script>
import { ipcRenderer, ipcMain } from 'electron'
export default {
  data() {
    return {
      logo: '',
      serail: '',
      pathLogo: '',
      isfinsh: '',
      list: [],
      comList: [
        { text: 'COM1', value: 'COM1' },
        { text: 'COM2', value: 'COM2' },
        { text: 'COM3', value: 'COM3' },
        { text: 'COM4', value: 'COM4' },
        { text: 'COM5', value: 'COM5' },
        { text: 'COM6', value: 'COM6' },
        { text: 'COM7', value: 'COM7' },
        { text: 'COM8', value: 'COM8' },
        { text: 'COM9', value: 'COM9' },
        { text: 'COM10', value: 'COM10' },
        { text: 'COM11', value: 'COM11' }
      ],
      baudRateList: [
        { text: '4800', value: '4800' },
        { text: '9600', value: '9600' },
        { text: '19200', value: '19200' },
        { text: '38400', value: '38400' },
        { text: '57600', value: '57600' },
        { text: '115200', value: '115200' },
        { text: '128000', value: '128000' }
      ],
      port: 'COM1',
      baudRate: '4800',
      baudData: '',
      isOpen: false

    }
  },
  created() {
    ipcRenderer.on('serial-data-cb', (event, data) => {
      // alert('接收到数据了')
      this.baudData = data
    })
    ipcRenderer.on('serial-open-cb', (event, err) => {
      if (err) {
        this.isOpen = false
        alert(err)
      } else {
        this.isOpen = true
      }
    })
    ipcRenderer.on('serial-close-cb', (event, err) => {
      if (err) {
        alert(err)
      } else {
        this.isOpen = false
      }
    })
  },
  methods: {
    clearData() {
      this.baudData = ''
    },
    openSerial() {
      ipcRenderer.send('serial-open', {
        port: this.port,
        baudRate: +this.baudRate
      })
    },
    closeSerial() {
      ipcRenderer.send('serial-close')
    },
    openLight() {
      // if(!this.isOpen) return alert('请打开串口')
      ipcRenderer.send('serial-open-light')
      ipcRenderer.once('serial-open-light-cb', (event, err) => {
        if (err) {
          alert(err)
        } else {
          alert('打开照明灯数据写入成功')
        }
      })
    },
    closeLight() {
      // if(!this.isOpen) return alert('请打开串口')
      ipcRenderer.send('serial-close-light')
      ipcRenderer.once('serial-close-light-cb', (event, err) => {
        if (err) {
          alert(err)
        } else {
          alert('关闭照明灯数据写入成功')
        }
      })
    },
    comChange(e) {
      console.log(e.target.value)
      this.port = e.target.value
    },
    baudChange(e) {
      console.log(e.target.value)
      this.baudRate = e.target.value
    },
    down() {
      this.logo = 'static' + '/images/logo.png'
      ipcRenderer.on('open-serial-cb', (event, res) => {
        if (res.code === -1) {
          alert(res.data)
        }
      })
      ipcRenderer.on('progress', (event, res) => {
        this.isfinsh = '下载中----->' + res
      })
      ipcRenderer.on('finished', (event, res) => {
        this.isfinsh = '下载完成----->' + res
        this.downing = false
      })
    },
    usbTap() {
      ipcRenderer.send('get-usb-list')
      ipcRenderer.once('get-usb-list-cb', (event, list) => {
        this.list = list
      })
    },
    downTest() {
      ipcRenderer.send('copy-logo')
    },
    page2Default() {
      ipcRenderer.send('page2print-default')
    },
    page2printShow() {
      ipcRenderer.send('page2print-show')
    },
    page3Default() {
      ipcRenderer.send('page3print-default')
    },
    page3printShow() {
      ipcRenderer.send('page3print-show')
    }
  }
}
</script>

<style lang="stylus" scoped></style>