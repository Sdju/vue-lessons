<script setup lang="ts">
import { WebSocketController } from './controller/WebSocketController'
import UserListCard from '@/components/UserListCard.vue';
import {useOnlineChat} from '@/store/useOnlineChat';
import ChatListCard from '@/components/ChatListCard.vue';
import {watchEffect} from 'vue';
import {useRouter} from 'vue-router';

const router = useRouter()
const onlineChat = useOnlineChat()

</script>

<template>
  <div :class="$style['app']">
    <header :class="$style['app__header']">
      <button @click="onlineChat.newUser()">
        Add user
      </button>
      <button @click="onlineChat.newChat()">
        Add chat
      </button>
    </header>
    
    <TransitionGroup
      :class="$style['app__sidebar']"
      name="appear"
      tag="div"
    >
      <span>
        Chats:
      </span>
      <ChatListCard
        v-for="chat in onlineChat.chats"
        :key="chat.id"
        :chat="chat"
        @click="router.push({ name: 'chat', params: { chatId: chat.id } })"
      />
    </TransitionGroup>

    <main :class="$style['app__main']">
      <RouterView />
    </main>
  </div>
</template>

<style module lang="scss">
.app {
  height: 100vh;
  width: 100vw;
  overflow-y: auto;
  overflow-x: hidden;
  background: var(--c-background);
  color: var(--c-text);

  display: grid;
  grid-template-areas:
    'header header'
    'sidebar main';
  grid-template-columns: 300px 1fr;
  grid-template-rows: auto 1fr;

  &__header {
    grid-area: header;
    background: var(--c-background-alt);
    border-bottom: 2px solid rgba(0,0,0, 0.1);

    height: 100px;
  }

  &__sidebar {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    grid-area: sidebar;
    background: var(--c-background-alt);
    overflow-y: auto;
    overflow-x: hidden;
  }

  &__main {
    grid-area: main;
    overflow-y: hidden;
  }
}
</style>

<style>
.appear-enter-active,
.appear-leave-active {
  transition: all 0.5s ease;
}
.appear-enter-from,
.appear-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>