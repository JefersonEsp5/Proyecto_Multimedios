import { createRouter, createWebHistory } from 'vue-router'
import ShowDetails from '@/views/Show_Details.vue'
import MovieDetails from '@/views/Movie_Details.vue'

import Home from '@/views/Home.vue'

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
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
