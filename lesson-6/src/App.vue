<script setup lang="ts">
import MessagesList from '@/MessagesList.vue';
import {useChat} from '@/stores/chat';
import {useRoute, useRouter} from 'vue-router';
import {useAuth} from '@/stores/auth';
import {watchEffect} from 'vue';
import {isLoading} from '@/router';

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

</script>

<template>
  <div>
    <RouterLink :to="{ name: 'home' }">
      Home
    </RouterLink>
    <RouterLink :to="{ name: 'about' }">
      About
    </RouterLink>

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

    <MessagesList />
    <button @click="chat.addMessage()">
      Send Message
    </button>
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

header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
