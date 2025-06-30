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
        const result = await tursoClient.execute({
          sql: "SELECT type, series_id FROM lists WHERE user_id = ?",
          args: [userStore.userId]
        })
        // Limpia y organiza
        this.watchlist = []
        this.watched = []
        this.favorites = []

        result.rows.forEach(row => {
          if (row[0] === 'watchlist') this.watchlist.push(row[1])
          if (row[0] === 'watched') this.watched.push(row[1])
          if (row[0] === 'favorites') this.favorites.push(row[1])
        })

        console.log("Listas cargadas desde Turso:", this.watchlist, this.watched, this.favorites)
      } catch (err) {
        console.error("Error cargando listas desde Turso:", err)
      }
    },

    async addToList(type, seriesId) {
      const userStore = useUserStore()
      if (!userStore.userId) {
        console.error("No hay userId disponible.")
        return
      }

      // Añade local
      if (type === 'watchlist' && !this.watchlist.includes(seriesId)) this.watchlist.push(seriesId)
      if (type === 'watched' && !this.watched.includes(seriesId)) this.watched.push(seriesId)
      if (type === 'favorites' && !this.favorites.includes(seriesId)) this.favorites.push(seriesId)

      try {
        await tursoClient.execute({
          sql: "INSERT INTO lists (user_id, type, series_id) VALUES (?, ?, ?)",
          args: [userStore.userId, type, seriesId]
        })
        console.log(`Serie ${seriesId} añadida a ${type} en Turso.`)
      } catch (err) {
        console.error(`Error al agregar serie a ${type}:`, err)
      }
    },

    async removeFromList(type, seriesId) {
    const userStore = useUserStore()
    if (!userStore.userId) {
        console.error("No hay userId disponible.")
        return
    }

    if (type === 'watchlist') this.watchlist = this.watchlist.filter(id => id !== seriesId)
    if (type === 'watched') this.watched = this.watched.filter(id => id !== seriesId)
    if (type === 'favorites') this.favorites = this.favorites.filter(id => id !== seriesId)

    try {
        await tursoClient.execute({
        sql: "DELETE FROM lists WHERE user_id = ? AND type = ? AND series_id = ?",
        args: [userStore.userId, type, seriesId]
        })
        console.log(`Serie ${seriesId} removida de ${type} en Turso.`)
    } catch (err) {
        console.error(`Error al eliminar serie de ${type}:`, err)
    }
  },        


  }
})
