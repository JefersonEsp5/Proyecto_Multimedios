<template>
  <div class="app-view">

    <MovieNavbar />

    <h1 class="view-title">Todas las Series</h1>

    <div v-if="mediaStore.loadingTvShows" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Cargando todas las series...</p>
    </div>
    <div v-else-if="mediaStore.errorTvShows" class="error-message">
      {{ mediaStore.errorTvShows }}
    </div>
    <div v-else class="tv-shows-grid">
      <TvShowCard
        v-for="tvShow in mediaStore.popularTvShows"
        :key="tvShow.id"
        :tvShow="tvShow"
        class="grid-card"
      />
      <p v-if="mediaStore.popularTvShows.length === 0" class="no-results">
        No se encontraron series.
      </p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useMediaStore } from '@/storages/mediaStore';
import TvShowCard from '@/components/TvShowCard.vue';
import MovieNavbar from '@/components/MovieNavBar.vue'

const mediaStore = useMediaStore();

onMounted(() => {
  // Asegurarse de que las series estén cargadas cuando se accede a esta vista
  mediaStore.fetchPopularTvShows();
});
</script>

<style scoped>
/* Contenedor principal de la vista */
.app-view {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
}

.view-title {
  font-size: 28px;
  font-weight: 700;
  color: white;
  margin-bottom: 30px;
  text-align: center;
}

/* Estilos de la cuadrícula de series */
.tv-shows-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px; /* Espacio entre las tarjetas */
}

.grid-card {
  /* No necesitamos estilos aquí, ya que TvShowCard.vue y el grid parent los manejan */
}

.no-results {
  color: #ccc;
  font-size: 18px;
  text-align: center;
  grid-column: 1 / -1;
  padding: 50px 0;
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
  margin: 20px auto;
  max-width: 400px;
}

/* Media Queries para la responsividad del grid */
@media (min-width: 480px) {
  .tv-shows-grid {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 12px;
  }
}

@media (min-width: 768px) {
  .tv-shows-grid {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 20px;
  }
  .view-title {
    font-size: 32px;
  }
}

@media (min-width: 1024px) {
  .tv-shows-grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
  .app-view {
    padding: 30px;
  }
}
</style>