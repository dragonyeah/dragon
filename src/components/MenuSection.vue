<script setup>
import { dishes } from '../data/restaurant';
</script>

<template>
  <section class="menu-section" id="menu" aria-labelledby="menu-title"><div class="menu-heading"><p class="section-number">02 — AUTUMN SELECTION</p><div><h2 id="menu-title">秋季新味</h2><p>时令会变，手艺不变。</p></div><a class="underlined-link" href="#menu">查看完整菜单 <span>→</span></a></div><div class="dish-grid"><article v-for="dish in dishes" :key="dish.name" class="dish-card" :class="{ 'dish-card-large': dish.featured }"><img :src="dish.image" :alt="dish.alt" /><div class="dish-info"><p>{{ dish.label }}</p><h3>{{ dish.name }}</h3><span>{{ dish.price }}</span></div></article></div></section>
</template>
