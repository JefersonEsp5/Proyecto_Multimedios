<template>
  <div class="watching-card">
    <img :src="show.image" alt="Poster" class="poster" />
    <div class="info">
      <div class="title">{{ show.title }}</div>
      <div class="episode">
        <span class="new">NEW!</span>
        <span class="ep-code">{{ show.episodeCode }}</span>
        <span>{{ show.episodeTitle }}</span>
      </div>
      <div class="progress-container">
        <span>{{ show.watched }}/{{ show.total }}</span>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressWidth + '%' }"></div>
        </div>
        <span>{{ show.left }} left</span>
      </div>
      <div class="actions">
        <button class="watched-btn">Watched</button>
        <button class="summary-btn">Summary</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  show: Object
})

const progressWidth = (props.show.watched / props.show.total) * 100
</script>

<style scoped>
.watching-card {
  background: #1e1e1e;
  border-radius: 12px;
  padding: 0.6rem;
  display: flex;
  gap: 0.8rem;
  align-items: center;
}

.poster {
  width: 60px;
  height: 90px;
  object-fit: cover;
  border-radius: 8px;
}

.info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.title {
  font-weight: bold;
  margin-bottom: 0.2rem;
}

.episode {
  font-size: 0.8rem;
  color: #ccc;
  display: flex;
  gap: 0.3rem;
  align-items: center;
}

.new {
  color: #48bb78;
  font-weight: 600;
}

.ep-code {
  background: #333;
  padding: 0 5px;
  border-radius: 4px;
  font-size: 0.7rem;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  margin: 0.3rem 0;
}

.progress-bar {
  flex: 1;
  height: 5px;
  background: #333;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #9f7aea;
  border-radius: 3px;
}

.actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.2rem;
}

.watched-btn {
  background: #9f7aea;
  color: white;
  border: none;
  border-radius: 999px;
  padding: 0.2rem 0.8rem;
  font-size: 0.75rem;
}

.summary-btn {
  background: none;
  color: #ccc;
  font-size: 0.75rem;
  border: none;
}
</style>
