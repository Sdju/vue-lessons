<script setup lang="ts">
import type {PropType} from 'vue';
import {computed, inject, onMounted, ref, watchEffect} from 'vue';

const props = withDefaults(
    defineProps<{
      title?: string,
      tags: string[],
    }>(),
    {
      title: 'Button'
    }
)

const emit = defineEmits<{
  'my-click': [string],
  'update:tags': [string[]]
}>()

const proxyName = computed({
  get() {
    return props.tags
  },
  set(value: string) {
    props.tags.push(value)
    emit('update:tags', props.tags)
  }
})

const input = ref([])

defineExpose({
  input,
  hello: 'to All'
})

function log() {
  console.log('F')
}
</script>

<template>
  <div>
    <button @click="emit('my-click', 'from button')">
      <slot>
        Button
      </slot>
      {{ tags }}
    </button>
    <input
        v-model="proxyName"
        ref="input"
        type="text"
        @keydown.alt.enter="log"
    >
  </div>
</template>