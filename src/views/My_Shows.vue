<script setup>
import { ref } from 'vue'
import WatchingCard from '@/components/WatchingCard.vue'
import SummaryCarousel from '@/components/SummaryCarousel.vue'
import MovieNavbar from '@/components/MovieNavBar.vue'

const selectedTab = ref('series') // puede ser 'series' o 'movies'
const search = ref('')

// Tus listas
const series = [
  {
    image: 'https://artworks.thetvdb.com/banners/posters/705-1.jpg',
    title: 'Severance',
    episodeCode: 's05e02',
    episodeTitle: 'In Perpetuity',
    watched: 2,
    total: 10,
    left: 8
  },
  {
    image: 'https://artworks.thetvdb.com/banners/posters/560-1.jpg',
    title: 'Stranger Things',
    episodeCode: 's04e01',
    episodeTitle: 'The Hellfire Club',
    watched: 1,
    total: 9,
    left: 8
  }
]
const movies = []
</script>

<template>
  <div class="my-shows-container">
    <MovieNavbar />

    <!-- SUMMARY CAROUSEL -->
    <SummaryCarousel />

    Watching
    <!-- WATCHING CARDS -->
    <div class="watching-list">
      <WatchingCard 
        v-for="(item, idx) in (selectedTab === 'series' ? series : movies)" 
        :key="idx" 
        :show="item" 
      />
    </div>
  </div>
</template>

<style scoped>
.my-shows-container {
  padding: 1rem;
}

/* SEARCH */
.search-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1e1e1e;
  border-radius: 12px;
  padding: 0.4rem 0.8rem;
  margin-bottom: 1rem;
}
.search-bar input {
  background: transparent;
  border: none;
  outline: none;
  color: white;
  flex: 1;
  font-size: 0.9rem;
}
.avatar {
  width: 30px;
  height: 30px;
  background: #444 url('https://placehold.co/30x30') center/cover no-repeat;
  border-radius: 50%;
}

/* TABS */
.tabs {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
}
.tab {
  flex: 1;
  text-align: center;
  padding: 0.5rem;
  color: #aaa;
  cursor: pointer;
}
.tab.active {
  border-bottom: 2px solid #9f7aea;
  color: white;
  font-weight: bold;
}

/* WATCHING CARDS */
.watching-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
