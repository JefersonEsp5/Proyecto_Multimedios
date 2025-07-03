<script setup>
import { ref, onMounted } from 'vue'
import WatchingCard from '@/components/WatchingCard.vue'
import SummaryCarousel from '@/components/SummaryCarousel.vue'
import MovieNavbar from '@/components/MovieNavBar.vue'
import { getSeriesDetails, getMovieDetails } from '@/services/tvdb'

const selectedTab = ref('series') // puede ser 'series' o 'movies'
const search = ref('')

const seriesIds = [
  { id: 70941, type: 'series', watched: 3, total: 10, left: 7 },
  { id: 70919, type: 'series', watched: 6, total: 9, left: 3 }
]

const movieIds = [
  { id: 609, type: 'movies', watched: 1, total: 1, left: 0 },
  { id: 560, type: 'movies', watched: 1, total: 1, left: 0 }
]

const series = ref([])
const movies = ref([])

const defaultImage = '/default-placeholder.png'

// tu lógica adaptada para traer la imagen y detalles
async function fetchDetails(id, type) {
  let data = null
  let image = null

  try {
    data = await getSeriesDetails(id)
    image = data?.image || (data?.artworks?.[0]?.image ?? null)
  } catch (err) {
    console.debug(`No es serie, probando película:`, err.message)
  }

  try {
    if (!image) {
      data = await getMovieDetails(id)
      image = data?.image || (data?.artworks?.[0]?.image ?? null)
    }
  } catch (err) {
    console.debug(`No es película`, err.message)
  }

  return {
    title: data?.name || data?.title || 'Sin título',
    overview: data?.overview || 'Sin descripción',
    imageUrl: image ? `https://artworks.thetvdb.com${image}` : defaultImage
  }
}

onMounted(async () => {
  // Puedes pasar watched, total, left manual o dinámico
  series.value = await Promise.all([
    { id: 70930, type: 'series', watched: 7, total: 10, left: 3 },
    { id: 70913, type: 'series', watched: 1, total: 9, left: 8 }
  ].map(async item => {
    const details = await fetchDetails(item.id, item.type)
    return { ...item, ...details }
  }))

  movies.value = await Promise.all([
    { id: 591, type: 'movies', watched: 3, total: 10, left: 7 }
  ].map(async item => {
    const details = await fetchDetails(item.id, item.type)
    return { ...item, ...details }
  }))
})
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
  margin-bottom: 5rem;
}
</style>
