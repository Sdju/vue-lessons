<script setup>
import MessagesList from "@/MessagesList.vue";
import {useChat} from "@/stores/chat";
import {ref} from "vue";

const chat = useChat()

const text = ref(0)

function sendMessage() {
  chat.addMessage(text.value);
  text.value = 0;
}

const vFocus = {
  mounted: (el) => el.focus()
}
</script>

<template>
  <MessagesList />
  <input
    v-model.number="text"
    type="text"
    @keyup[keybind]="sendMessage"
  >
  {{ typeof text }} {{ text }}
  <button @click="sendMessage">
    Send Message
  </button>
</template>

<style>

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

</style>