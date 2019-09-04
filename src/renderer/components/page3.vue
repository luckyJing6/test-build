<template>
  <div class="page3">
    <div>我是页面page3</div>
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
.page3 {
  width: 100%;
  height: 100vh;
  background: blue;
  overflow: hidden;
}
</style>