import { defineStore } from 'pinia';
import { getMovieDetails, extractMovieCast, extractMovieCreators } from "@/services/tvdb";

export const useMovieDetailsStore = defineStore('movieDetails', {
    state: () => ({
        movie: null,
        cast: [],
        creators: [],
        loading: false,
        error: null,
        activeTrailerUrl: null,
        activeImageUrl: null,
    }),

    actions: {
        async fetchMovieDetails(movieId) {
            this.loading = true;
            this.error = null;
            try {
                const data = await getMovieDetails(movieId);

                this.movie = data || null;

                // Aquí metes el console.log
                console.log("Datos de la película/serie en el store:", this.movie);
                console.log("Trailers recibidos:", this.movie.trailers); // Asegúrate de que 'trailers' sea la propiedad correcta

                this.cast = extractMovieCast(data).filter(
                    (actor) => actor.image && actor.image.trim() !== ""
                );
                this.creators = extractMovieCreators(data);

            } catch (e) {
                this.error = "Error cargando detalles de la película.";
                console.error("Error fetching movie details:", e);
            } finally {
                this.loading = false;
            }
        },

        openTrailer(url) {
            this.activeTrailerUrl = url;
        },
        closeTrailer() {
            this.activeTrailerUrl = null;
        },
        openImage(url) {
            this.activeImageUrl = url;
        },
        closeImage() {
            this.activeImageUrl = null;
        },
    },

    getters: {
        filteredArtworks: (state) => {
            return state.movie && state.movie.artworks
                ? state.movie.artworks.filter((a) => !a.includesText)
                : [];
        },
        hasTrailers: (state) => state.movie && state.movie.trailers && state.movie.trailers.length > 0,
        hasArtworks: (state) => state.movie && state.movie.artworks && state.movie.artworks.length > 0,
    }
});