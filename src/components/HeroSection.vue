<script setup>
const emit = defineEmits(['open-booking']);
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero-copy"><p class="eyebrow"><span></span> SEASONAL CHINESE KITCHEN</p><h1 id="hero-title">把四季<br />端上餐桌</h1><p class="hero-text">循着时令寻味，以本地食材慢火烹饪。<br />每一餐，都是一段自然发生的相遇。</p><div class="hero-actions"><button class="primary-button" type="button" @click="emit('open-booking')">预订一席 <span>→</span></button><a class="text-link" href="#menu">探索本季菜单 <span>↓</span></a></div></div>
    <div class="hero-image-wrap"><img class="hero-image" src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85" alt="一桌精致的当季蔬食料理" /><div class="image-caption"><span>09 / 2026</span><b>秋日食记</b></div><div class="season-stamp">秋<br /><i>季</i><br />限定</div></div>
    <p class="hero-side-note">SHANGHAI · WULUMUQI ROAD</p>
  </section>
</template>
