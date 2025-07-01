<script setup>
import { ref, onMounted } from 'vue'
import { useListsStore } from '@/storages/lists'
import {
  BookmarkSlashIcon,
  EyeSlashIcon,
  XMarkIcon,
  BookmarkIcon,
  EyeIcon,
  StarIcon,
} from "@heroicons/vue/24/outline";
import { getSeriesDetails, getMovieDetails } from '@/services/tvdb'

const listsStore = useListsStore()

const watchlistImages = ref([])
const watchedImages = ref([])
const favoritesImages = ref([])

// función genérica que intenta obtener el poster
async function getPoster(id) {
  try {
    let data = await getSeriesDetails(id)
    let image = data?.image || (data?.artworks?.[0]?.image ?? null)
    if (!image) {
      data = await getMovieDetails(id)
      image = data?.image || (data?.artworks?.[0]?.image ?? null)
    }
    return image || '/default-placeholder.png'
  } catch {
    return '/default-placeholder.png'
  }
}

// ahora aseguramos esperar la carga de listas
onMounted(async () => {
  await listsStore.loadListsFromDb() // 👈 esto garantiza que ya tiene los datos

  // ahora sí pedimos imágenes con los IDs cargados
  watchlistImages.value = await Promise.all(listsStore.watchlist.map(async id => ({
    id,
    image: await getPoster(id)
  })))
  watchedImages.value = await Promise.all(listsStore.watched.map(async id => ({
    id,
    image: await getPoster(id)
  })))
  favoritesImages.value = await Promise.all(listsStore.favorites.map(async id => ({
    id,
    image: await getPoster(id)
  })))
})
</script>


<template>
  <div class="summary-carousel">
    <!-- WATCHLIST -->
    <div class="summary-card">
      <div class="card-content">
        <div v-if="watchlistImages.length" class="grid">
          <div v-for="(item, index) in watchlistImages.slice(0,4)" :key="index" class="thumb-container">
            <img :src="item.image" class="thumbnail" />
            <div v-if="index === 3 && watchlistImages.length > 4" class="more purple-pill">
              +{{ watchlistImages.length - 4 }}
            </div>
          </div>
        </div>
        <div v-else class="empty-icon"><BookmarkSlashIcon /></div>
      </div>
      <div class="label purple">
        <BookmarkIcon class="small-icon" /> 
        <span>Watchlist {{ watchlistImages.length }}</span>
      </div>
    </div>

    <!-- WATCHED -->
    <div class="summary-card">
      <div class="card-content">
        <div v-if="watchedImages.length" class="grid">
          <div v-for="(item, index) in watchedImages.slice(0,4)" :key="index" class="thumb-container">
            <img :src="item.image" class="thumbnail" />
            <div v-if="index === 3 && watchedImages.length > 4" class="more green-pill">
              +{{ watchedImages.length - 3 }}
            </div>
          </div>
        </div>
        <div v-else class="empty-icon"><EyeSlashIcon /></div>
      </div>
      <div class="label green">
        <EyeIcon class="small-icon" /> 
        <span>Watched {{ watchedImages.length }}</span>
      </div>
    </div>

    <!-- FAVORITES -->
    <div class="summary-card">
      <div class="card-content">
        <div v-if="favoritesImages.length" class="grid">
          <div v-for="(item, index) in favoritesImages.slice(0,4)" :key="index" class="thumb-container">
            <img :src="item.image" class="thumbnail" />
            <div v-if="index === 3 && favoritesImages.length > 4" class="more yellow-pill">
              +{{ favoritesImages.length - 3 }}
            </div>
          </div>
        </div>
        <div v-else class="empty-icon"><XMarkIcon /></div>
      </div>
      <div class="label yellow">
        <StarIcon class="small-icon" /> 
        <span>Favorites {{ favoritesImages.length }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.summary-carousel {
  display: flex;
  gap: 1rem;
  justify-content: center;
}
.summary-card {
  flex: 0 0 250px;
  border-radius: 8px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 300px;
}
.card-content {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2px;
}
.thumb-container {
  position: relative;
}
.thumbnail {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 4px;
}
.more {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.75rem;
  color: #fff;
  border-radius: 9999px;
  padding: 0.3rem 0.6rem;
  backdrop-filter: blur(4px);
}
.purple-pill { background: rgba(159, 122, 234, 0.8); }
.green-pill  { background: rgba(72, 187, 120, 0.8); }
.yellow-pill { background: rgba(246, 224, 94, 0.8); }

.empty-icon svg {
  width: 30px;
  height: 30px;
  color: #666;
}
.label {
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.label.purple { color: #9f7aea; }
.label.green  { color: #48bb78; }
.label.yellow { color: #f6e05e; }

.small-icon {
  width: 16px;
  height: 16px;
}

@media (max-width: 768px) {
  .summary-carousel {
    overflow-x: auto;
    flex-wrap: nowrap;
  }
  .summary-card {
    flex: 0 0 140px; /* ancho fijo */
    margin-right: 10px;
  }
}

.summary-carousel::-webkit-scrollbar {
  display: none;
}
.summary-carousel {
  -ms-overflow-style: none;  /* IE y Edge */
  scrollbar-width: none;     /* Firefox */
}

</style>
