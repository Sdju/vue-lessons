<script lang="ts">
import { defineComponent } from "vue";
import {counterMixin} from '@/counterMixin';

export default defineComponent({
  mixins: [counterMixin],

  props: {
    step: {
      type: Number,
      default: 1,
    }
  },

  inject: ['theme'],

  methods: {
    increment() {
      this.$emit('update:modelValue', this.modelValue + this.step)
    },

    decrement() {
      console.log('hello from original')
      this.$emit('update:modelValue', this.modelValue - this.step)
    }
  },
})
</script>

<script setup>

</script>

<template>
  <div>
    {{ modelValue }}
    <button @click="increment">+</button>
    <button @click="decrement">-</button>

    {{ theme }}
  </div>
</template>