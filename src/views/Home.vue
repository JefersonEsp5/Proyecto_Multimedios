<script setup>
import TvShowsCarousel from '@/components/TvShowsCarousel.vue';
import MovieCarousel from '@/components/MovieCarousel.vue';

</script>


<template>

    <div class="main-container">
        <MovieCarousel></MovieCarousel>
        <TvShowsCarousel/>
    </div>

</template>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #141414;
  color: white;
}

.main-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px;
  box-sizing: border-box;
}
</style>