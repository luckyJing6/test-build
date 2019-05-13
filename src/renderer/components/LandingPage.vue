<template>
  <div>
    <div>哈哈哈</div>
    <button @click="pTap" class="btn">测试打印1</button>
    <button @click="pTap2" class="btn">测试打印2</button>

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
    ipcRenderer.on('print-error', (e, d) => {
      alert('error')
    })
    ipcRenderer.on('print-successs', (e, d) => {
      alert('successs')
    })
  },
  methods: {
    pTap() {
      ipcRenderer.send('do')
    },
    pTap2() {
      ipcRenderer.send('do2')
    }
  }
}
</script>

<style scoped>
.btn {
  width: 200px;
  height: 30px;
}
</style>