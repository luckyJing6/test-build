<template>
  <div class="root">
    <div>我是页面page2</div>
    <div v-for="item in 5" :key="item">我是{{item}}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  }
}
</script>

<style>
body, html {
  margin: 0;
  padding: 0;
}
.root {
  width: 100vw;
  height: 100vh;
  background: red;
  overflow: hidden;
}
</style>