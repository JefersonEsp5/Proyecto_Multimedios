// src/storages/lists.js
import { defineStore } from 'pinia'
import tursoClient from '../plugins/turso'
import { useUserStore } from './user'

export const useListsStore = defineStore('lists', {
  state: () => ({
    watchlist: [],
    watched: [],
    favorites: []
  }),

  actions: {
    async loadListsFromDb() {
      const userStore = useUserStore()
      if (!userStore.userId) {
        console.error("No hay userId cargado aún.")
        return
      }

      try {
        // Limpia primero
        this.watchlist = []
        this.watched = []
        this.favorites = []

        // Cargar WATCHLIST
        const watchlistRes = await tursoClient.execute({
          sql: "SELECT show_id FROM user_watchlist WHERE user_id = ?",
          args: [userStore.userId]
        })
        this.watchlist = watchlistRes.rows.map(row => row[0])

        // Cargar WATCHED
        const watchedRes = await tursoClient.execute({
          sql: "SELECT show_id FROM user_watched WHERE user_id = ?",
          args: [userStore.userId]
        })
        this.watched = watchedRes.rows.map(row => row[0])

        // Cargar FAVORITES
        const favoritesRes = await tursoClient.execute({
          sql: "SELECT show_id FROM user_favorites WHERE user_id = ?",
          args: [userStore.userId]
        })
        this.favorites = favoritesRes.rows.map(row => row[0])

        console.log("Listas cargadas desde Turso:", {
          watchlist: this.watchlist,
          watched: this.watched,
          favorites: this.favorites
        })
      } catch (err) {
        console.error("Error cargando listas desde Turso:", err)
      }
    },

    async addToList(type, showId) {
      const userStore = useUserStore()
      if (!userStore.userId) {
        console.error("No hay userId disponible.")
        return
      }

      let table = ''
      if (type === 'watchlist') table = 'user_watchlist'
      else if (type === 'watched') table = 'user_watched'
      else if (type === 'favorites') table = 'user_favorites'
      else {
        console.error(`Tipo de lista inválido: ${type}`)
        return
      }

      try {
        await tursoClient.execute({
          sql: `INSERT INTO ${table} (user_id, show_id) VALUES (?, ?)`,
          args: [userStore.userId, showId]
        })

        // Actualiza localmente
        if (type === 'watchlist' && !this.watchlist.includes(showId)) this.watchlist.push(showId)
        if (type === 'watched' && !this.watched.includes(showId)) this.watched.push(showId)
        if (type === 'favorites' && !this.favorites.includes(showId)) this.favorites.push(showId)

        console.log(`Show ${showId} añadido a ${type} en Turso.`)
      } catch (err) {
        console.error(`Error al agregar show a ${type}:`, err)
      }
    },

    async removeFromList(type, showId) {
      const userStore = useUserStore()
      if (!userStore.userId) {
        console.error("No hay userId disponible.")
        return
      }

      let table = ''
      if (type === 'watchlist') table = 'user_watchlist'
      else if (type === 'watched') table = 'user_watched'
      else if (type === 'favorites') table = 'user_favorites'
      else {
        console.error(`Tipo de lista inválido: ${type}`)
        return
      }

      try {
        await tursoClient.execute({
          sql: `DELETE FROM ${table} WHERE user_id = ? AND show_id = ?`,
          args: [userStore.userId, showId]
        })

        // Actualiza localmente
        if (type === 'watchlist') {
          this.watchlist = this.watchlist.filter(id => id !== showId)
        }
        if (type === 'watched') {
          this.watched = this.watched.filter(id => id !== showId)
        }
        if (type === 'favorites') {
          this.favorites = this.favorites.filter(id => id !== showId)
        }

        console.log(`Show ${showId} removido de ${type} en Turso.`)
      } catch (err) {
        console.error(`Error al eliminar show de ${type}:`, err)
      }
    }
  }
})
