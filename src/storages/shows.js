import { defineStore } from 'pinia';
import { useUserStore } from './user'; // Assuming your user store is defined

export const useShowsStore = defineStore('shows', {
    state: () => ({
        watchlist: [],
        watched: [],
        favorites: [],
    }),
    actions: {
        async fetchUserShows() {
            const userStore = useUserStore();
            const userId = userStore.userId;
            if (!userId) {
                console.warn('User ID not available. Cannot fetch user shows.');
                return;
            }

            try {
                const turso = this.$turso; // Access global Turso client
                const rs = await turso.execute({
                    sql: "SELECT show_id, status FROM favorites WHERE user_id = ?",
                    args: [userId]
                });

                this.watchlist = [];
                this.watched = [];
                this.favorites = [];

                rs.rows.forEach(row => {
                    const showId = row.show_id;
                    const status = row.status;
                    // You might want to fetch full show details here or when navigating
                    // For now, just store the ID
                    if (status === 'watchlist') {
                        this.watchlist.push(showId);
                    } else if (status === 'watched') {
                        this.watched.push(showId);
                    } else if (status === 'favorites') {
                        this.favorites.push(showId);
                    }
                });
                console.log('User shows fetched from Turso.');
            } catch (error) {
                console.error('Error fetching user shows from Turso:', error);
            }
        },

        async addOrUpdateShow(showId, status) {
            const userStore = useUserStore();
            const userId = userStore.userId;
            if (!userId) {
                console.warn('User ID not available. Cannot save show.');
                return;
            }

            try {
                const turso = this.$turso;
                await turso.execute({
                    sql: "INSERT INTO favorites (user_id, show_id, status) VALUES (?, ?, ?) ON CONFLICT(user_id, show_id) DO UPDATE SET status = EXCLUDED.status",
                    args: [userId, showId, status]
                });

                // Update local state
                this.removeShowFromAllLists(showId); // Ensure it's only in one list
                if (status === 'watchlist') {
                    this.watchlist.push(showId);
                } else if (status === 'watched') {
                    this.watched.push(showId);
                } else if (status === 'favorites') {
                    this.favorites.push(showId);
                }
                console.log(`Show ${showId} moved to ${status}.`);
            } catch (error) {
                console.error('Error adding/updating show:', error);
            }
        },

        async removeShow(showId) {
            const userStore = useUserStore();
            const userId = userStore.userId;
            if (!userId) {
                console.warn('User ID not available. Cannot remove show.');
                return;
            }

            try {
                const turso = this.$turso;
                await turso.execute({
                    sql: "DELETE FROM favorites WHERE user_id = ? AND show_id = ?",
                    args: [userId, showId]
                });
                this.removeShowFromAllLists(showId);
                console.log(`Show ${showId} removed.`);
            } catch (error) {
                console.error('Error removing show:', error);
            }
        },

        removeShowFromAllLists(showId) {
            this.watchlist = this.watchlist.filter(id => id !== showId);
            this.watched = this.watched.filter(id => id !== showId);
            this.favorites = this.favorites.filter(id => id !== showId);
        }
    },

});