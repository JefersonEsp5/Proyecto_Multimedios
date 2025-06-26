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
      <a href="#" class="nav-link" @click.prevent="navigate('peliculas')">Películas</a>
    </li>
    <li
      :class="['nav-item', { active: activeLink === 'generos' }]"
      @click="setActive('generos')"
    >
      <a href="#" class="nav-link" @click.prevent="navigate('generos')">Géneros</a>
    </li>
    <li
      :class="['nav-item', { active: activeLink === 'series' }]"
      @click="setActive('series')"
    >
      <a href="#" class="nav-link" @click.prevent="navigate('series')">Series</a>
    </li>
  </ul>
</template>

<script>
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
    this.$emit('link-clicked', routeName);
    this.$router.push({ name: routeName });
  }
}

};
</script>

<style scoped>
/* Enlaces principales horizontal */
.nav-links {
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
  gap: 25px;
}

/* Cada elemento li */
.nav-item {
  position: relative;
}

/* Estilo general del enlace */
.nav-link {
  position: relative; /* Necesario para ::after */
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

/* Hover */
.nav-link:hover {
  background-color: rgba(99, 102, 241, 0.2);
  color: #6366f1;
  border-radius: 5px;
}

/* Línea inferior del activo */
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
    flex-direction: column;
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
