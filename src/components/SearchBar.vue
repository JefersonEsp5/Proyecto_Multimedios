<template>
  <div class="search-bar">
    <input
      type="text"
      placeholder="Search"
      v-model="searchStore.searchText"
      @keyup.enter="searchStore.performSearch"
      style="font-size: 14px;"
    />
    <button @click="searchStore.performSearch">
      <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { useSearchStore } from '@/storages/search';

// Obtén una instancia de tu store de búsqueda
const searchStore = useSearchStore();

// V-model y el evento @keyup.enter se enlazan directamente a las propiedades y acciones del store.




// Función para depurar
const performAndLogSearch = () => {
  console.log('Texto de búsqueda:', searchStore.searchText); // Muestra el texto actual del input
  searchStore.performSearch(); // Llama a la acción real de búsqueda
  console.log('Resultados de búsqueda después de performSearch:', searchStore.searchResults); // Muestra los resultados (podrían estar vacíos si la llamada es asíncrona)
  console.log('¿Está cargando la búsqueda?', searchStore.loading); // Muestra el estado de carga
};

// Puedes añadir un watch para ver el searchText en tiempo real
import { watch } from 'vue';
watch(() => searchStore.searchText, (newVal) => {
  console.log('searchText ha cambiado a:', newVal);
});









</script>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  background-color: #2b2b2b; /* Color de fondo del input */
  border-radius: 25px; /* Bordes redondeados */
  padding: 8px 15px;
  width: 250px; /* Ancho fijo para escritorio */
  max-width: 100%; /* Asegura que no se desborde en móvil */
}

.search-bar input {
  flex-grow: 1;
  background: none;
  border: none;
  outline: none;
  color: white;
  font-size: 16px;
  padding: 0 10px 0 0; /* Espacio a la derecha antes del botón */
}

.search-bar input::placeholder {
  color: #aaa;
}

.search-bar button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6366f1; /* Color del icono de búsqueda */
}

.search-icon {
  width: 20px;
  height: 20px;
}

/* Media Queries para responsividad */
@media (max-width: 768px) {
  .search-bar {
    width: 100%; /* Ancho completo en móvil */
    padding: 10px 20px;
    margin-bottom: 10px; /* Espacio debajo en el menú móvil */
  }

  .search-bar input {
    font-size: 18px;
  }
}
</style>