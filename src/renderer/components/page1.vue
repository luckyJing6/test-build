<template>
  <div>
    我是主页面page1
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

    }
  },
  created() {
    ipcRenderer.send('open-vice-win')
    ipcRenderer.send('open-vice-win3')
  },
  methods: {
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