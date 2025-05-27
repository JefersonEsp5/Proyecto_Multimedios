<template>
  <section class="continue-watching">
    <h2>Seguir viendo</h2>
    <div class="watching-carousel">
      <div
        v-for="item in watchingList"
        :key="item.id"
        class="watching-card"
        @click="resume(item)"
      >
        <div class="thumbnail">
          <img :src="item.backdrop" :alt="item.title" />
          <div class="progress-bar">
            <div class="progress" :style="{ width: item.progress + '%' }"></div>
          </div>
        </div>
        <div class="title">{{ item.title }}</div>
      </div>
    </div>
  </section>
</template>

<script setup>
const watchingList = [
  {
    id: 1,
    title: "The Last Of Us",
    backdrop: "https://image.tmdb.org/t/p/original/uQ4lG7E7mlyKsGvbASftQ6Hu2IX.jpg",
    progress: 65,
  },
  {
    id: 2,
    title: "Thunderbolts*",
    backdrop: "https://image.tmdb.org/t/p/original/o74jujryamQ0Woyi9ekXfmdJ5P1.jpg",
    progress: 40,
  },
  {
    id: 3,
    title: "Mission: Impossible - Dead Reckoning Part One",
    backdrop: "https://image.tmdb.org/t/p/original/TFTfzrkX8L7bAKUcch6qLmjpLu.jpg",
    progress: 80,
  },
];

function resume(item) {
  console.log("Reanudar:", item.title);
}
</script>

<style scoped>
.continue-watching {
  margin: 40px 0;
}

.continue-watching h2 {
  color: white;
  font-size: 20px;
  margin-bottom: 10px;
}

.watching-carousel {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 10px;
}

.watching-card {
  width: 240px;
  flex-shrink: 0;
  cursor: pointer;
  color: white;
  transition: transform 0.2s;
}

.watching-card:hover {
  transform: scale(0.99);
}

.thumbnail {
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  background-color: #0a0a0a;
  aspect-ratio: 16 / 9;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.progress-bar {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 6px;
  background-color: rgba(255, 255, 255, 0.2);
}

.progress {
  height: 100%;
  background-color: red;
}

.title {
  margin-top: 6px;
  font-size: 14px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
