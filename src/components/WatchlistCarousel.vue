<template>
  <div class="carousel-section">
    <h2>Ver más tarde</h2>
    <div class="carousel">
      <div class="carousel-content">
        <div 
          v-for="movie in movies" 
          :key="movie.id" 
          class="library-card"
        >
          <img :src="movie.poster" :alt="movie.title" />
          <p>{{ movie.title }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const movies = [
  { id: 1, title: 'Barbie', poster: 'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg' },
  { id: 2, title: 'Dune', poster: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg' }
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
</style>
