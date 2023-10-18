<script setup lang="ts">

import {useOnlineChat} from '@/store/useOnlineChat';
import {computed, nextTick, ref, watch, watchEffect} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import UserListCard from '@/components/UserListCard.vue';

const route = useRoute()
const router = useRouter()
const onlineChat = useOnlineChat()

const chatId = computed(() => route.params.chatId as string)
const activeChatUsersIds = computed(() => onlineChat.activeChat?.users.map(user => user.id) || [])
const activeUsersMap = computed(() => Object.fromEntries(onlineChat.activeChat?.users.map(user => [user.id, user]) || []))
const userForAdd = computed(() => {
  if (!onlineChat.activeChat) {
    return []
  }

  return onlineChat.users.filter(user => !activeChatUsersIds.value.includes(user.id))
})

watchEffect(() => {
  onlineChat.setActiveChat(chatId.value).catch(() => {
    router.push('/')
  })
})

function getColorById(id: string) {
  const sum = id.split('').map(char => char.charCodeAt(0)).reduce((acc, code) => acc + code, 0)
  return `hsla(${sum % 100}, 100%, 50%, 1)`
}

const chatElement = ref()
const scrollToBottom = ref(true)
watch( () => onlineChat.activeChat?.messages.length,async () => {
  if (!chatElement.value || !scrollToBottom.value) {
    return
  }
  await nextTick()
  chatElement.value.$el.scrollTo(0, chatElement.value.$el.scrollHeight);
})

function onScroll(event: Event) {
  const el = chatElement.value.$el
  if ((el.clientHeight + Math.round(el.scrollTop)) >= el.scrollHeight) {
    scrollToBottom.value = true
  } else {
    scrollToBottom.value = false
  }
}

</script>

<template>
  <div :class="$style['chat']">
    <template v-if="!onlineChat.activeChat">
      Loading
    </template>
    <template v-else>
      <div :class="$style['chat__users']">
        <template v-if="onlineChat.activeChat.users.length">
          <div>
            Added users:
          </div>
          <UserListCard
            v-for="user in onlineChat.activeChat.users"
            :key="user.id"
            :user="user"
          />
        </template>

        <div>
          Add user:
        </div>
        <UserListCard
          v-for="user in userForAdd"
          :key="user.id"
          :user="user"
          @click="onlineChat.addUserToChat(chatId, user.id)"
        />
      </div>

      <TransitionGroup
        ref="chatElement"
        tag="div"
        name="appear"
        :class="$style['chat__messages']"
        @scroll="onScroll"
      >
        <div
          v-for="msg in onlineChat.activeChat.messages"
          :key="msg.id"
          :class="$style['message']"
        >
          <span :style="{color: getColorById(msg.user), marginBottom: '0.3em'}">{{ activeUsersMap[msg.user].username }}:</span>
          <br>
          {{ msg.content }}
        </div>
      </TransitionGroup>
    </template>
  </div>
</template>

<style module lang="scss">
.chat {
  display: grid;
  grid-template-areas: 'chat users';
  grid-template-columns: 1fr auto;
  height: 100%;
  overflow-y: hidden;

  &__messages {
    grid-area: chat;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    overflow-y: auto;
    overflow-x: hidden;

    & > :first-child {
      margin-top: auto !important;
    }
  }

  &__users {
    grid-area: users;
    background: var(--c-background-alt);
    width: 300px;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }
}

.message {
  padding: 1em;
  margin: 0.6em;
  border-radius: 6px;
  background: var(--c-background-alt);
}
</style>