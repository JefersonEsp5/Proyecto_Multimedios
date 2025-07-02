import { createRouter, createWebHistory } from 'vue-router'
import Movies_View from '@/views/Movies_View.vue'
import TvShows_View from '@/views/TvShows_View.vue'
import ShowDetails from '@/views/Show_Details.vue'
import MovieDetails from '@/views/Movie_Details.vue'
import Home from '@/views/Home.vue'
import MyShows from '@/views/My_Shows.vue' // <-- NUEVO: importa tu vista
import SearchResultsView from '@/views/SearchResults.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/movies',
    name: 'Movies',
    component: Movies_View
  },
  {
    path: '/shows',
    name: 'TvShows',
    component: TvShows_View
  },
  {
    path: '/movie/:id',
    name: 'Movie_Details',
    component: MovieDetails,
    props: true
  },
  {
    path: '/tv/:id',
    name: 'Show_Details',
    component: ShowDetails,
    props: true
  },
  {
    path: '/my-shows', // <-- NUEVA RUTA
    name: 'My_Shows',
    component: MyShows
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
