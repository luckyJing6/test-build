<template>
  <div>
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
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
export default {
  data() {
    return {
      logo: '',
      serail: '',
      pathLogo: '',
      isfinsh: '',
      list: []
    }
  },
  created() {
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
  methods: {
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