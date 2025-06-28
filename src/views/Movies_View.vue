<template>
  <div class="app-view">

    <MovieNavbar />

    <h1 class="view-title">Todas las Películas</h1>

    <div v-if="mediaStore.loadingMovies" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Cargando todas las películas...</p>
    </div>
    <div v-else-if="mediaStore.errorMovies" class="error-message">
      {{ mediaStore.errorMovies }}
    </div>
    <div v-else class="movies-grid">
      <MovieCard
        v-for="movie in mediaStore.popularMovies"
        :key="movie.id"
        :movie="movie"
        class="grid-card"
      />
      <p v-if="mediaStore.popularMovies.length === 0" class="no-results">
        No se encontraron películas.
      </p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useMediaStore } from '@/storages/mediaStore';
import MovieCard from '@/components/MovieCard.vue';
import MovieNavbar from '@/components/MovieNavBar.vue'

const mediaStore = useMediaStore();

onMounted(() => {
  // Asegurarse de que las películas estén cargadas cuando se accede a esta vista
  mediaStore.fetchPopularMovies();
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

/* Estilos de la cuadrícula de películas */
.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px; /* Espacio entre las tarjetas */
}

.grid-card {
  /* No necesitamos estilos aquí, ya que MovieCard.vue y el grid parent los manejan */
  /* Esta clase es solo para referencia en el template si necesitas un estilo específico de cuadrícula */
}

.no-results {
  color: #ccc;
  font-size: 18px;
  text-align: center;
  grid-column: 1 / -1; /* Para que el mensaje ocupe todo el ancho del grid */
  padding: 50px 0;
}

/* Loading y error styles (se pueden centralizar en un futuro) */
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
  .movies-grid {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 12px;
  }
}

@media (min-width: 768px) {
  .movies-grid {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 20px;
  }
  .view-title {
    font-size: 32px;
  }
}

@media (min-width: 1024px) {
  .movies-grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
  .app-view {
    padding: 30px;
  }
}
</style>