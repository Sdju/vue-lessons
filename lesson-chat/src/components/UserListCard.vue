<script setup lang="ts">
import type { User } from '../types/user'

defineProps<{
  user: User
}>()
</script>

<template>
  <div v-once :class="$style['user-list-card']">
    <img
      :class="$style['user-list-card__avatar']"
      :src="user.avatar"
      :alt="`user ${user.username} avatar`"
    >
    <span :class="$style['user-list-card__username']">
      {{ user.username }}
    </span>
  </div>
</template>

<style module lang="scss">
.user-list-card {
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

  &__username {
    font-size: 1.4rem;
  }
}
</style>