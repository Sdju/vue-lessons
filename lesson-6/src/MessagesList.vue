<script setup lang="ts">
import { useChat } from './stores/chat'

const chat = useChat()

</script>

<template>
  <div>
    <div class="message" />
    <div 
      v-once 
      :class="$style['message']"
    />
    <div
      v-for="message in chat.messages"
      :key="message.id"
      class=""
      :class="{
        [$style['message']]: true,
        [$style['message--loading']]: !(message.completed || message.error),
        [$style['message--error']]: message.error,
      }"
    >
      {{ message.content }}
    </div>
  </div>
</template>

<style module>
.message {
  font-size: 1.1rem;
}

.message--loading {
  opacity: 50%;
}

.message--error {
  color: red;
}
</style>