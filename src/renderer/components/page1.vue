<template>
  <div>
    <input v-model="serail" placeholder=""></input>
    <button @click="print">espos 串口打印666</button>
    <button @click="page2Default">page2打印页面,默认打印</button>
    <button @click="page2printShow">page2打印页面</button>
    <button @click="page3Default">page3打印页面,默认打印</button>
    <button @click="page3printShow">page3打印页面</button>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
export default {
  data() {
    return {
      logo: '',
      serail: '',
      pathLogo: ''
    }
  },
  created() {
    ipcRenderer.on('open-serial-cb', (event, res) => {
      if(res.code === -1) {
        alert(res.data)
      }
    })

  },
  methods: {
    print() {
      ipcRenderer.send('open-serial', {serail: this.serail})
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