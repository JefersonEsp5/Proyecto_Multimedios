<script setup>
import WatchlistCarousel from '@/components/WatchlistCarousel.vue'
import WatchedCarousel from '@/components/WatchedCarousel.vue'
import FavoritesCarousel from '@/components/FavoritesCarousel.vue'
</script>

<template>
  <section class="my-library">
    <h1>Mi biblioteca</h1>
    <WatchlistCarousel />
    <WatchedCarousel />
    <FavoritesCarousel />
  </section>
</template>

<style scoped>
.my-library {
  padding: 20px;
  color: white;
}

.my-library h1 {
  font-size: 28px;
  margin-bottom: 24px;
}
</style>
