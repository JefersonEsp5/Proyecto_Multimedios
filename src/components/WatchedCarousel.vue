<template>
  <div class="carousel-section">
    <h2>Visto</h2>
    <div class="carousel">
      <div class="carousel-content">
        <div 
          v-for="movie in movies" 
          :key="movie.id" 
          class="library-card"
        >
          <div class="icon-overlay watched">✔️</div>
          <img :src="movie.poster" :alt="movie.title" />
          <p>{{ movie.title }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const movies = [
  { id: 3, title: 'Oppenheimer', poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg' },
  { id: 4, title: 'The Batman', poster: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg' }
];
</script>

<style scoped>
.carousel-section {
  margin-bottom: 40px;
}

.carousel-section h2 {
  font-size: 20px;
  margin-bottom: 10px;
  color: white;
}

.carousel {
  overflow-x: auto;
  padding-bottom: 10px;
}

.carousel-content {
  display: flex;
  gap: 16px;
}

.library-card {
  width: 160px;
  flex-shrink: 0;
  text-align: center;
  position: relative;
  transition: transform 0.2s ease;
  cursor: pointer;
}

.library-card:hover {
  transform: scale(1.05);
  z-index: 1;
}


.library-card img {
  width: 100%;
  border-radius: 6px;
  object-fit: cover;
}

.library-card p {
  margin-top: 6px;
  font-size: 14px;
  color: white;
}

.icon-overlay.watched {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 16px;
  padding: 2px 6px;
  border-radius: 50%;
  color: white;
}
</style>
