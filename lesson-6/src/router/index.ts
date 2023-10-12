import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import {useAuth} from '@/stores/auth';
import {ref} from 'vue';

const Routes = {
  home: 'home',
  chat: 'chat'
} as const

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: Routes.home,
      component: HomeView,
      meta: {
        authRequired: false
      }
    },
    {
      path: '/chat/:id',
      name: 'chat',
      component: () => import('@/views/ChatView.vue').then((comp) => {
        return new Promise((resolve) => setTimeout(() => resolve(comp), 5000))
      }),
      meta: {
        chatParamId: 'id',
        authRequired: true,
        layout: 'base'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue').then((comp) => {
        return new Promise((resolve) => setTimeout(() => resolve(comp), 5000))
      }),
      meta: {
        authRequired: false,
      }
    }
  ]
})

router.beforeEach((to) => {
  const auth = useAuth()

  if (to.meta.authRequired && !auth.isAuth) {
    return '/'
  }
})

export const isLoading = ref(false)
router.beforeEach(() => {
  isLoading.value = true
})
router.afterEach(() => {
  isLoading.value = false
})

export default router
