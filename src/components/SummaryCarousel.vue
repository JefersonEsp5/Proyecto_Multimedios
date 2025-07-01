<script setup>
import { ref, onMounted } from 'vue'
import { useListsStore } from '@/storages/lists'
import {
  BookmarkIcon,
  BookmarkSlashIcon,
  CheckIcon,
  XMarkIcon,
  StarIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/vue/24/outline";
import { getSeriesDetails, getMovieDetails } from '@/services/tvdb'

const listsStore = useListsStore()

const watchlistImages = ref([])
const watchedImages = ref([])
const favoritesImages = ref([])

async function getPoster(id) {
  try {
    let data = await getSeriesDetails(id)
    let image = data?.image || (data?.artworks?.[0]?.image ?? null)
    if (!image) {
      data = await getMovieDetails(id)
      console.log("🎬 Película ID:", id, data)
      image = data?.image || (data?.artworks?.[0]?.image ?? null)
    }
    return image || '/default-placeholder.png'
  } catch {
    return '/default-placeholder.png'
  }
}



onMounted(async () => {
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
    <div class="summary-card purple">
      <div v-if="watchlistImages.length" class="grid">
        <div v-for="(item, index) in watchlistImages.slice(0,4)" :key="index" class="thumb-container">
          <img :src="item.image" class="thumbnail" />
          <div v-if="index === 3 && watchlistImages.length > 4" class="more purple-pill">
            +{{ watchlistImages.length - 3 }}
          </div>
        </div>
      </div>
      <div v-else class="empty-icon"><BookmarkSlashIcon class="h-8 w-8" /></div>
      <div class="label">
        <BookmarkSlashIcon class="h-4 w-4" /> 
        <span>Watchlist {{ watchlistImages.length }}</span>
      </div>
    </div>

    <!-- WATCHED -->
    <div class="summary-card green">
      <div v-if="watchedImages.length" class="grid">
        <div v-for="(item, index) in watchedImages.slice(0,4)" :key="index" class="thumb-container">
          <img :src="item.image" class="thumbnail" />
          <div v-if="index === 3 && watchedImages.length > 4" class="more green-pill">
            +{{ watchedImages.length - 3 }}
          </div>
        </div>
      </div>
      <div v-else class="empty-icon"><EyeSlashIcon class="h-8 w-8" /></div>
      <div class="label">
        <EyeSlashIcon class="h-4 w-4" /> 
        <span>Watched {{ watchedImages.length }}</span>
      </div>
    </div>

    <!-- FAVORITES -->
    <div class="summary-card yellow">
      <div v-if="favoritesImages.length" class="grid">
        <div v-for="(item, index) in favoritesImages.slice(0,4)" :key="index" class="thumb-container">
          <img :src="item.image" class="thumbnail" />
          <div v-if="index === 3 && favoritesImages.length > 4" class="more yellow-pill">
            +{{ favoritesImages.length - 3 }}
          </div>
        </div>
      </div>
      <div v-else class="empty-icon"><XMarkIcon class="h-8 w-8" /></div>
      <div class="label">
        <XMarkIcon class="h-4 w-4" /> 
        <span>Favorites {{ favoritesImages.length }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.summary-carousel {
  display: flex;
  gap: 1rem;
}
.summary-card {
  flex: 1;
  background: #222;
  border-radius: 8px;
  padding: 0.5rem;
  position: relative;
}
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2px;
  position: relative;
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
  font-size: 0.8rem;
  color: #222;
  background: rgba(255,255,255,0.7);
  border-radius: 50px;
  padding: 0.3rem 0.5rem;
}
.purple-pill { background: rgba(159, 122, 234); color: #0a092b; }
.green-pill  { background: rgba(72, 187, 120); color: #0a092b; }
.yellow-pill { background: rgba(246, 224, 94); color: #0a092b; }

.more span {
  color: white;
}
.empty-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
  color: #666;
}
.label {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.purple { border: 2px solid #9f7aea; }
.green { border: 2px solid #48bb78; }
.yellow { border: 2px solid #f6e05e; }
</style>
