import { createRouter, createWebHistory } from 'vue-router'
import BlankLayout from '@/layouts/BlankLayout/Index.vue'
import DefaultLayout from '@/layouts/DefaultLayout/Index.vue'

const routes = [
  {
    path: '/',
    redirect: '/home',
    component: DefaultLayout,
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('../views/home/Index.vue'),
        meta: { title: 'nav.home' }
      },
      {
        path: '/settings',
        name: 'Settings',
        component: () => import('../views/settings/Index.vue'),
        meta: { title: 'nav.settings' }
      },
      {
        path: '/about',
        name: 'About',
        component: () => import('../views/about/Index.vue'),
        meta: { title: 'nav.about' }
      },
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/home'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - Tauri App`
  }
  next()
})

export default router