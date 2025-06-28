<template>
  <div class="carousel-container">
    <div class="carousel-header">
      <h2>Series de TV populares</h2>
      <button class="see-all-btn" @click="toggleView">
        {{ showAll ? 'Volver' : 'Ver todo' }}
        <svg class="arrow-icon" fill="currentColor" viewBox="0 0 20 20" v-if="!showAll">
          <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
        </svg>
      </button>
    </div>

    <div v-if="mediaStore.loadingTvShows" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Cargando series...</p>
    </div>
    <div v-else-if="mediaStore.errorTvShows" class="error-message">
      {{ mediaStore.errorTvShows }}
    </div>
    <div v-else>
      <div v-if="!showAll" class="carousel">
        <div class="carousel-content" :style="{ transform: `translateX(-${carouselOffset}px)` }">
          <TvShowCard
            v-for="tvShow in mediaStore.popularTvShows.slice(0, 20)"
            :key="tvShow.id"
            :tvShow="tvShow"
            class="carousel-card"
          />
        </div>
        <button v-if="mediaStore.popularTvShows.length > 0" class="nav-button prev" @click="scrollCarousel(-1)">
          <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
        </button>
        <button v-if="mediaStore.popularTvShows.length > 0" class="nav-button next" @click="scrollCarousel(1)">
          <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
        </button>
      </div>

      <div v-else class="shows-grid">
        <TvShowCard
          v-for="tvShow in mediaStore.popularTvShows"
          :key="tvShow.id"
          :tvShow="tvShow"
          class="grid-card"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import { useMediaStore } from '@/storages/mediaStore';
import TvShowCard from '@/components/TvShowCard.vue'; // Importa TvShowCard

export default {
  name: 'TvShowsCarousel',
  components: {
    TvShowCard // Registra TvShowCard
  },
  setup() {
    const mediaStore = useMediaStore();
    const showAll = ref(false);
    const carouselOffset = ref(0);
    const carouselElement = ref(null); // Ref para el elemento del carrusel

    onMounted(() => {
      mediaStore.fetchPopularTvShows();
    });

    // ... (El resto de tu lógica para el carrusel, scroll, toggleView, etc.)

    const toggleView = () => {
      showAll.value = !showAll.value;
      if (!showAll.value) { // Reset carousel position when going back
        carouselOffset.value = 0;
      }
    };

    const scrollCarousel = (direction) => {
      const cardWidth = 120 + 10; // Ancho de la tarjeta + gap
      const viewportWidth = carouselElement.value ? carouselElement.value.clientWidth : 0;
      const scrollAmount = viewportWidth > 0 ? viewportWidth : cardWidth * 5; // Scrolls by viewport or 5 cards

      if (direction === 1) {
        const maxOffset = mediaStore.popularTvShows.length * cardWidth - viewportWidth;
        carouselOffset.value = Math.min(carouselOffset.value + scrollAmount, maxOffset);
      } else {
        carouselOffset.value = Math.max(carouselOffset.value - scrollAmount, 0);
      }
    };

    return {
      mediaStore,
      showAll,
      toggleView,
      carouselOffset,
      scrollCarousel,
      carouselElement, // Exporta la ref para poder vincularla en el template
    };
  }
};
</script>

<style scoped>
/* Los estilos generales (app, carousel-header, see-all-btn, loading, error, etc.)
   se mantienen aquí.
   Los estilos específicos de .tv-show-card, .show-poster, .rating, .show-info,
   .show-title, .show-year YA ESTÁN EN TvShowCard.vue, así que se ELIMINAN de aquí.
   SOLO DEJA LOS ESTILOS DEL CAROUSEL Y DEL GRID (que usan las clases pasadas al TvShowCard).
*/

.carousel-container {
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

.carousel-card {
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
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
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
  .carousel-card {
    width: 140px;
  }
  .shows-grid {
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
  .carousel-card {
    width: 160px;
  }
  .shows-grid {
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
  .carousel-card {
    width: 180px;
  }
  .shows-grid {
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
  .shows-grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
}
</style>