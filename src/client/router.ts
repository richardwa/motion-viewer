import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/camera/:key',
      name: 'camera',
      component: () => import('@/client/views/CameraView.vue')
    },
    {
      path: '/:catchAll(.*)',
      redirect: '/camera/doorbell'
    }
  ]
})

export default router
