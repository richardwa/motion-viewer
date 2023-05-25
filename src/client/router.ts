import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/camera/:camIndex',
      name: 'camera',
      component: () => import('@/client/views/CameraView.vue')
    },
    {
      path: '/:catchAll(.*)',
      redirect: '/camera/0'
    }
  ]
})

export default router
