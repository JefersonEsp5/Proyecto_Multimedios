// src/stores/seriesDetails.js

import { defineStore } from 'pinia';
import { getSeriesDetails, extractSeriesCast, extractSeriesCreators } from "@/services/tvdb";

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
                this.cast = extractSeriesCast(data).filter(actor => actor.image && actor.image.trim() !== "");
                this.creators = extractSeriesCreators(data);
                this.nextEpisode = data.next_episode || null;

                this.seasons = (data.seasons || []).map(season => {
                    console.log('SEASON:', season);
                    const totalEpisodes = Number(season.episode_count) || 0;
                    const watchedCount = Number(season.watched_count) || 0;

                    return {
                        ...season,
                        
                        watched_count: watchedCount,
                        total_episodes: totalEpisodes,
                        progress: totalEpisodes > 0 ? (watchedCount / totalEpisodes) * 100 : 0,
                        selected: false,
                        expanded: false,
                    };
                });

            } catch (e) {
                this.error = "Error cargando detalles de la serie.";
                console.error("Error fetching series details:", e);
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
        toggleSeasonWatched(season) {
            if (season.watched_count === season.total_episodes) {
                season.watched_count = 0;
            } else {
                season.watched_count = season.total_episodes;
            }
            console.log(`Temporada ${season.number} actualizada: ${season.watched_count}/${season.total_episodes}`);
        },
    },

    getters: {
        filteredArtworks: (state) => {
            return state.tvShow && state.tvShow.artworks
                ? state.tvShow.artworks.filter(a => !a.includesText)
                : [];
        },
        hasTrailers: (state) => state.tvShow && state.tvShow.trailers && state.tvShow.trailers.length > 0,
        hasArtworks: (state) => state.tvShow && state.tvShow.artworks && state.tvShow.artworks.length > 0,
        hasEpisodeInfo: (state) => state.nextEpisode !== null || (state.seasons && state.seasons.length > 0),
    }
});
