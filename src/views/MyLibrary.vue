<template>
  <section class="my-library">
    <h1>Mi biblioteca</h1>

    <div class="carousel-section">
      <h2>Ver más tarde</h2>
      <div class="carousel">
        <div class="carousel-content">
          <div v-for="movie in watchlist" :key="movie.id" class="library-card">
            <img :src="movie.poster" :alt="movie.title" />
            <p>{{ movie.title }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="carousel-section">
      <h2>Visto</h2>
      <div class="carousel">
        <div class="carousel-content">
          <div v-for="movie in watched" :key="movie.id" class="library-card">
            <img :src="movie.poster" :alt="movie.title" />
            <p>{{ movie.title }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="carousel-section">
      <h2>Favoritos</h2>
      <div class="carousel">
        <div class="carousel-content">
          <div v-for="movie in favorites" :key="movie.id" class="library-card">
            <img :src="movie.poster" :alt="movie.title" />
            <p>{{ movie.title }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const watchlist = [
  {
    id: 1,
    title: "Barbie",
    poster: "https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg",
  },
  {
    id: 2,
    title: "Dune",
    poster: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
  },
];

const watched = [
  {
    id: 3,
    title: "Oppenheimer",
    poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
  },
  {
    id: 4,
    title: "The Batman",
    poster: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
  },
];

const favorites = [
  {
    id: 5,
    title: "Avatar 2",
    poster: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
  },
  {
    id: 6,
    title: "The Whale",
    poster: "https://image.tmdb.org/t/p/w500/jQ0gylJMxWSL490sy0RrPj1Lj7e.jpg",
  },
];
</script>

<style scoped>
.my-library {
  padding: 20px;
  color: white;
}

.my-library h1 {
  font-size: 28px;
  margin-bottom: 24px;
}

.carousel-section {
  margin-bottom: 40px;
}

.carousel-section h2 {
  font-size: 20px;
  margin-bottom: 10px;
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
  cursor: pointer;
  text-align: center;
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
