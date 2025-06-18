<template>
  <div class="app">
    <!-- Vista principal del carrusel -->
    <div v-if="!showAllShows" class="carousel-container">
      <div class="carousel-header">
        <h2>Series de TV populares</h2>
        <button class="see-all-btn" @click="toggleShowAll">
          <span>Ver todo</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="arrow-icon">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Cargando series...</p>
      </div>

      <div v-else-if="error" class="error-message">
        {{ error }}
      </div>

      <div v-else class="carousel" ref="carouselRef">
        <div class="carousel-content" :style="{ transform: `translateX(-${scrollPosition}px)` }">
          <div v-for="show in limitedShows" :key="show.id" class="show-card" @click="selectShow(show)">
            <div class="show-poster">
              <div class="rating">{{ show.rating }}</div>
              <img :src="show.poster" :alt="show.title" @error="setDefaultPoster" />
            </div>
            <div class="show-title">{{ show.title }}</div>
            <div class="show-year">{{ show.year }}</div>
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

    <!-- Vista de "Ver todo" -->
    <div v-else class="all-shows-container">
      <div class="carousel-header">
        <h2>Todas las series</h2>
        <button class="see-all-btn" @click="toggleShowAll">
          <span>Volver</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="arrow-icon">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
      </div>

      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Cargando series...</p>
      </div>

      <div v-else-if="error" class="error-message">
        {{ error }}
      </div>

      <div v-else class="shows-grid">
        <div v-for="show in limitedShows" :key="show.id" class="show-card grid-card" @click="selectShow(show)">
          <div class="show-poster">
            <div class="rating">{{ show.rating }}</div>
            <img :src="show.poster" :alt="show.title" @error="setDefaultPoster" />
          </div>
          <div class="show-info">
            <div class="show-title">{{ show.title }}</div>
            <div class="show-year">{{ show.year }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getPopularSeries } from "@/services/tvdb";

export default {
  name: 'TvShowsCarousel',
  props: {
    maxItems: {
      type: Number,
      default: 20
    },
    carouselItems: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      scrollPosition: 0,
      maxScroll: 0,
      scrollAmount: 200,
      showAllShows: false,
      tvShows: [],
      loading: true,
      error: null
    };
  },
  computed: {
    limitedShows() {
      return this.showAllShows
        ? this.tvShows.slice(0, this.maxItems)
        : this.tvShows.slice(0, this.carouselItems);
    }
  },
  async mounted() {
    try {
      const shows = await getPopularSeries();
      this.tvShows = shows
        .filter(show => show.poster && show.poster.includes('artworks.thetvdb.com'))
        .slice(0, this.maxItems + 10);

      this.$nextTick(() => {
        this.updateMaxScroll();
      });
    } catch (error) {
      console.error("Error al cargar series:", error);
      this.error = "No se pudieron cargar las series. Intenta de nuevo más tarde.";
    } finally {
      this.loading = false;
    }
  },
  methods: {
    updateMaxScroll() {
      if (!this.$refs.carouselRef) return;

      const containerWidth = this.$refs.carouselRef.clientWidth;
      const contentWidth = this.$refs.carouselRef.querySelector('.carousel-content').scrollWidth;
      this.maxScroll = Math.max(0, contentWidth - containerWidth);
    },
    scroll(direction) {
      if (direction === 'next') {
        this.scrollPosition = Math.min(this.scrollPosition + this.scrollAmount, this.maxScroll);
      } else {
        this.scrollPosition = Math.max(this.scrollPosition - this.scrollAmount, 0);
      }
    },
   
    selectShow(show) {
      this.$router.push({ name: 'Show_Details', params: { id: show.id.toString() } });
    },
    toggleShowAll() {
      this.showAllShows = !this.showAllShows;
      if (!this.showAllShows) {
        this.scrollPosition = 0;
        this.$nextTick(() => {
          this.updateMaxScroll();
        });
      }
    },
    setDefaultPoster(event) {
      event.target.src = 'https://via.placeholder.com/300x450?text=No+Poster';
      event.target.classList.add('error-poster');
    }
  }
}
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

.carousel-container,
.all-shows-container {
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
.show-card {
  cursor: pointer;
  transition: transform 0.2s;
  position: relative;
}

.show-card:hover {
  transform: scale(1.05);
  z-index: 2;
}

.show-poster {
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  background-color: #0a0a0a;
}

.show-poster::before {
  content: "";
  display: block;
  padding-top: 150%;
}

.show-poster img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.show-poster img.error-poster {
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

.show-title {
  margin-top: 8px;
  font-size: 14px;
  font-weight: 500;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.show-year {
  font-size: 12px;
  color: #aaa;
  margin-top: 4px;
}

.show-info {
  padding: 8px 0;
}

.grid-card .show-info {
  padding: 8px;
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

.carousel .show-card {
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
.shows-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.grid-card {
  width: 100%;
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
  .carousel .show-card {
    width: 140px;
  }

  .shows-grid {
    grid-template-columns: repeat(3, 1fr);
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

  .carousel .show-card {
    width: 160px;
  }

  .shows-grid {
    grid-template-columns: repeat(4, 1fr);
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

  .carousel .show-card {
    width: 180px;
  }

  .shows-grid {
    grid-template-columns: repeat(5, 1fr);
  }

  .carousel-header h2 {
    font-size: 22px;
  }

  .carousel-content {
    gap: 16px;
  }
}

@media (min-width: 1280px) {
  .shows-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}
</style>