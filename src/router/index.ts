import { createRouter, createWebHistory } from 'vue-router'
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
    path: '/search', 
    name: 'SearchResults',
    component: SearchResultsView,
    // Puedes pasar props a la vista si es necesario, aunque con Pinia no es tan crucial
    props: (route) => ({ query: route.query.q }), // Ejemplo: pasar la query como prop si la URL fuera /search?q=query
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
