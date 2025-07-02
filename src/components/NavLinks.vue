<template>
  <ul class="nav-links">
    <li
      :class="['nav-item', { active: activeLink === 'inicio' }]"
      @click="setActive('inicio')"
    >
      <a href="#" class="nav-link" @click.prevent="navigate('Home')">Inicio</a>
    </li>

    <li
      :class="['nav-item', { active: activeLink === 'peliculas' }]"
      @click="setActive('peliculas')"
    >
      <a href="#" class="nav-link" @click.prevent="navigate('Movies')">Películas</a>
    </li>
    <!-- <li
      :class="['nav-item', { active: activeLink === 'generos' }]"
      @click="setActive('generos')"
    >
      <a href="#" class="nav-link" @click.prevent="navigate('generos')">Géneros</a>
    </li> -->
    <li
      :class="['nav-item', { active: activeLink === 'series' }]"
      @click="setActive('series')"
    >
      <a href="#" class="nav-link" @click.prevent="navigate('TvShows')">Series</a>
    </li>
  </ul>
</template>

<script>
import { useSearchStore } from '@/storages/search';

export default {
  name: 'NavLinks',
  data() {
    return {
      activeLink: 'inicio',
    };
  },
  methods: {
    setActive(link) {
      this.activeLink = link;
    },
    navigate(routeName) {
      //  Accede al store y limpia si vas a Home
      const searchStore = useSearchStore();
      if (routeName === 'Home') {
        searchStore.clearSearchResults(); // limpia el estado
      }

      this.$emit('link-clicked', routeName);
      this.$router.push({ name: routeName });
    },
  },
};
</script>


<style scoped>
.nav-links {
  list-style: none;
  display: flex;
  flex-direction: row;
  margin: 0;
  padding: 0;
  gap: 25px;
}


.nav-item {
  position: relative;
}


.nav-link {
  position: relative; 
  display: inline-block;
  text-decoration: none;
  color: white;
  font-size: 16px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 6px;
  background-color: transparent;
  transition: background-color 0.3s ease, color 0.3s ease, border-radius 0.3s ease;
}


.nav-link:hover {
  background-color: rgba(99, 102, 241, 0.2);
  color: #6366f1;
  border-radius: 5px;
}


.nav-item.active .nav-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 100%;
  height: 2px;
  background-color: #f39c12;
  border-radius: 1px;
  transition: width 0.3s ease;
}

/* Móvil */
@media (max-width: 768px) {
  .nav-links {
    flex-direction: row;
    gap: 15px;
    align-items: flex-start;
    width: 100%;
  }

  .nav-item {
    width: 100%;
  }

  .nav-link {
    display: block;
    font-size: 18px;
    width: 100%;
  }
}
</style>
