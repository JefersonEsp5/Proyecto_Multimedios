<template>
  <div class="search-results">
    <p v-if="searchStore.isSearching" class="loading-message">Buscando...</p>
    <p v-else-if="searchStore.error" class="error-message">{{ searchStore.error }}</p>
    <p v-else-if="searchStore.hasResults" class="results-count">
      Se encontraron {{ searchStore.searchResults.length }} resultados:
    </p>
    <p v-else-if="searchStore.searchText && !searchStore.hasResults && !searchStore.isSearching">
      No se encontraron resultados para "{{ searchStore.searchText }}".
    </p>
    <p v-else class="initial-message">
      Escribe algo para buscar películas o series.
    </p>

    <div v-if="searchStore.hasResults" class="results-grid">
      <div
        v-for="item in searchStore.searchResults"
        :key="item.id"
        class="result-card"
      >
        <img
          :src="item.poster || 'https://via.placeholder.com/300x450?text=No+Poster'"
          :alt="item.title"
          class="result-poster"
        />
        <div class="result-info">
          <h3>{{ item.title }} ({{ item.type }})</h3>
          <p>Año: {{ item.year }}</p>
          <p>Puntuación: {{ item.rating }}</p>
          <p class="description">{{ item.description }}</p>
          <button @click="addToWatchlist(item)">+ Watchlist</button>
          <button @click="addToFavorites(item)">+ Favorites</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSearchStore } from '@/storages/search.js';
import { onMounted } from 'vue';
const props = defineProps({
  query: String
});

const searchStore = useSearchStore();

// Si se accede directamente con la URL /search?q=texto, esto asegura que se haga la búsqueda.
onMounted(() => {
  if (props.query && props.query !== searchStore.searchText) {
    searchStore.searchText = props.query;
    searchStore.performSearch(); // No necesita router aquí, solo recupera resultados
  }
});

// Simulación de funciones para listas (cuando conectes con userStore las puedes usar)
const addToWatchlist = (item) => {
  console.log(`Añadir a Watchlist: ${item.title}`);
  // userStore.addToList(item, 'watchlist');
};

const addToFavorites = (item) => {
  console.log(`Añadir a Favorites: ${item.title}`);
  // userStore.addToList(item, 'favorites');
};
</script>


<style scoped>
.search-results {
  margin-top: 20px;
}

.loading-message,
.error-message,
.results-count,
.initial-message {
  text-align: center;
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 20px;
}

.error-message {
  color: #dc3545;
  font-weight: bold;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.result-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.result-poster {
  width: 100%;
  height: 350px; /* Altura fija para las imágenes */
  object-fit: cover; /* Asegura que la imagen cubra el área */
  display: block;
}

.result-info {
  padding: 15px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.result-info h3 {
  font-size: 1.3rem;
  margin-top: 0;
  margin-bottom: 10px;
  color: #333;
}

.result-info p {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 5px;
}

.result-info .description {
  font-size: 0.85rem;
  color: #777;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Limita la descripción a 3 líneas */
  -webkit-box-orient: vertical;
  margin-bottom: 10px;
}

.result-info button {
  padding: 8px 12px;
  margin-top: 5px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
}

.result-info button:hover {
  background-color: #218838;
}
</style>