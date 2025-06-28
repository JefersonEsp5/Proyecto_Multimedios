<template>
  <div class="tv-show-card" @click="goToDetails">
    <div class="show-poster">
      <img
        :src="posterUrl"
        :alt="tvShow.title || 'Póster de serie'"
        @error="onImageError"
        :class="{ 'error-poster': imageError }"
      />
      <span class="rating">{{ tvShow.siteRating?.toFixed(1) || 'N/A' }}</span>
    </div>
    <div class="show-info">
      <h3 class="show-title">{{ tvShow.title }}</h3>
      <p class="show-year">{{ tvShow.year || 'Año desconocido' }}</p>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'TvShowCard',
  props: {
    tvShow: { // Propiedad 'tvShow' en lugar de 'movie'
      type: Object,
      required: true
    }
  },
  setup(props) {
    const router = useRouter();
    const imageError = ref(false);

    const posterUrl = computed(() => {
      // Reemplaza con tu lógica para obtener la URL del póster de TheTVDB para series
      return props.tvShow.poster || props.tvShow.image; // Ajusta según la API
    });

    const onImageError = (event) => {
      imageError.value = true;
      event.target.src = '/placeholders/tvshow-placeholder.png'; // Ruta a tu imagen de placeholder
    };

    const goToDetails = () => {
      router.push({ name: 'ShowDetails', params: { id: props.tvShow.id } });
    };

    return {
      posterUrl,
      onImageError,
      imageError,
      goToDetails
    };
  }
};
</script>

<style scoped>
/* Estilos para una sola TV Show Card */
.tv-show-card {
  cursor: pointer;
  transition: transform 0.2s;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.tv-show-card:hover {
  transform: scale(1.05);
  z-index: 2;
}

.show-poster { /* Usar 'show-poster' en lugar de 'movie-poster' */
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  background-color: #0a0a0a;
  flex-shrink: 0;
  width: 100%;
}

.show-poster::before {
  content: "";
  display: block;
  padding-top: 150%; /* Aspect ratio 1:1.5 */
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

.show-info { /* Usar 'show-info' en lugar de 'movie-info' */
  padding: 8px 0;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.show-title { /* Usar 'show-title' en lugar de 'movie-title' */
  font-size: 14px;
  font-weight: 500;
  color: white;
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.2;
  height: 2.4em;
}

.show-year { /* Usar 'show-year' en lugar de 'movie-year' */
  font-size: 12px;
  color: #aaa;
  margin-top: auto;
}
</style>