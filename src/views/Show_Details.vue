<template>
  <div class="page-container" :style="pageBackgroundStyle">
    <div class="background-overlay"></div>

    <button @click="$router.back()" class="back-button left">←</button>
    <button class="back-button right">⋮</button>
    <div class="search-bar-container">
      <SearchBar />
    </div>

    <div v-if="store.loading" class="loading">
      Cargando detalles de la serie...
    </div>
    <div v-else-if="store.error" class="error">{{ store.error }}</div>

    <div v-else-if="store.tvShow" class="card">
      <img :src="store.tvShow.image" :alt="store.tvShow.name" class="poster" />
      <div class="info">
        <div class="tag">TV-Serie</div>
        <h1 class="title">{{ store.tvShow.name }}</h1>
        <div class="rating-row">
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg" class="imdb-logo"
            alt="IMDb" />
          <span class="rating">{{ store.tvShow.rating || "N/A" }}</span>
          <span class="details">• {{ store.tvShow.year || "Desconocido" }} •
            {{ store.tvShow.runtime || "No disponible" }} minutos</span>
        </div>
        <div class="genres">
          <span v-for="genre in store.tvShow.genres" :key="genre.id" class="genre-tag">{{ genre.name }}</span>
        </div>
        <p class="overview">
          {{ store.tvShow.overview || "No hay descripción disponible." }}
        </p>

        <p class="creators">
          Creadores:
          <span v-if="store.creators && store.creators.length > 0">
            {{store.creators.map((c) => c.name).join(", ")}}
          </span>
          <span v-else>No disponible</span>
        </p>

        <div class="action-buttons-section">
          <button class="start-watching-button">
            <span class="icon"></span> Start watching
          </button>
          <div class="secondary-actions">
            <div class="action-item">
              <button class="icon-button purple" v-if="!listsStore.watchlist.includes(store.tvShow.id)"
                @click="listsStore.addToList('watchlist', store.tvShow.id)">
                <BookmarkIcon class="h-6 w-6" />
              </button>
              <button class="icon-button purple" v-else
                @click="listsStore.removeFromList('watchlist', store.tvShow.id)">
                <BookmarkSlashIcon class="h-6 w-6" />
              </button>
              <span v-if="listsStore.watchlist.includes(store.tvShow.id)">In Watchlist</span>
              <span v-else>Add to Watchlist</span>
            </div>

            <div class="action-item">
              <button class="icon-button green" v-if="!listsStore.watched.includes(store.tvShow.id)"
                @click="listsStore.addToList('watched', store.tvShow.id)">
                <EyeIcon class="h-6 w-6" />
              </button>
              <button class="icon-button green" v-else @click="listsStore.removeFromList('watched', store.tvShow.id)">
                <EyeSlashIcon class="h-6 w-6" />
              </button>
              <span v-if="listsStore.watched.includes(store.tvShow.id)">Watched</span>
              <span v-else>Mark as Watched</span>
            </div>

            <div class="action-item">
              <button class="icon-button yellow" v-if="!listsStore.favorites.includes(store.tvShow.id)"
                @click="listsStore.addToList('favorites', store.tvShow.id)">
                <StarIcon class="h-6 w-6" />
              </button>
              <button class="icon-button yellow" v-else
                @click="listsStore.removeFromList('favorites', store.tvShow.id)">
                <XMarkIcon class="h-6 w-6" />
              </button>
              <span v-if="listsStore.favorites.includes(store.tvShow.id)">In Favorites</span>
              <span v-else>Add to Favorites</span>
            </div>
          </div>
        </div>

        <div class="cast-section">
          <h3>Reparto principal</h3>
          <GenericCarousel :items="store.cast" :item-width="180" :scroll-amount="150">
            <template #item="{ item: actor }">
              <div class="cast-card">
                <img class="actor-img" :src="actor.image ||
                  'https://via.placeholder.com/100x140?text=No+Image'
                  " :alt="actor.name" />
                <div class="actor-info">
                  <p class="actor-name">{{ actor.name }}</p>
                  <p class="actor-role">
                    Como: <strong>{{ actor.role }}</strong>
                  </p>
                </div>
              </div>
            </template>
          </GenericCarousel>
        </div>

        <div class="trailers-section" v-if="store.hasTrailers">
          <h3>Trailers</h3>
          <GenericCarousel :items="store.tvShow.trailers" :item-width="320" :scroll-amount="320">
            <template #item="{ item: trailer }">
              <div class="trailer-card" @click="store.openTrailer(trailer.url)">
                <div class="trailer-thumbnail">
                  <img :src="`https://img.youtube.com/vi/${getYouTubeID(
                    trailer.url
                  )}/mqdefault.jpg`" alt="Trailer thumbnail" />
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

        <div class="episode-info-section">
          <h3 class="section-title">Próximo Episodio</h3>
          <div v-if="store.isSeriesEnded" class="next-episode-card">
            <div class="episode-details">
              <div class="episode-title">Esta serie ha finalizado.</div>
            </div>
          </div>
          <div v-else-if="store.nextEpisode" class="next-episode-card">
            <div class="episode-icon">📅</div>
            <div class="episode-details">
              <div class="episode-date">{{ store.nextEpisode.air_date }}</div>
              <div class="episode-title">
                s{{
                  store.nextEpisode.season_number.toString().padStart(2, "0")
                }}e{{
                  store.nextEpisode.episode_number.toString().padStart(2, "0")
                }},
                {{ store.nextEpisode.title }}
              </div>
            </div>
          </div>
          <div v-else class="next-episode-card">
            <div class="episode-icon">❓</div>
            <div class="episode-details">
              <div class="episode-title">
                Información del próximo episodio no disponible.
              </div>
            </div>
          </div>
        </div>

        <div class="seasons-section" v-if="store.tvShow.seasons && store.tvShow.seasons.length">
          <h3 class="section-title">Seasons</h3>
          <div v-for="season in store.sortedAndFilteredSeasons" :key="season.id" class="season-card-container">
            <div class="season-card">
              <input type="checkbox" :checked="isSeasonFullyWatched(season)" @change="toggleSeasonCheckbox(season)"
                class="season-checkbox" />

              <div class="season-info" @click="store.toggleSeasonExpanded(season)">
                <div class="season-title">Season {{ season.number }}</div>
                <div class="progress-bar-container">
                  <div class="progress-bar" :style="{ width: getSeasonProgress(season) + '%' }"></div>
                </div>
                <div class="episodes-count">
                  {{ getWatchedCount(season) }} / {{ season.episodes.length }}
                </div>
              </div>
              <button class="expand-button" @click="store.toggleSeasonWatched(season)">
                {{ season.watched_count === season.total_episodes ? "✓" : "✗" }}
              </button>
            </div>

            <div v-if="season.expanded" class="episodes-list">
             <div v-for="episode in sortedEpisodes(season.episodes)" :key="episode.id" class="episode-card">
  <input type="checkbox" v-model="episode.watched" @change="updateSeasonProgress(season)" class="episode-checkbox" />

  <div class="episode-title">
    E{{ episode.number.toString().padStart(2, "0") }} - {{ episode.name }}
    <span v-if="episode.aired" class="episode-date">
      ({{ new Date(episode.aired).toLocaleDateString() }})
    </span>
  </div>

  <img
    v-if="episode.image"
    :src="episode.image"
    alt="Imagen del episodio"
    class="episode-thumb"
  />
</div>
              <div v-if="season.episodes.length === 0" class="no-episodes">
                No hay episodios disponibles para esta temporada.
              </div>
            </div>
          </div>
        </div>

        <div v-if="store.activeImageUrl" class="modal-overlay" @click.self="store.closeImage">
          <div class="modal-content image-modal-content">
            <img :src="store.activeImageUrl" alt="Imagen ampliada" />
            <button class="close-button" @click="store.closeImage">
              Cerrar
            </button>
          </div>
        </div>
      </div>

      <div v-if="store.activeTrailerUrl" class="modal-trailer" @click.self="store.closeTrailer">
        <div class="modal-content">
          <iframe width="100%" height="400" :src="`https://www.youtube.com/embed/${getYouTubeID(
            store.activeTrailerUrl
          )}?autoplay=1`" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
          <button class="close-button" @click="store.closeTrailer">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useSeriesDetailsStore } from "@/storages/seriesDetails";
import SearchBar from "@/components/SearchBar.vue"; // Asumiendo que SearchBar es un componente
import GenericCarousel from "@/components/GenericCarousel.vue"; // Asegúrate de importar GenericCarousel
import { useListsStore } from "@/storages/lists";
import {
  BookmarkIcon,
  BookmarkSlashIcon,
  CheckIcon,
  XMarkIcon,
  StarIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/vue/24/outline";

const listsStore = useListsStore();
const route = useRoute();
const store = useSeriesDetailsStore();

// Watch for changes in route params to refetch data
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      store.fetchSeriesDetails(newId);
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (route.params.id && !store.tvShow) {
    // Solo busca si no hay datos cargados para evitar doble llamada en la carga inicial
    store.fetchSeriesDetails(route.params.id);
  }
});

// Computed property for background style
const pageBackgroundStyle = computed(() => {
  if (store.tvShow && store.tvShow.image) {
    return {
      backgroundImage: `url(${store.tvShow.image})`,
    };
  }
  return {};
});

// Método para extraer el ID de YouTube de una URL
const getYouTubeID = (url) => {
  const regex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
};
function getWatchedCount(season) {
  return season.episodes.filter(ep => ep.watched).length;
}

function getSeasonProgress(season) {
  const total = season.episodes.length;
  if (total === 0) return 0;
  return Math.round((getWatchedCount(season) / total) * 100);
}
function isSeasonFullyWatched(season) {
  return season.episodes.length > 0 && season.episodes.every(ep => ep.watched);
}

function toggleSeasonCheckbox(season) {
  const markAll = !isSeasonFullyWatched(season);
  season.episodes.forEach(ep => {
    ep.watched = markAll;
  });
}
function updateSeasonProgress(season) {
  // For reactive updates if necessary, but not strictly required if you use computed
}
const sortedEpisodes = (episodes) => {
  if (!episodes) return [];
  return [...episodes].sort((a, b) => a.number - b.number);
};
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
  background: linear-gradient(to bottom,
      rgba(0, 0, 0, 0.8),
      rgba(0, 0, 0, 0.5) 50%,
      transparent 100%);
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

/* Antiguos estilos de .watch-button y .actions (mantengo para referencia si los necesitas en otro lugar, pero la nueva estructura los reemplaza) */
.watch-button {
  width: 100%;
  margin-top: 1.25rem;
  padding: 0.75rem;
  border-radius: 0.75rem;
  background-color: #6366f1;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.watch-button:hover {
  background-color: #4f46e5;
}

.actions {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #cbd5e0;
  margin-top: 1.25rem;
}

.action {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Fin de antiguos estilos */

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
.episode-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 1px solid #ddd;
  gap: 12px;
}

.episode-checkbox {
  flex-shrink: 0;
  width: 15px;
  height: 15px;
  cursor: pointer;
}

.episode-title {
  flex-grow: 1;
  text-align: center;
  font-weight: 500;
  font-size: 1rem;
  color: #222;
}

.episode-date {
  font-size: 0.85rem;
  color: #777;
  margin-left: 8px;
}

.episode-thumb {
  width: 150px;
  height: auto;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
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

.episode-info-section,
.seasons-section {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
}

.next-episode-card {
  display: flex;
  align-items: center;
  background: #1e1e1e;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
}

.episode-icon {
  font-size: 1.5rem;
  margin-right: 0.75rem;
  color: #6366f1;
}

.episode-details {
  display: flex;
  flex-direction: column;
}

.episode-date {
  font-weight: 600;
  color: #fff;
}

.episode-title {
  color: #a0aec0;
  font-size: 0.95rem;
  word-break: break-word;
}

.season-card {
  display: flex;
  align-items: center;
  background: #1e1e1e;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  margin-bottom: 0.75rem;
}

.season-checkbox {
  margin-right: 1rem;
  transform: scale(1.2);
}

.season-info {
  flex-grow: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.season-title {
  flex-shrink: 0;
  font-weight: 600;
  min-width: 80px;
}

.progress-bar-container {
  flex-grow: 1;
  height: 8px;
  background: #4a5568;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: #6366f1;
  border-radius: 4px 0 0 4px;
}

.episodes-count {
  flex-shrink: 0;
  margin-left: 0.75rem;
  font-size: 0.9rem;
  color: #e2e8f0;
}

.expand-button {
  background: none;
  border: none;
  color: #cbd5e0;
  font-size: 1.25rem;
  margin-left: 0.75rem;
  cursor: pointer;
}

.episodes-list {
  margin-top: 0.5rem;
  background: #111;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
}

.episode-card {
  display: flex;
  align-items: center;
  padding: 0.3rem 0;
  border-bottom: 1px solid #333;
}

.episode-card:last-child {
  border-bottom: none;
}

.episode-number {
  color: #facc15;
  font-weight: bold;
  margin-right: 0.75rem;
}

.episode-title {
  color: #e2e8f0;
  font-size: 0.95rem;
  word-break: break-word;
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