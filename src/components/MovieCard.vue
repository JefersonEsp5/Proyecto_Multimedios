<template>
  <div class="movie-card" @click="goToDetails">
    <div class="movie-poster">
      <img
        :src="posterUrl"
        :alt="movie.title || 'Póster de película'"
        @error="onImageError"
        :class="{ 'error-poster': imageError }"
      />
      <span class="rating">{{ movie.siteRating?.toFixed(1) || 'N/A' }}</span>
    </div>
    <div class="movie-info">
      <h3 class="movie-title">{{ movie.title }}</h3>
      <p class="movie-year">{{ movie.year || 'Año desconocido' }}</p>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'MovieCard',
  props: {
    movie: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const router = useRouter();
    const imageError = ref(false);

    const posterUrl = computed(() => {
      // Reemplaza con tu lógica para obtener la URL del póster de TheTVDB
      // Asegúrate de que 'poster' sea la propiedad correcta para la URL de la imagen
      return props.movie.poster || props.movie.image; // Ajusta según la API
    });

    const onImageError = (event) => {
      imageError.value = true;
      event.target.src = '/placeholders/movie-placeholder.png'; // Ruta a tu imagen de placeholder
    };

    const goToDetails = () => {
      router.push({ name: 'MovieDetails', params: { id: props.movie.id } });
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
/* Estilos para una sola Movie Card */
.movie-card {
  cursor: pointer;
  transition: transform 0.2s;
  position: relative;
  /* La altura la controlaremos desde el contenedor flex/grid padre */
  display: flex; /* Para flexbox en la vista de cuadrícula */
  flex-direction: column;
  height: 100%; /* Asegura que ocupe todo el espacio vertical disponible en un grid */
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
  flex-shrink: 0; /* Importante para que el póster no se encoja */
  width: 100%;
}

.movie-poster::before {
  content: "";
  display: block;
  padding-top: 150%; /* Aspect ratio 1:1.5 */
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
  object-fit: contain; /* Para que la imagen de placeholder no se recorte */
  padding: 20%; /* Para centrar el icono si es un placeholder */
  background-color: #222; /* Fondo para el placeholder */
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

.movie-info {
  padding: 8px 0;
  flex-grow: 1; /* Permite que el info block ocupe el espacio restante */
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* Alinea el contenido (titulo, año) al inicio de esta sección */
}

.movie-title {
  font-size: 14px;
  font-weight: 500;
  color: white;
  white-space: normal; /* Permite salto de línea */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Limita a 2 líneas */
  -webkit-box-orient: vertical;
  line-height: 1.2;
  height: 2.4em; /* 2 líneas * line-height */
}

.movie-year {
  font-size: 12px;
  color: #aaa;
  margin-top: auto; /* Empuja el año hacia abajo */
}
</style>