<template>
  <div class="page-container">
    <button @click="$router.back()" class="back-button left">←</button>
    <button class="back-button right">⋮</button>

    <div v-if="loading" class="loading">Cargando detalles...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <div v-else-if="movie" class="card">
      <img :src="movie.image" :alt="movie.name" class="poster" />
      <div class="info">
        <div class="tag">TV-Peliculas</div>
        <h1 class="title">{{ movie.name }}</h1>
        <div class="rating-row">
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg" class="imdb-logo" alt="IMDb" />
          <span class="rating">{{ movie.rating || 'N/A' }}</span>
          <span class="details">• {{ movie.year || 'Desconocido' }} • {{ movie.runtime || 'No disponible' }} minutos</span>
        </div>
        <div class="genres">
          <span v-for="genre in movie.genres" :key="genre.id" class="genre-tag">{{ genre.name }}</span>
        </div>
        <p class="overview">{{ movie.overview || 'No hay descripción disponible.' }}</p>
        <p class="creators">Creadores: {{ movie.creators || 'No disponible' }}</p>
        <button class="watch-button">Start watching</button>
        <div class="actions">
          <div class="action"><i class="fas fa-bookmark icon purple"></i><span>Add to watchlist</span></div>
          <div class="action"><i class="fas fa-check-circle icon green"></i><span>Mark as watched</span></div>
          <div class="action"><i class="fas fa-star icon yellow"></i><span>Add to favorites</span></div>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
import { getMovieDetails } from "@/services/tvdb";

export default {
  name: "MovieDetails",
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      movie: null,
      loading: true,
      error: null,
    };
  },
  async created() {
    try {
      this.loading = true;
      this.error = null;

      const movieId = parseInt(this.id);
      const data = await getMovieDetails(movieId);
      this.movie = data;
    } catch (e) {
      this.error = "Error cargando detalles de la película.";
    } finally {
      this.loading = false;
    }
  },
};
</script>

<style scoped>
body, html {
  margin: 0;
  padding: 0;
  background-color: #000;
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
  font-size: 0.875rem;
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
  .page-container{
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
}

</style>


