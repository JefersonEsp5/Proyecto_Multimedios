<script setup>
import Footer from './components/Footer.vue'
</script>

<template>
  <div class="app">
    <router-view />
    <Footer />
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Para que el contenido ocupe espacio y el footer baje */
router-view {
  flex: 1;
}
</style>
