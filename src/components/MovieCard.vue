<template>
  <div class="movie-card">
    <div class="movie-image">
      <img :src="movie.poster" :alt="movie.title" />
      <div class="movie-rating">{{ movie.rating }}</div>
    </div>
    <div class="movie-title">{{ movie.title }}</div>
  </div>
</template>

<script setup>
defineProps({
  movie: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
.movie-card {
  width: 180px;
  margin-right: 16px;
  cursor: pointer;
  transition: transform 0.2s;
}

.movie-card:hover {
  transform: scale(1.05);
}

.movie-image {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 2/3;
}

.movie-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.movie-rating {
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 14px;
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
</style>