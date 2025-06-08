import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Room from '../pages/Room.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/room/:roomId', component: Room }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
