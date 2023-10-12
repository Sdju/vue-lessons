import { defineStore } from 'pinia'
import {useStorage} from '@vueuse/core';
import {watch, watchEffect} from 'vue';
import {useRoute, useRouter} from 'vue-router';

export const useAuth = defineStore('auth', () => {
  const isAuth = useStorage('my::auth', true)
  const route = useRoute()
  const router = useRouter()

  watch(isAuth, (isAuth) => {
    if (route.meta.authRequired && !isAuth) {
      router.push('/')
    }
  })

  return { isAuth }
})
