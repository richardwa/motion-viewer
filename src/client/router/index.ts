import { createRouter, createWebHistory } from 'vue-router'
import HelloClientVue from '../views/HelloClient.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HelloClientVue
    },
    {
      path: '/helloserver',
      name: 'hello',
      component: () => import('../views/HelloServer.vue')
    }
  ]
})

export default router
