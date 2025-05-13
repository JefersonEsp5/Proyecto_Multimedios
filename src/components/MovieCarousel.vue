<template>
  <div class="carousel-container">
    <div class="carousel-header">
      <h2>Películas recomendadas</h2>
      <button class="see-all-btn" @click="toggleShowAll">
        <span v-if="!showAllMovies">Ver todo</span>
        <span v-else>Volver</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="arrow-icon"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>
    </div>
    
    <!-- Vista principal del carrusel -->
    <div v-if="!showAllMovies" class="carousel" ref="carouselRef">
      <div class="carousel-content" :style="{ transform: `translateX(-${scrollPosition}px)` }">
        <!-- Movie Cards -->
        <div 
          v-for="movie in movies" 
          :key="movie.id" 
          class="movie-card"
          @click="selectMovie(movie)"
        >
          <div class="movie-poster">
            <div class="rating">{{ movie.rating }}</div>
            <img :src="movie.poster" :alt="movie.title" />
          </div>
          <div class="movie-title">{{ movie.title }}</div>
        </div>
      </div>
      
      <button 
        class="nav-button prev" 
        @click="scroll('prev')" 
        :class="{ 'hidden': scrollPosition <= 0 }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
      </button>
      
      <button 
        class="nav-button next" 
        @click="scroll('next')" 
        :class="{ 'hidden': scrollPosition >= maxScroll }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>
    </div>

    <!-- Vista de "Ver todo" -->
    <div v-else class="movies-grid">
      <div 
        v-for="movie in movies" 
        :key="movie.id" 
        class="movie-card grid-card"
        @click="selectMovie(movie)"
      >
        <div class="movie-poster">
          <div class="rating">{{ movie.rating }}</div>
          <img :src="movie.poster" :alt="movie.title" />
        </div>
        <div class="movie-title">{{ movie.title }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      scrollPosition: 0,
      maxScroll: 0,
      scrollAmount: 200,
      showAllMovies: false,
      movies: [
        {
          id: 1,
          title: 'Violent Night',
          rating: 7.9,
          poster: 'https://image.tmdb.org/t/p/w500/1XSYOP0JjjyMz1irihvWywro82r.jpg'
        },
        {
          id: 2,
          title: 'M3GAN',
          rating: 7.9,
          poster: 'https://image.tmdb.org/t/p/w500/d9nBoowhjiiYc4FBNtQkPY7c11H.jpg'
        },
        {
          id: 3,
          title: 'Oppenheimer',
          rating: 8.4,
          poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg'
        },
        {
          id: 4,
          title: 'Barbie',
          rating: 7.2,
          poster: 'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg'
        },
        {
          id: 5,
          title: 'Dune',
          rating: 8.0,
          poster: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg'
        },
        {
          id: 6,
          title: 'The Batman',
          rating: 7.8,
          poster: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg'
        },
        {
          id: 7,
          title: 'Avatar: The Way of Water',
          rating: 7.6,
          poster: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg'
        },
        {
          id: 8,
          title: 'Everything Everywhere All at Once',
          rating: 8.2,
          poster: 'https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg'
        },
        {
          id: 9,
          title: 'Top Gun: Maverick',
          rating: 8.3,
          poster: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg'
        },
        {
          id: 10,
          title: 'The Whale',
          rating: 7.7,
          poster: 'https://image.tmdb.org/t/p/w500/jQ0gylJMxWSL490sy0RrPj1Lj7e.jpg'
        },
        {
          id: 11,
          title: 'Black Panther: Wakanda Forever',
          rating: 7.3,
          poster: 'https://image.tmdb.org/t/p/w500/sv1xJUazXeYqALzczSZ3O6nkH75.jpg'
        },
        {
          id: 12,
          title: 'The Menu',
          rating: 7.4,
          poster: 'https://image.tmdb.org/t/p/w500/fPtUgMcLIboqlTlPrq0bQpKK8eq.jpg'
        }
      ]
    };
  },
  mounted() {
    this.updateMaxScroll();
    window.addEventListener('resize', this.updateMaxScroll);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateMaxScroll);
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
    selectMovie(movie) {
      console.log('Película seleccionada:', movie);
      // Aquí puedes implementar la navegación a la página de detalles de la película
    },
    toggleShowAll() {
      this.showAllMovies = !this.showAllMovies;
      // Resetear la posición del scroll cuando volvemos a la vista de carrusel
      if (!this.showAllMovies) {
        this.scrollPosition = 0;
        this.$nextTick(() => {
          this.updateMaxScroll();
        });
      }
    }
  }
}
</script>

<style scoped>
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

.movie-card {
  cursor: pointer;
  transition: transform 0.2s;
  position: relative;
}

.movie-card:hover {
  transform: scale(1.05);
  z-index: 2; /* Asegura que la tarjeta ampliada esté por encima de las demás */
}

/* Estilo para el póster de la película - CLAVE PARA UNIFORMIDAD */
.movie-poster {
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  background-color: #0a0a0a; /* Fondo oscuro para imágenes que no cargan */
}

/* Técnica para forzar proporción 2:3 */
.movie-poster::before {
  content: "";
  display: block;
  padding-top: 150%; /* Proporción 2:3 (altura = 1.5 × ancho) */
}

.movie-poster img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* Mantiene la proporción y cubre todo el contenedor */
  object-position: center; /* Centra la imagen */
}

/* Estilo para la calificación */
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

/* Estilos del carrusel */
.carousel {
  position: relative;
  overflow: hidden;
  padding: 0 5px; /* Añadimos padding para evitar que los botones de navegación se superpongan */
}

.carousel-content {
  display: flex;
  transition: transform 0.5s ease;
  /* Importante: Añadimos espacio entre las tarjetas */
  gap: 10px;
}

.carousel .movie-card {
  width: 120px; /* Tamaño más pequeño para móviles */
  flex-shrink: 0; /* Evita que las tarjetas se compriman */
  /* Eliminamos el margin-right ya que ahora usamos gap */
  margin-right: 0;
}

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

/* Estilos de la vista "Ver todo" */
.movies-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2 columnas en móvil */
  gap: 15px; /* Espacio uniforme entre elementos de la cuadrícula */
}

/* Estilos específicos para las tarjetas en la vista de cuadrícula */
.grid-card {
  width: 100%;
  margin-bottom: 0; /* Eliminamos el margen inferior ya que usamos gap */
}

/* Media queries para diferentes tamaños de pantalla */
@media (min-width: 480px) {
  .carousel .movie-card {
    width: 140px;
  }
  
  .movies-grid {
    grid-template-columns: repeat(3, 1fr); /* 3 columnas en tablets pequeñas */
  }
  
  .carousel-header h2 {
    font-size: 20px;
  }
  
  .nav-button {
    width: 36px;
    height: 36px;
  }
  
  /* Aumentamos el espacio entre tarjetas para pantallas más grandes */
  .carousel-content {
    gap: 12px;
  }
}

@media (min-width: 768px) {
  .carousel .movie-card {
    width: 160px;
  }
  
  .movies-grid {
    grid-template-columns: repeat(4, 1fr); /* 4 columnas en tablets */
    gap: 20px; /* Más espacio en pantallas más grandes */
  }
  
  .nav-button {
    width: 40px;
    height: 40px;
  }
  
  .nav-button svg {
    width: 20px;
    height: 20px;
  }
  
  /* Aumentamos aún más el espacio entre tarjetas */
  .carousel-content {
    gap: 15px;
  }
}

@media (min-width: 1024px) {
  .carousel .movie-card {
    width: 180px;
  }
  
  .movies-grid {
    grid-template-columns: repeat(5, 1fr); /* 5 columnas en pantallas medianas */
  }
  
  .carousel-header h2 {
    font-size: 22px;
  }
  
  /* Espacio máximo entre tarjetas para pantallas grandes */
  .carousel-content {
    gap: 16px;
  }
}

@media (min-width: 1280px) {
  .movies-grid {
    grid-template-columns: repeat(6, 1fr); /* 6 columnas en pantallas grandes */
  }
}
</style>