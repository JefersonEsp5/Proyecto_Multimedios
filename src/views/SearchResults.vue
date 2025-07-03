<template>
  <div class="search-results app-view">

    <h1 class="view-title">Resultados de Búsqueda</h1>

    <div v-if="searchStore.isSearching" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Buscando...</p>
    </div>
    <div v-else-if="searchStore.error" class="error-message">
      {{ searchStore.error }}
    </div>
    <p v-else-if="searchStore.hasResults" class="results-count">
      Se encontraron {{ searchStore.searchResults.length }} resultados para "{{ searchStore.searchText }}":
    </p>
    <p v-else-if="searchStore.searchText && !searchStore.hasResults && !searchStore.isSearching" class="no-results">
      No se encontraron resultados para "{{ searchStore.searchText }}".
    </p>
    <p v-else class="initial-message">
      Escribe algo para buscar películas o series.
    </p>

    <div v-if="searchStore.hasResults" class="movies-grid">
      <div
        v-for="item in searchStore.searchResults"
        :key="item.id"
        class="result-card grid-card"
        @click="goToDetails(item.id, item.type)"
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSearchStore } from '@/storages/search.js';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router'; // Import useRouter for navigation
import { useListsStore } from '@/storages/lists'


const props = defineProps({
  query: String
});

const searchStore = useSearchStore();
const listsStore = useListsStore()
const router = useRouter(); // Initialize the router instance

// If accessed directly with the URL /search?q=text, this ensures the search is performed.
onMounted(() => {
  if (props.query && props.query !== searchStore.searchText) {
    searchStore.searchText = props.query;
    searchStore.performSearch();
  }
});

/**
 * Navigates to the detail page of the selected item.
 * It now handles IDs that might contain prefixes like 'movie-' or 'series-'.
 * @param {string | number} id - The ID of the item (movie/series), which might contain prefixes.
 * @param {string} type - The type of the item (e.g., 'series', 'movie', 'TV Series').
 */
const goToDetails = (id, type) => {
  let cleanId = id; // Start with the original ID

  // Check if the ID is a string and contains common prefixes
  if (typeof id === 'string') {
    if (id.startsWith('movie-')) {
      cleanId = id.replace('movie-', ''); // Remove 'movie-' prefix
    } else if (id.startsWith('series-')) { // Assuming series might also have a prefix
      cleanId = id.replace('series-', ''); // Remove 'series-' prefix
    }
    // Add more conditions here if you find other prefixes in your IDs
  }

  // Now, try to parse the cleaned ID to a number
  const parsedId = Number(cleanId);

  // Validate the parsed ID: check if it's NaN or if the cleaned ID is empty/null/undefined
  if (isNaN(parsedId) || !cleanId) { 
    console.error(`Invalid ID for navigation after cleaning: original ID "${id}" (cleaned to "${cleanId}"). Cannot navigate.`);
    // Optionally, you can add user feedback here, like a toast message or redirect:
    // alert('Could not load details for this item due to an invalid ID.');
    // router.push({ name: 'Home' }); // Redirect to home page
    return; // Stop the function execution
  }

  const normalizedType = type.toLowerCase(); 

  if (normalizedType === 'series' || normalizedType === 'tv series') { 
    router.push({ name: 'Show_Details', params: { id: parsedId } });
  } else if (normalizedType === 'movie') {
    router.push({ name: 'Movie_Details', params: { id: parsedId } });
  } else {
    // If you encounter other types, this warning will help you debug.
    console.warn(`Unsupported item type for navigation: ${type}. ID: ${parsedId}`);
  }
};

// Simulation of list functions (you can use them when you connect with userStore)
const addToWatchlist = (item) => {
  console.log(`Añadir a Watchlist: ${item.title}`);
  // Example: userStore.addToList(item, 'watchlist');
};

const addToFavorites = (item) => {
  console.log(`Añadir a Favorites: ${item.title}`);
  // Example: userStore.addToList(item, 'favorites');
};
</script>

<style scoped>
/* Inherited from AllMoviesView's general layout */
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

/* Specific styles for search results */
.results-count,
.initial-message {
  text-align: center;
  font-size: 1.1rem;
  color: #ccc; /* Lighter color for consistency */
  margin-bottom: 20px;
}

/* Loading and error styles (reused from AllMoviesView) */
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

.no-results {
  color: #ccc;
  font-size: 18px;
  text-align: center;
  grid-column: 1 / -1;
  padding: 50px 0;
}

/* Grid for results (reused from AllMoviesView's .movies-grid) */
.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px; /* Spacing between cards */
}

.result-card {
  background-color: #1a1a1a; /* Darker background for cards */
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* Stronger shadow */
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease-in-out; /* Add transition for hover effect */
  cursor: pointer; /* Add cursor pointer to indicate it's clickable */
}

.result-card:hover {
  transform: translateY(-5px); /* Lift card on hover */
}

.result-poster {
  width: 100%;
  height: 225px; /* Adjusted height for a more compact card, closer to MovieCard */
  object-fit: cover;
  display: block;
}

.result-info {
  padding: 15px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  color: #e0e0e0; /* Light text color */
}

.result-info h3 {
  font-size: 1.1rem; /* Slightly smaller for consistency with MovieCard */
  margin-top: 0;
  margin-bottom: 8px; /* Reduced margin */
  color: white;
  white-space: nowrap; /* Prevent title from wrapping */
  overflow: hidden;
  text-overflow: ellipsis; /* Add ellipsis for long titles */
}

.result-info p {
  font-size: 0.85rem; /* Smaller font size */
  color: #b0b0b0; /* Slightly darker light color */
  margin-bottom: 4px; /* Reduced margin */
}

.result-info .description {
  font-size: 0.75rem; /* Even smaller for description */
  color: #909090;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Limit description to 2 lines for brevity */
  -webkit-box-orient: vertical;
  margin-bottom: 10px;
}

.button-group {
  display: flex;
  gap: 8px; /* Space between buttons */
  margin-top: auto; /* Push buttons to the bottom */
}

.result-info button {
  flex: 1; /* Make buttons take equal width */
  padding: 8px 10px;
  margin-top: 5px;
  background-color: #007bff; /* Primary blue for buttons */
  color: white;
  border: none;
  border-radius: 5px; /* Slightly more rounded corners */
  cursor: pointer;
  font-size: 0.8rem;
  transition: background-color 0.3s ease, transform 0.2s ease;
  white-space: nowrap; /* Prevent button text from wrapping */
}

.result-info button:hover {
  background-color: #0056b3; /* Darker blue on hover */
  transform: translateY(-2px); /* Slight lift on hover */
}

/* Media Queries for responsiveness (adapted from AllMoviesView) */
@media (min-width: 480px) {
  .movies-grid {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 12px;
  }
  .result-poster {
    height: 210px;
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
  .result-poster {
    height: 240px;
  }
  .result-info h3 {
    font-size: 1.2rem;
  }
}

@media (min-width: 1024px) {
  .movies-grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
  .app-view {
    padding: 30px;
  }
  .result-poster {
    height: 270px;
  }
}
</style>