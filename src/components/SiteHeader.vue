<script setup>
const emit = defineEmits(['open-booking']);
</script>

<template>
  <header class="site-header" id="home">
    <a class="brand" href="#home" aria-label="松风食堂首页"><span class="brand-mark">松</span><span>松风食堂<small>SONGFENG TABLE</small></span></a>
    <nav aria-label="主导航"><a href="#story">关于我们</a><a href="#menu">当季菜单</a><a href="#visit">到店用餐</a></nav>
    <button class="header-book" type="button" @click="emit('open-booking')">预约座位 <span>↗</span></button>
  </header>
</template>
