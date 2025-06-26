// src/stores/search.js
import { defineStore } from 'pinia';
import { searchMedia } from '@/services/tvdb';

export const useSearchStore = defineStore('search', {
  state: () => ({
    searchText: '',
    searchResults: [],
    loading: false,
    error: null,
  }),
  actions: {
    setSearchText(text) {
      this.searchText = text;
      console.log('Pinia: searchText updated to:', this.searchText); // Log when text changes
    },
    async performSearch() {
      if (!this.searchText.trim()) {
        this.searchResults = [];
        this.error = null;
        console.log('Pinia: Search text is empty, clearing results.');
        return;
      }

      this.loading = true;
      this.error = null;
      this.searchResults = []; // Clear previous results
      console.log('Pinia: Starting search for:', this.searchText);

      try {
        const results = await searchMedia(this.searchText);
        this.searchResults = results;
        console.log('Pinia: Search successful! Results received:', this.searchResults); // <-- IMPORTANT: Log the actual results
      } catch (err) {
        console.error('Pinia: Error performing search:', err); // Log the full error
        this.error = 'No se pudieron cargar los resultados de la búsqueda. Intenta de nuevo más tarde.';
        this.searchResults = [];
      } finally {
        this.loading = false;
        console.log('Pinia: Search finished. Loading state:', this.loading);
      }
    },
    clearSearchResults() {
      this.searchText = '';
      this.searchResults = [];
      this.error = null;
      console.log('Pinia: Search state cleared.');
    }
  },
  getters: {
    hasResults: (state) => state.searchResults.length > 0,
    isSearching: (state) => state.loading,
  },
});