import { createRouter, createWebHistory } from 'vue-router'
import Movies_View from '@/views/Movies_View.vue'
import TvShows_View from '@/views/TvShows_View.vue'
import ShowDetails from '@/views/Show_Details.vue'
import MovieDetails from '@/views/Movie_Details.vue'

import Home from '@/views/Home.vue'
import SearchResultsView from '@/views/SearchResults.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/movies', // URL para la sección de películas
    name: 'Movies',
    component: Movies_View
  },
  {
    path: '/shows', // URL para la sección de series
    name: 'TvShows',
    component: TvShows_View
  },
  {
    path: '/movie/:id',
    name: 'Movie_Details', // <--- ¡Aquí está la clave!
    component: MovieDetails,
    props: true
  },
  {
    path: '/tv/:id',
 name: 'Show_Details', // <--- ¡Aquí está la clave para las series!
 component: ShowDetails,
 props: true
  },
  {
    path: '/search',
    name: 'SearchResults',
    component: Home,
    props: (route) => ({ query: route.query.q }),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
