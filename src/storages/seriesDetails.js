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
        seasonEpisodesCache: {} // Cache para episodios por temporada
    }),

    actions: {
        async fetchSeriesDetails(showId) {
            this.loading = true;
            this.error = null;
            try {
                // 1. Obtener datos básicos de la serie
                const data = await getSeriesDetails(showId);
                console.log("Datos extendidos de la serie:", data);
                
                this.tvShow = data || null;
                this.cast = extractSeriesCast(data);
                this.creators = extractSeriesCreators(data);
                this.nextEpisode = data.next_episode === "" ? null : data.next_episode;
                
                // Inicializar caché si es necesario
                this.seasonEpisodesCache = this.seasonEpisodesCache || {};
                
                // 2. Procesar temporadas
                this.seasons = (data.seasons || [])
                    .filter(season => season.type.id === 1 && season.number > 0) // Filtra "Aired Order" y excluye Temporada 0
                    .sort((a, b) => a.number - b.number)
                    .map(season => ({
                        ...season,
                        id: season.id,
                        watched_count: Number(season.watched_count) || 0,
                        total_episodes: Number(season.episode_count) || 0,
                        progress: season.episode_count > 0 ? 
                            ((season.watched_count || 0) / season.episode_count) * 100 : 0,
                        expanded: false,
                        episodes: [],
                        loadingEpisodes: false,
                        episode_count: season.episode_count // Mantener el conteo original
                    }));

                console.log("Temporadas procesadas:", this.seasons);

            } catch (e) {
                this.error = "Error cargando detalles de la serie.";
                console.error("Error fetching series details:", e);
            } finally {
                this.loading = false;
            }
        },

        async loadSeasonEpisodes(seriesId, seasonNumber) {
            if (!seriesId || isNaN(seasonNumber)) {
                console.error("Parámetros inválidos para cargar episodios");
                return [];
            }

            const cacheKey = `${seriesId}-${seasonNumber}`;
            
            // Verificar caché primero
            if (this.seasonEpisodesCache[cacheKey]) {
                console.log(`Usando episodios en caché para temporada ${seasonNumber}`);
                return this.seasonEpisodesCache[cacheKey];
            }

            const season = this.seasons.find(s => s.number === seasonNumber);
            if (!season) {
                console.error(`No se encontró la temporada ${seasonNumber}`);
                return [];
            }

            season.loadingEpisodes = true;
            
            try {
                console.log(`Cargando episodios para temporada ${seasonNumber}...`);
                const episodes = await getSeasonEpisodes(seriesId, seasonNumber);
                
                // Procesar la estructura de episodios según la API
                const processedEpisodes = episodes.map(ep => ({
                    id: ep.id,
                    number: ep.number,
                    season_number: ep.seasonNumber,
                    title: ep.name || `Episodio ${ep.number}`,
                    overview: ep.overview || 'Descripción no disponible',
                    aired: ep.aired,
                    image: ep.image,
                    runtime: ep.runtime
                }));

                console.log(`Episodios procesados para temporada ${seasonNumber}:`, processedEpisodes.length);

                // Actualizar la temporada
                season.episodes = processedEpisodes;
                
                // Actualizar caché
                this.seasonEpisodesCache = {
                    ...this.seasonEpisodesCache,
                    [cacheKey]: processedEpisodes
                };

                return processedEpisodes;
            } catch (error) {
                console.error(`Error cargando episodios para temporada ${seasonNumber}:`, error);
                season.episodes = [];
                return [];
            } finally {
                season.loadingEpisodes = false;
            }
        },

        async toggleSeasonExpanded(season) {
            if (!season) return;
            
            // Si se está expandiendo y no tiene episodios cargados
            if (!season.expanded && (!season.episodes || season.episodes.length === 0)) {
                await this.loadSeasonEpisodes(this.tvShow.id, season.number);
            }
            season.expanded = !season.expanded;
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
            season.progress = season.total_episodes > 0 ? 
                (season.watched_count / season.total_episodes) * 100 : 0;
        },
    },

    getters: {
        filteredArtworks: (state) => state.tvShow?.artworks || [],
        hasTrailers: (state) => state.tvShow?.trailers?.length > 0,
        hasArtworks: (state) => state.tvShow?.artworks?.length > 0,
        hasEpisodeInfo: (state) => state.nextEpisode !== null || (state.seasons?.length > 0),
        
        sortedAndFilteredSeasons: (state) => {
            if (!state.seasons) return [];
            return [...state.seasons]
                .filter(season => season.type.id === 1 && season.number > 0)
                .sort((a, b) => a.number - b.number);
        },
        
        isSeriesEnded: (state) => {
            return state.tvShow?.status?.name === "Ended";
        }
    }
});