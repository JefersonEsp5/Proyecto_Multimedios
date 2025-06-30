// src/stores/seriesDetails.js

import { defineStore } from 'pinia';
import { getSeriesDetails, extractSeriesCast, extractSeriesCreators, getSeasonEpisodes } from "@/services/tvdb";

export const useSeriesDetailsStore = defineStore('seriesDetails', {
    state: () => ({
        tvShow: null,
        cast: [],
        creators: [],
        loading: false,
        error: null,
        activeTrailerUrl: null,
        activeImageUrl: null,
        nextEpisode: null,
        seasons: [],
    }),

    actions: {

        async fetchSeriesDetails(showId) {
            this.loading = true;
            this.error = null;
            try {
                const data = await getSeriesDetails(showId);
                this.tvShow = data || null;
                this.cast = extractSeriesCast(data); // Eliminado el filtro aquí
                this.creators = extractSeriesCreators(data);
                this.nextEpisode = data.next_episode === "" ? null : data.next_episode;

                this.seasons = (data.seasons || []).map(season => {
                    const totalEpisodes = Number(season.episode_count) || 0;
                    const watchedCount = Number(season.watched_count) || 0;

                    return {
                        ...season,
                        watched_count: watchedCount,
                        total_episodes: totalEpisodes,
                        progress: totalEpisodes > 0 ? (watchedCount / totalEpisodes) * 100 : 0,
                        expanded: false,
                        episodes: [],
                    };
                });

            } catch (e) {
                this.error = "Error cargando detalles de la serie.";
                console.error("Error fetching series details:", e);
            } finally {
                this.loading = false;
            }
        },

        async toggleSeasonExpanded(seasonId) {
            const season = this.seasons.find(s => s.id === seasonId);
            if (season) {
                season.expanded = !season.expanded;

                if (season.expanded && (!season.episodes || season.episodes.length === 0)) {
                    try {
                        const episodes = await getSeasonEpisodes(this.tvShow.id, season.number);
                        season.episodes = episodes.map(ep => ({
                            id: ep.id,
                            number: ep.number,
                            title: ep.name || ep.title || 'N/A',
                            overview: ep.overview || 'No description available.',
                        }));
                    } catch (error) {
                        console.error("Error al cargar episodios de la temporada:", error);
                    }
                }
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
        toggleSeasonWatched(season) {
            if (season.watched_count === season.total_episodes) {
                season.watched_count = 0;
            } else {
                season.watched_count = season.total_episodes;
            }
            season.progress = season.total_episodes > 0 ? (season.watched_count / season.total_episodes) * 100 : 0;
        },
    },

    getters: {
        // Artworks: Eliminamos el filtro 'includesText' para mostrar todas las imágenes.
        filteredArtworks: (state) => {
            return state.tvShow && state.tvShow.artworks
                ? state.tvShow.artworks
                : [];
        },
        hasTrailers: (state) => state.tvShow && state.tvShow.trailers && state.tvShow.trailers.length > 0,
        hasArtworks: (state) => state.tvShow && state.tvShow.artworks && state.tvShow.artworks.length > 0,
        hasEpisodeInfo: (state) => state.nextEpisode !== null || (state.seasons && state.seasons.length > 0),
        sortedAndFilteredSeasons: (state) => {
            if (!state.seasons) return [];
            return state.seasons
                .filter(season => season.type.id === 1 && season.number > 0) // Filtra "Aired Order" y excluye la Temporada 0
                .sort((a, b) => a.number - b.number);
        },
        // Nuevo getter para verificar si la serie ha finalizado
        isSeriesEnded: (state) => {
            return state.tvShow && state.tvShow.status && state.tvShow.status.name === "Ended";
        }
    }
});