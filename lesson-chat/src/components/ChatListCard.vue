<script setup lang="ts">
import type {Chat} from '@/types/chat';

defineProps<{
  chat: Chat
}>()
</script>

<template>
  <div :class="$style['chat-list-card']">
    <img
      :class="$style['chat-list-card__avatar']"
      :src="chat.avatar"
      :alt="`chat ${chat.title} avatar`"
    >
    <span :class="$style['chat-list-card__chatname']">
      {{ chat.title }}
    </span>
  </div>
</template>

<style module lang="scss">
.chat-list-card {
  display: flex;
  color: var(--c-text);
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 4px;
  border-bottom: 2px solid rgba(0,0,0,0.2);
  background-color: var(--c-background-alt);
  transition: all 0.3s ease-out;

  &:hover {
    background-color: var(--c-background);;
  }

  &__avatar {
    height: 64px;
    width: 64px;
    border-radius: 50%;
    border: 4px solid black;
  }

  &__chatname {
    font-size: 1.4rem;
  }
}
</style>