<template>
  <div class="page-container" :style="pageBackgroundStyle">
    <div class="background-overlay"></div>
    <button @click="$router.back()" class="back-button left">←</button>
    <button class="back-button right">⋮</button>

    <div class="search-bar-container">
      <SearchBar />
    </div>

    <div v-if="store.loading" class="loading">Cargando detalles...</div>
    <div v-else-if="store.error" class="error">{{ store.error }}</div>

    <div v-else-if="store.movie" class="card">
      <img :src="store.movie.image" :alt="store.movie.name" class="poster" />
      <div class="info">
        <div class="tag">TV-Peliculas</div>
        <h1 class="title">{{ store.movie.name }}</h1>
        <div class="rating-row">
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg" class="imdb-logo" alt="IMDb" />
          <span class="rating">{{ store.movie.rating || 'N/A' }}</span>
          <span class="details">• {{ store.movie.year || 'Desconocido' }} • {{ store.movie.runtime || 'No disponible' }} minutos</span>
        </div>

        <div class="genres">
          <span v-for="genre in store.movie.genres" :key="genre.id" class="genre-tag">{{ genre.name }}</span>
        </div>

        <p class="overview">{{ store.movie.overview || 'No hay descripción disponible.' }}</p>

        <p class="creators">
          Creadores / Productores:
          <span v-if="store.creators && store.creators.length > 0">
            {{ store.creators.map(c => c.name).join(', ') }}
          </span>
          <span v-else>No disponible</span>
        </p>

        <div class="action-buttons-section">
          <button class="start-watching-button">Start watching</button>

          <div class="secondary-actions">
            <div class="action-item">
              <button class="icon-button purple"
                v-if="!listsStore.watchlist.includes(store.movie.id)"
                @click="listsStore.addToList('watchlist', store.movie.id)">
                <BookmarkIcon class="h-6 w-6" />
              </button>
              <button class="icon-button purple"
                v-else
                @click="listsStore.removeFromList('watchlist', store.movie.id)">
                <BookmarkSlashIcon class="h-6 w-6" />
              </button>
              <span v-if="listsStore.watchlist.includes(store.movie.id)">In Watchlist</span>
              <span v-else>Add to Watchlist</span>
            </div>

            <div class="action-item">
              <button class="icon-button green"
                v-if="!listsStore.watched.includes(store.movie.id)"
                @click="listsStore.addToList('watched', store.movie.id)">
                <EyeIcon class="h-6 w-6" />
              </button>
              <button class="icon-button green"
                v-else
                @click="listsStore.removeFromList('watched', store.movie.id)">
                <EyeSlashIcon class="h-6 w-6" />
              </button>
              <span v-if="listsStore.watched.includes(store.movie.id)">Watched</span>
              <span v-else>Mark as Watched</span>
            </div>

            <div class="action-item">
              <button class="icon-button yellow"
                v-if="!listsStore.favorites.includes(store.movie.id)"
                @click="listsStore.addToList('favorites', store.movie.id)">
                <StarIcon class="h-6 w-6" />
              </button>
              <button class="icon-button yellow"
                v-else
                @click="listsStore.removeFromList('favorites', store.movie.id)">
                <XMarkIcon class="h-6 w-6" />
              </button>
              <span v-if="listsStore.favorites.includes(store.movie.id)">In Favorites</span>
              <span v-else>Add to Favorites</span>
            </div>
          </div>
        </div>

        <div class="cast-section">
          <h3>Reparto principal</h3>
          <GenericCarousel :items="store.cast" :item-width="180" :scroll-amount="150">
            <template #item="{ item: actor }">
              <div class="cast-card">
                <img class="actor-img" :src="actor.image || 'https://via.placeholder.com/100x140?text=No+Image'" :alt="actor.name" />
                <div class="actor-info">
                  <p class="actor-name">{{ actor.name }}</p>
                  <p class="actor-role">Como: <strong>{{ actor.role }}</strong></p>
                </div>
              </div>
            </template>
          </GenericCarousel>
        </div>

        <div class="trailers-section" v-if="store.hasTrailers">
          <h3>Trailers</h3>
          <GenericCarousel :items="store.movie.trailers" :item-width="320" :scroll-amount="320">
            <template #item="{ item: trailer }">
              <div class="trailer-card" @click="store.openTrailer(trailer.url)">
                <div class="trailer-thumbnail">
                  <img :src="`http://img.youtube.com/vi/${getYouTubeID(trailer.url)}/mqdefault.jpg`" alt="Trailer thumbnail" />
                </div>
                <p class="trailer-name">{{ trailer.name }}</p>
              </div>
            </template>
          </GenericCarousel>
        </div>

        <div class="images-section" v-if="store.hasArtworks">
          <h3>Imágenes</h3>
          <GenericCarousel :items="store.filteredArtworks" :item-width="160" :scroll-amount="160">
            <template #item="{ item: artwork, index }">
              <div class="image-card" @click="store.openImage(artwork.image)">
                <img :src="artwork.thumbnail || artwork.image" :alt="`Imagen ${index + 1}`" class="image-thumb" />
              </div>
            </template>
          </GenericCarousel>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useMovieDetailsStore } from '@/storages/movieDetails'
import { useListsStore } from '@/storages/lists'
import { BookmarkIcon, CheckIcon, XMarkIcon, StarIcon, EyeIcon, EyeSlashIcon, BookmarkSlashIcon } from '@heroicons/vue/24/outline'
import GenericCarousel from '@/components/GenericCarousel.vue'
import SearchBar from '@/components/SearchBar.vue'

const route = useRoute()
const store = useMovieDetailsStore()
const listsStore = useListsStore()

onMounted(() => {
  const movieId = parseInt(route.params.id)
  store.fetchMovieDetails(movieId)
})

const pageBackgroundStyle = computed(() => {
  if (store.movie && store.movie.image) {
    return {
      backgroundImage: `url(${store.movie.image})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center top',
      backgroundRepeat: 'no-repeat',
    }
  }
  return {
    backgroundColor: '#1a1a1a',
  }
})

const getYouTubeID = (url) => {
  const match = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  )
  return match ? match[1] : ''
}
</script>

<style scoped>
body,
html {
  margin: 0;
  padding: 0;
  background-color: #000;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 250px;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5) 50%, transparent 100%);
  z-index: 1;
}

.search-bar-container {
  display: flex;
  justify-content: center;
  margin-bottom: 5px;
  padding-top: 20px;
  position: relative;
  z-index: 5;
}

.no-episodes {
  color: #a0aec0;
  text-align: center;
  padding: 1rem;
  font-style: italic;
}

.search-bar {
  width: 350px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  background: #000;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 90%;
  max-height: 90%;
}

.modal-content.image-modal-content {
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content.image-modal-content img {
  max-width: 100%;
  max-height: calc(100% - 40px);
  object-fit: contain;
  display: block;
}

.modal-content .close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #f56565;
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 5px;
  z-index: 1001;
}

.modal-trailer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-trailer .modal-content {
  position: relative;
  background: #000;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80vw;
  max-width: 1000px;
  height: auto;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-trailer .modal-content iframe {
  width: 100%;
  height: 70vh;
  min-height: 300px;
  max-height: 800px;
  border-radius: 6px;
  display: block;
}

.modal-trailer .close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #f56565;
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 5px;
  z-index: 1001;
}

.close-button {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #f56565;
  border: none;
  color: white;
  padding: 0.3rem 0.7rem;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 5px;
}

.image-card {
  flex: 0 0 auto;
  width: 150px;
  cursor: pointer;
  height: 90px;
  overflow: hidden;
  border-radius: 6px;
}

.image-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.trailer-thumbnail img {
  width: 300px;
  height: 170px;
  border-radius: 6px;
  object-fit: cover;
}

.play-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2rem;
  color: white;
  pointer-events: none;
}

.cast-section {
  margin-top: 2rem;
}

.cast-card {
  background: #1e1e1e;
  border-radius: 10px;
  width: 160px;
  padding: 0.5rem;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  min-height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.actor-img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.actor-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.actor-name {
  font-weight: bold;
  margin-top: 0;
  margin-bottom: 0.25rem;
  color: #fff;
  line-height: 1.2;
  word-break: break-word;
}

.actor-role {
  font-size: 0.85rem;
  color: #ccc;
  line-height: 1.2;
  word-break: break-word;
  margin-bottom: 0;
}

.page-container {
  width: 100vw;
  min-height: auto;
  background-color: #000;
  color: white;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  overflow: auto;
}

.back-button {
  position: absolute;
  top: 1rem;
  padding: 0.6rem;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.7);
  border: none;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  z-index: 10;
  opacity: 0.5; 
  transition: opacity 0.3s ease;
}
.back-button:hover {
  opacity: 1; 
}
.back-button.left {
  left: 1rem;
}

.back-button.right {
  right: 1rem;
}

.card {
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.poster {
  width: 100%;
  height: 400px;
  object-fit: cover;
  display: block;
}

.info {
  text-align: center;
  margin-top: -3rem;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
  z-index: 2;
  width: 100%;
}

.rating-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
  text-align: center;
}

.tag {
  color: #f56565;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.title {
  font-size: 2rem;
  font-weight: bold;
}

.rating-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
}

.imdb-logo {
  width: 3rem;
}

.rating {
  color: #facc15;
  font-weight: 600;
}

.details {
  color: #a0aec0;
}

.genres {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
  justify-content: center;
}

.genre-tag {
  background-color: #4a5568;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.877rem;
}

.overview {
  font-size: 0.95rem;
  color: #e2e8f0;
  margin-top: 1rem;
  line-height: 1.6;
}

.creators {
  font-size: 0.85rem;
  color: #a0aec0;
  margin-top: 0.5rem;
}

.icon {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

.purple {
  color: #9f7aea;
}

.green {
  color: #48bb78;
}

.yellow {
  color: #f6e05e;
}

/*movil*/
@media (max-width: 768px) {
  .page-container {
    overflow: auto;
  }

  .card {
    padding: 0 1rem;
  }

  .poster {
    height: 300px;
    object-fit: cover;
  }

  .info {
    margin-top: -2rem;
    padding: 1.5rem 1rem;
    border-bottom-left-radius: 1rem;
    border-bottom-right-radius: 1rem;
  }

  .title {
    font-size: 1.5rem;
    text-align: center;
  }

  .rating-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    text-align: center;
    flex-wrap: wrap;
  }

  .genres {
    justify-content: center;
  }

  .overview {
    font-size: 0.9rem;
    text-align: center;
  }

  .creators {
    text-align: center;
  }

  .watch-button {
    width: 100%;
    font-size: 1rem;
    padding: 0.75rem;
  }

  .actions {
    flex-direction: row;
    justify-content: space-around;
    margin-top: 1.5rem;
  }

  .action {
    font-size: 0.75rem;
  }

  .icon {
    font-size: 1.25rem;
  }

  .back-button {
    font-size: 1rem;
    padding: 0.4rem;
  }

  /* Ajustes específicos para móviles en la sección de botones de acción */
  .action-buttons-section {
    padding: 0 1rem;
    /* Añadir padding para que el botón no toque los bordes */
  }

  .start-watching-button {
    font-size: 0.95rem;
    /* Ajustar tamaño de fuente para pantallas pequeñas */
  }

  .secondary-actions {
    flex-wrap: wrap;
    /* Permitir que los elementos se envuelvan en pantallas pequeñas */
    justify-content: center;
    /* Centrar los elementos cuando se envuelvan */
    gap: 0.75rem;
    /* Reducir el espacio entre elementos */
  }

  .action-item {
    min-width: 80px;
    /* Asegurar un ancho mínimo para los elementos de acción */
  }
}

.section-title {
  font-size: 1.25rem;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
  text-align: left;
  width: 100%;
}

/* Nuevos estilos para la sección de botones de acción */
.action-buttons-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1.5rem;
  width: 100%;
  /* Eliminar max-width de aquí */
  padding: 0 1rem;
  /* Añadir padding para los bordes */
}

.start-watching-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  /* Asegurar que ocupe todo el ancho disponible */
  max-width: 400px;
  /* Limitar el ancho máximo para pantallas grandes */
  padding: 0.75rem 1.5rem;
  background-color: #6a5acd;
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.start-watching-button:hover {
  background-color: #5a4aa6;
}

.start-watching-button .icon {
  margin-right: 0.5rem;
  font-size: 1.2rem;
}

.secondary-actions {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: 1rem;
  gap: 1rem;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  font-size: 0.85rem;
  color: #a0aec0;
  flex: 1;
}

.icon-button {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  cursor: pointer;
  margin-bottom: 0.4rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease;
}

.icon-button:hover {
  transform: translateY(-2px);
}

.icon-button.purple {
  background-color: #9f7aea;
  color: white;
}

.icon-button.green {
  background-color: #48bb78;
  color: white;
}

.icon-button.yellow {
  background-color: #f6e05e;
  color: white;
}
</style>





Deep Research

Canvas

G