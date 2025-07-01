<template>
  <div class="bottom-nav">
    <div class="nav-item">
      <v-icon name="bi-compass" scale="1.2" />
      <span>Explore</span>
    </div>
    <div class="nav-item active">
      <v-icon name="bi-collection-play" scale="1.2" />
      <span>My shows</span>
    </div>
    <div class="nav-item">
      <v-icon name="bi-calendar" scale="1.2" />
      <span>Calendar</span>
    </div>
    <div class="nav-item">
      <v-icon name="bi-bell" scale="1.2" />
      <span>Notifications</span>
    </div>
  </div>
</template>

<script setup>
// no necesita nada porque usamos <v-icon> global
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #1a1a1a;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0.6rem 0;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  box-shadow: 0 -2px 5px rgba(0,0,0,0.5);
  z-index: 100;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #aaa;
  font-size: 0.8rem;
}

.nav-item.active {
  background: rgba(159, 122, 234, 0.2);
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 9999px;
}

.nav-item.active span {
  color: white;
}

.nav-item v-icon {
  margin-bottom: 3px;
}
</style>
