<script setup>
import TvShowsCarousel from '@/components/TvShowsCarousel.vue';
import MovieCarousel from '@/components/MovieCarousel.vue';
import MovieNavbar from '@/components/MovieNavBar.vue';
import SearchResults from '@/views/SearchResults.vue'; // <--- NEW: Import SearchResults
import SummaryCarousel from '@/components/SummaryCarousel.vue';

import { useSearchStore } from '@/storages/search.js'; 

const searchStore = useSearchStore(); // <--- NEW: Initialize the search store
</script>

<template>
  <div class="main-container">
    <MovieNavbar />

    <SummaryCarousel />
    
    <div v-if="searchStore.searchText || searchStore.hasResults || searchStore.isSearching">
        <SearchResults />
    </div>
    <template v-else>
      <MovieCarousel></MovieCarousel>
      <TvShowsCarousel/>
    </template>
    
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