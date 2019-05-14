<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
const win = require('electron').remote.getCurrentWindow()
export default {
  data() {
    return {

    }
  },
  created() {
    let path = win.getTitle()
    this.$router.push(`/${path}`)
  }
}
</script>

<style scoped>
</style>