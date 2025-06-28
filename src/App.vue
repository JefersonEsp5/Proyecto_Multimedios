<script setup>
import Home from './views/Home.vue'
import { onMounted } from 'vue';
import { useUserStore } from './storages/user';
 import { RouterView } from 'vue-router'; // For routing

const userStore = useUserStore();

onMounted(() => {
    userStore.initializeUser();
});

</script>

<template>

<router-view />
  
</template>

<style scoped>

</style>
