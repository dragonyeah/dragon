<script setup>
import { ref } from 'vue';
import SiteHeader from './components/SiteHeader.vue';
import HeroSection from './components/HeroSection.vue';
import StorySection from './components/StorySection.vue';
import MenuSection from './components/MenuSection.vue';
import VisitSection from './components/VisitSection.vue';
import SiteFooter from './components/SiteFooter.vue';
import BookingDialog from './components/BookingDialog.vue';

const bookingOpen = ref(false);

function openBooking() {
  bookingOpen.value = true;
}
</script>

<template>
  <div class="page-grain" aria-hidden="true"></div>
  <SiteHeader @open-booking="openBooking" />
  <main><HeroSection @open-booking="openBooking" /><StorySection /><MenuSection /><VisitSection @open-booking="openBooking" /></main>
  <SiteFooter />
  <BookingDialog :open="bookingOpen" @close="bookingOpen = false" />
</template>
