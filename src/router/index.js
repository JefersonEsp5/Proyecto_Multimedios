import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import MyLibrary from '@/views/MyLibrary.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/library', name: 'MyLibrary', component: MyLibrary },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
