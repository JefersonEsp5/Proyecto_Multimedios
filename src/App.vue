<script setup>
import Home from './views/Home.vue'
import Footer from './components/Footer.vue'

</script>

<template>
  <div class="app">
    <Home />
    <Footer />
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* que tome al menos el alto completo de la ventana */
}
</style>

