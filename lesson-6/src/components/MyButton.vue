<script setup lang="ts">

import {computed} from 'vue';
import MyPanel from '@/components/MyPanel.vue';

const props = defineProps<{
  isLink?: boolean
  title?: string
}>()

const tag = computed(() => props.isLink ? 'a' : 'button')

</script>

<template>
  <MyPanel>
    <component :is="tag">
      <slot> {{ title || 'button' }} </slot>
    </component>
  </MyPanel>

</template>
