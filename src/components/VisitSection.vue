<script setup>
const emit = defineEmits(['open-booking']);
</script>

<template>
  <section class="visit" id="visit"><div class="visit-image"><img src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=85" alt="温暖雅致的餐厅室内" /></div><div class="visit-copy"><p class="section-number">03 — VISIT US</p><h2>留一张桌，<br />等一阵风。</h2><div class="location-details"><p><b>上海市徐汇区</b><br />乌鲁木齐中路 218 号</p><p><b>午餐</b> 11:30 – 14:00<br /><b>晚餐</b> 17:30 – 22:00</p></div><button class="primary-button light" type="button" @click="emit('open-booking')">立即预约 <span>→</span></button></div></section>
</template>
