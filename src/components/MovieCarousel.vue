<template>
  <div class="app">
    <div v-if="!showAllMovies" class="carousel-container">
      <div class="carousel-header">
        <h2>Películas recomendadas</h2>
        <button class="see-all-btn" @click="toggleShowAll">
          <span>Ver todo</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="arrow-icon">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      <div v-if="mediaStore.loadingMovies" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Cargando películas...</p>
      </div>

      <div v-else-if="mediaStore.errorMovies" class="error-message">
        {{ mediaStore.errorMovies }}
      </div>

      <div v-else class="carousel" ref="carouselRef">
        <div class="carousel-content" :style="{ transform: `translateX(-${scrollPosition}px)` }">
          <div v-for="movie in limitedMovies" :key="movie.id" class="movie-card" @click="selectMovie(movie)">
            <div class="movie-poster">
              <div class="rating">{{ movie.rating }}</div>
              <img :src="movie.poster" :alt="movie.title" @error="setDefaultPoster" />
            </div>
            <div class="movie-title">{{ movie.title }}</div>
            <div class="movie-year">{{ movie.year }}</div>
          </div>
        </div>

        <button class="nav-button prev" @click="scroll('prev')" :class="{ 'hidden': scrollPosition <= 0 }">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <button class="nav-button next" @click="scroll('next')" :class="{ 'hidden': scrollPosition >= maxScroll }">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>

    <div v-else class="all-movies-container">
      <div class="carousel-header">
        <h2>Todas las películas</h2>
        <button class="see-all-btn" @click="toggleShowAll">
          <span>Volver</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="arrow-icon">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
      </div>

      <div v-if="mediaStore.loadingMovies" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Cargando películas...</p>
      </div>

      <div v-else-if="mediaStore.errorMovies" class="error-message">
        {{ mediaStore.errorMovies }}
      </div>

      <div v-else class="movies-grid">
        <div v-for="movie in allMovies" :key="movie.id" class="movie-card grid-card" @click="selectMovie(movie)">
          <div class="movie-poster">
            <div class="rating">{{ movie.rating }}</div>
            <img :src="movie.poster" :alt="movie.title" @error="setDefaultPoster" />
          </div>
          <div class="movie-info">
            <div class="movie-title">{{ movie.title }}</div>
            <div class="movie-year">{{ movie.year }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useMediaStore } from '@/storages/mediaStore'; // Importa tu store de Pinia

// Inicializa el router
const router = useRouter();

// Inicializa el store de Pinia
const mediaStore = useMediaStore();

// Props (sin cambios)
const props = defineProps({
  maxItems: {
    type: Number,
    default: 20
  },
  carouselItems: {
    type: Number,
    default: 10
  }
});

// Estado local del componente
const scrollPosition = ref(0);
const maxScroll = ref(0);
const scrollAmount = 200;
const showAllMovies = ref(false); // Ahora es un ref para Composition API
const carouselRef = ref(null); // Referencia al elemento del carrusel

// Computed properties
const limitedMovies = computed(() => {
  return mediaStore.popularMovies.slice(0, props.carouselItems);
});

const allMovies = computed(() => {
  return mediaStore.popularMovies.slice(0, props.maxItems);
});


// Métodos
const updateMaxScroll = () => {
  if (!carouselRef.value) return;

  const containerWidth = carouselRef.value.clientWidth;
  const contentWidth = carouselRef.value.querySelector('.carousel-content').scrollWidth;
  maxScroll.value = Math.max(0, contentWidth - containerWidth);
};

const scroll = (direction) => {
  if (direction === 'next') {
    scrollPosition.value = Math.min(scrollPosition.value + scrollAmount, maxScroll.value);
  } else {
    scrollPosition.value = Math.max(scrollPosition.value - scrollAmount, 0);
  }
};

const selectMovie = (movie) => {
  router.push({ name: 'Movie_Details', params: { id: movie.id } });
};

const toggleShowAll = () => {
  showAllMovies.value = !showAllMovies.value;
  if (!showAllMovies.value) {
    scrollPosition.value = 0;
    nextTick(() => {
      updateMaxScroll();
    });
  }
};

const setDefaultPoster = (event) => {
  event.target.src = 'https://via.placeholder.com/300x450?text=No+Poster';
  event.target.classList.add('error-poster');
};

// Hook de ciclo de vida
onMounted(() => {
  // Dispara la acción de Pinia para cargar las películas
  mediaStore.fetchPopularMovies();

  // Asegúrate de que los elementos estén renderizados antes de calcular maxScroll
  nextTick(() => {
    updateMaxScroll();
  });
});
</script>

<style scoped>
/* Estilos base */
.app {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px;
  box-sizing: border-box;
}

.carousel-container, .all-movies-container {
  width: 100%;
  margin-bottom: 32px;
}

.carousel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.carousel-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: white;
  margin: 0;
}

.see-all-btn {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  font-size: 14px;
}

.see-all-btn:hover {
  color: white;
}

.arrow-icon {
  margin-left: 4px;
  width: 16px;
  height: 16px;
}

/* Estilos de tarjetas */
.movie-card {
  cursor: pointer;
  transition: transform 0.2s;
  position: relative;
}

.movie-card:hover {
  transform: scale(1.05);
  z-index: 2;
}

.movie-poster {
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  background-color: #0a0a0a;
}

.movie-poster::before {
  content: "";
  display: block;
  padding-top: 150%;
}

.movie-poster img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.movie-poster img.error-poster {
  object-fit: contain;
  padding: 20%;
  background-color: #222;
}

.rating {
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 14px;
  z-index: 2;
}

.movie-title {
  margin-top: 8px;
  font-size: 14px;
  font-weight: 500;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.movie-year {
  font-size: 12px;
  color: #aaa;
  margin-top: 4px;
}

.movie-info {
  padding: 8px 0;
}


/* Estilos del carrusel */
.carousel {
  position: relative;
  overflow: hidden;
  padding: 0 5px;
}

.carousel-content {
  display: flex;
  transition: transform 0.5s ease;
  gap: 10px;
}

.carousel .movie-card {
  width: 120px;
  flex-shrink: 0;
}

/* Botones de navegación */
.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.7);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: opacity 0.3s;
}

.nav-button.prev {
  left: 5px;
}

.nav-button.next {
  right: 5px;
}

.nav-button:hover {
  background-color: rgba(0, 0, 0, 0.9);
}

.nav-button.hidden {
  opacity: 0;
  pointer-events: none;
}

.nav-button svg {
  width: 16px;
  height: 16px;
}

/* Estilos de la vista de cuadrícula */
.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.grid-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.grid-card .movie-poster {
  flex-shrink: 0;
  width: 100%;
}

.grid-card .movie-info {
  padding: 8px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.grid-card .movie-title {
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.2;
  height: 2.4em;
}

.grid-card .movie-year {
  margin-top: auto;
}

/* Loading y error styles */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: white;
}

.loading-spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid #ffffff;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-message {
  color: #ff6b6b;
  text-align: center;
  padding: 20px;
  background-color: rgba(255, 0, 0, 0.1);
  border-radius: 4px;
  margin: 10px 0;
}


/* Media queries */
@media (min-width: 480px) {
  .carousel .movie-card {
    width: 140px;
  }
  .movies-grid {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  }
  .carousel-header h2 {
    font-size: 20px;
  }
  .nav-button {
    width: 36px;
    height: 36px;
  }
  .carousel-content {
    gap: 12px;
  }
}

@media (min-width: 768px) {
  .app {
    padding: 15px;
  }
  .carousel .movie-card {
    width: 160px;
  }
  .movies-grid {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 20px;
  }
  .nav-button {
    width: 40px;
    height: 40px;
  }
  .nav-button svg {
    width: 20px;
    height: 20px;
  }
  .carousel-content {
    gap: 15px;
  }
}

@media (min-width: 1024px) {
  .app {
    padding: 20px;
  }
  .carousel .movie-card {
    width: 180px;
  }
  .movies-grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
  .carousel-header h2 {
    font-size: 22px;
  }
  .carousel-content {
    gap: 16px;
  }
}

@media (min-width: 1280px) {
  .movies-grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
}
</style>