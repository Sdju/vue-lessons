<script setup lang="ts">
import {useChat} from '@/stores/chat';
import {useRoute, useRouter} from 'vue-router';
import {useAuth} from '@/stores/auth';
import {ref, watchEffect} from 'vue';
import {isLoading} from '@/router';
import MyButton from '@/components/MyButton.vue';

const chat = useChat()
const auth = useAuth()

const route = useRoute()
const router = useRouter()

watchEffect(() => {
  console.log('route change')
  console.log(router.currentRoute.value)
  router.isReady().then(() => {
    console.log('im ready')
  })
})

const show = ref(false)

</script>

<template>
  <div>
    <RouterLink :to="{ name: 'home' }">
      Home
    </RouterLink>
    <RouterLink :to="{ name: 'about' }">
      About
    </RouterLink>

    <br>

    <button @click="auth.isAuth = !auth.isAuth">
      {{ auth.isAuth ? 'Log out' : 'Log in' }}
    </button>

    <div
      v-if="auth.isAuth"
      class="chat-nav"
    >
      <RouterLink
        v-for="channel in chat.channels"
        :key="channel.id"
        :to="{ name: 'chat', params: { id: channel.id } }"
      >
        Channe {{ channel.id }}
      </RouterLink>
    </div>

    <div v-if="isLoading">
      FALLBACK
    </div>
    <RouterView />

    <br>

    <button @click="show = !show">
      Toggle
    </button>

    <div style="height: 48px">
      <Transition>
        <component :is="show ? 'a' : 'span'">
          hello
        </component>
      </Transition>
    </div>
    
    <MyButton
      @click="show = !show"
    />
    <MyButton is-link />
    <MyButton
      is-link
      href="/about"
    />
    <MyButton
      is-link
      style="color: blue"
      class="test-class"
      href="/about"
    >
      To About
    </MyButton>

    <div
      style="padding: 1em; background: #282828"
    >
      <div
        style="padding: 2em; background: #00bd7e"
        @click.once="show = !show"
      />
    </div>
  </div>
</template>

<style>

.chat-nav {
  display: flex;
  flex-direction: column;
}

.router-link-exact-active {
  color: lime;
}

body {
  background: #222222;
  color: #CCC;
  min-height: 100vh;
  width: 100%;
  margin: 0;
  font-family: sans-serif;
  font-size: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

a {
  color: #00bd7e;
  text-decoration: none;
}

button {
  background: rgb(75, 126, 40);
  border-radius: 4px;
  padding: 0.7rem 1rem;
  border: 1px solid rgb(63, 103, 35);
  color: #EEE;
  cursor: pointer;
}

p {
  margin: 0;
}

</style>
