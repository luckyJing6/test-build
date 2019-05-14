<template>
  <div>
    <div>我是页面page2</div>
    <div v-for="item in 5" :key="item">我是{{item}}</div>
    <div class="image">
      <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1557813260635&di=399d5201bedb1501231f213f6f877658&imgtype=0&src=http%3A%2F%2Fimg.atobo.com%2FProductImg%2FEWM%2FUWeb%2F3%2F8%2F4%2F0%2F5355%2F38405355%2F1.gif" width="100" height="100">
    </div>
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

<style scoped>
</style>