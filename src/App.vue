<script setup>
import Home from './views/Home.vue'
import { onMounted } from 'vue';
import { useUserStore } from './storages/user';
import { useListsStore } from '@/storages/lists'
import { RouterView } from 'vue-router'; // For routing
import MobileBottomNav from '@/components/MobileBottomNav.vue'

const userStore = useUserStore();
const listsStore = useListsStore();

onMounted(() => {
    userStore.initializeUser();
    listsStore.loadListsFromDb();
});

</script>

<template>

<router-view />
<div class="footer">
      <p>© 2025 Proyecto de Multimedios - Todos los derechos reservados</p>
</div>
<MobileBottomNav />
</template>

<style scoped>
.footer {
  background: #1a1a1a;
  color: #ccc;
  text-align: center;
  padding: 1rem;
  border-top: 2px solid #333;
}

/* ✅ Ocultar bottom nav en desktop */
@media (min-width: 768px) {
  .bottom-nav {
    display: none;
  }
}

/* ✅ Ocultar footer en mobile */
@media (max-width: 767px) {
  .footer {
    display: none;
  }
}


</style>
