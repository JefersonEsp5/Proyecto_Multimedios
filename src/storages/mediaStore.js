// src/stores/mediaStore.js
import { defineStore } from 'pinia';
import { getPopularMovies, getPopularSeries } from '@/services/tvdb'; // Asume que tvdb.js tiene estas funciones

export const useMediaStore = defineStore('media', {
  state: () => ({
    popularMovies: [],
    popularTvShows: [],
    loadingMovies: false,
    loadingTvShows: false,
    errorMovies: null,
    errorTvShows: null,
  }),
  getters: {
    // Puedes tener getters si necesitas transformar los datos antes de usarlos
  },
  actions: {
    async fetchPopularMovies() {
      if (this.loadingMovies || this.popularMovies.length > 0) {
        return;
      }
      this.loadingMovies = true;
      this.errorMovies = null;
      try {
        const movies = await getPopularMovies(); // Esta función te devuelve los datos tal cual de la API
        
        // Aplica el filtrado y luego el ordenamiento
        const filteredAndSortedMovies = movies
          .filter(movie => movie.poster && movie.poster.includes('artworks.thetvdb.com'))
          .sort((a, b) => {
            // Ordenar primero por fecha (más reciente primero)
            const dateA = new Date(a.year || a.releaseDate); // Asumo 'year' o 'releaseDate' para películas
            const dateB = new Date(b.year || b.releaseDate);

            if (dateA > dateB) return -1;
            if (dateA < dateB) return 1;

            // Si las fechas son iguales, ordenar por rating (mayor puntaje primero)
            // Asegúrate que 'rating' sea un número. Si no, necesitarás parsearlo o usar 'score' de la API.
            const ratingA = parseFloat(a.rating || a.score || 0); // Ajusta según el nombre real del campo de rating/score
            const ratingB = parseFloat(b.rating || b.score || 0);

            if (ratingA > ratingB) return -1;
            if (ratingA < ratingB) return 1;

            return 0; // Si son iguales en ambos, mantener el orden original
          })
          .slice(0, 50); // Puedes ajustar este límite si quieres cargar más para la vista "Ver todo"

        this.popularMovies = filteredAndSortedMovies;

      } catch (error) {
        console.error("Error al cargar películas populares:", error);
        this.errorMovies = "No se pudieron cargar las películas. Intenta de nuevo más tarde.";
      } finally {
        this.loadingMovies = false;
      }
    },

    async fetchPopularTvShows() {
      if (this.loadingTvShows || this.popularTvShows.length > 0) {
        return;
      }
      this.loadingTvShows = true;
      this.errorTvShows = null;
      try {
        const shows = await getPopularSeries(); // Esta función te devuelve los datos tal cual de la API

        // Aplica el filtrado y luego el ordenamiento
        const filteredAndSortedShows = shows
          .filter(show => show.poster && show.poster.includes('artworks.thetvdb.com'))
          .sort((a, b) => {
            // Ordenar primero por fecha (más reciente primero)
            const dateA = new Date(a.year || a.firstAired); // Asumo 'year' o 'firstAired' para series
            const dateB = new Date(b.year || b.firstAired);

            if (dateA > dateB) return -1;
            if (dateA < dateB) return 1;

            // Si las fechas son iguales, ordenar por rating (mayor puntaje primero)
            const ratingA = parseFloat(a.rating || a.score || 0); // Ajusta según el nombre real del campo de rating/score
            const ratingB = parseFloat(b.rating || b.score || 0);

            if (ratingA > ratingB) return -1;
            if (ratingB < ratingB) return 1;

            return 0; // Si son iguales en ambos, mantener el orden original
          })
          .slice(0, 50); // Puedes ajustar este límite

        this.popularTvShows = filteredAndSortedShows;

      } catch (error) {
        console.error("Error al cargar series populares:", error);
        this.errorTvShows = "No se pudieron cargar las series. Intenta de nuevo más tarde.";
      } finally {
        this.loadingTvShows = false;
      }
    },
  },
});