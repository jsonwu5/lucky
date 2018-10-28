<template>
  <div id="app">
    <router-view/>
    <luck></luck>
  </div>
</template>

<script>
import Luck from '@/components/luck/luck'

export default {
  components: {
    Luck
  }
}
</script>

<style>

  * {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  html, body {
    padding: 0;
    margin: 0;
    font-size: 14px;
    font-family: "微软雅黑";
  }
</style>
