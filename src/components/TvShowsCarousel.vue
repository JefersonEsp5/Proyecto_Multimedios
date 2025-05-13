<template>
  <div class="app">
    <!-- Vista principal del carrusel -->
    <div v-if="!showAllShows" class="carousel-container">
      <div class="carousel-header">
        <h2>Series de TV populares</h2>
        <button class="see-all-btn" @click="toggleShowAll">
          <span>Ver todo</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="arrow-icon"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
      
      <div class="carousel" ref="carouselRef">
        <div class="carousel-content" :style="{ transform: `translateX(-${scrollPosition}px)` }">
          <!-- TV Show Cards -->
          <div 
            v-for="show in tvShows" 
            :key="show.id" 
            class="show-card"
            @click="selectShow(show)"
          >
            <div class="show-poster">
              <div class="rating">{{ show.rating }}</div>
              <img :src="show.poster" :alt="show.title" />
            </div>
            <div class="show-title">{{ show.title }}</div>
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
    </div>

    <!-- Vista de "Ver todo" -->
    <div v-else class="all-shows-container">
      <div class="carousel-header">
        <h2>Todas las series</h2>
        <button class="see-all-btn" @click="toggleShowAll">
          <span>Volver</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="arrow-icon"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
      </div>
      
      <div class="shows-grid">
        <div 
          v-for="show in tvShows" 
          :key="show.id" 
          class="show-card grid-card"
          @click="selectShow(show)"
        >
          <div class="show-poster">
            <div class="rating">{{ show.rating }}</div>
            <img :src="show.poster" :alt="show.title" />
          </div>
          <div class="show-title">{{ show.title }}</div>
        </div>
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
      showAllShows: false,
      tvShows: [
        {
          id: 1,
          title: 'Westworld',
          rating: 7.9,
          poster: 'https://image.tmdb.org/t/p/w500/8MfgyFHf7XEboZJPZXveLJgipn.jpg'
        },
        {
          id: 2,
          title: 'Servant',
          rating: 7.9,
          poster: 'https://image.tmdb.org/t/p/w500/aeJ7rg7nLpFRNT1BwP17GpXo4Gq.jpg'
        },
        {
          id: 3,
          title: 'Wednesday',
          rating: 7.9,
          poster: 'https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg'
        },
        {
          id: 4,
          title: 'Severance',
          rating: 8.2,
          poster: 'https://image.tmdb.org/t/p/w500/8LHNnMA9xP6sUhkma7mLUZkCgvq.jpg'
        },
        {
          id: 5,
          title: 'The Last of Us',
          rating: 8.7,
          poster: 'https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg'
        },
        {
          id: 6,
          title: 'Stranger Things',
          rating: 8.5,
          poster: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg'
        },
        {
          id: 7,
          title: 'The Mandalorian',
          rating: 8.4,
          poster: 'https://image.tmdb.org/t/p/w500/eU1i6eHXlzMOlEq0ku1Rzq7Y4wA.jpg'
        },
        {
          id: 8,
          title: 'House of the Dragon',
          rating: 8.3,
          poster: 'https://image.tmdb.org/t/p/w500/z2yahl2uefxDCl0nogcRBstwruJ.jpg'
        },
        {
          id: 9,
          title: 'The Boys',
          rating: 8.4,
          poster: 'https://image.tmdb.org/t/p/w500/stTEycfG9928HYGEISBFaG1ngjM.jpg'
        },
        {
          id: 10,
          title: 'Breaking Bad',
          rating: 9.0,
          poster: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg'
        },
        {
          id: 11,
          title: 'The Witcher',
          rating: 8.1,
          poster: 'https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg'
        },
        {
          id: 12,
          title: 'Succession',
          rating: 8.6,
          poster: 'https://image.tmdb.org/t/p/w500/5cmScYW6jmgKYL0jO0wfDlXWZYG.jpg'
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
    selectShow(show) {
      console.log('Serie seleccionada:', show);
      // Aquí puedes implementar la navegación a la página de detalles de la serie
    },
    toggleShowAll() {
      this.showAllShows = !this.showAllShows;
      // Resetear la posición del scroll cuando volvemos a la vista de carrusel
      if (!this.showAllShows) {
        this.scrollPosition = 0;
        this.$nextTick(() => {
          this.updateMaxScroll();
        });
      }
    }
  }
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #141414;
  color: white;
}

.app {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px;
  box-sizing: border-box;
}

/* Estilos compartidos */
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

.show-card {
  cursor: pointer;
  transition: transform 0.2s;
  position: relative;
}

.show-card:hover {
  transform: scale(1.05);
  z-index: 2; /* Asegura que la tarjeta ampliada esté por encima de las demás */
}

/* Estilo para el póster de la serie - CLAVE PARA UNIFORMIDAD */
.show-poster {
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  background-color: #0a0a0a; /* Fondo oscuro para imágenes que no cargan */
}

/* Técnica para forzar proporción 2:3 */
.show-poster::before {
  content: "";
  display: block;
  padding-top: 150%; /* Proporción 2:3 (altura = 1.5 × ancho) */
}

.show-poster img {
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

.show-title {
  margin-top: 8px;
  font-size: 14px;
  font-weight: 500;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Estilos del carrusel */
.carousel-container {
  width: 100%;
  margin-bottom: 32px;
}

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

.carousel .show-card {
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
.all-shows-container {
  width: 100%;
}

.shows-grid {
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
  .carousel .show-card {
    width: 140px;
  }
  
  .shows-grid {
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
  .app {
    padding: 15px;
  }
  
  .carousel .show-card {
    width: 160px;
  }
  
  .shows-grid {
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
  .app {
    padding: 20px;
  }
  
  .carousel .show-card {
    width: 180px;
  }
  
  .shows-grid {
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
  .shows-grid {
    grid-template-columns: repeat(6, 1fr); /* 6 columnas en pantallas grandes */
  }
}
</style>