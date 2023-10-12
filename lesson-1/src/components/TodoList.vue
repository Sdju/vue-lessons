<script setup lang="ts">
import type { PropType } from 'vue';
import {inject, watchEffect} from 'vue';

type Task = { title: string, complete: boolean, id: number }

defineProps<{
  tasks: Task[]
}>()

</script>
<template>
  <div class="task-list">
    <template
      v-for="task in tasks"
      :key="task.id"
    >
      <slot :task="task" title="A"/>
    </template>
  </div>
  <slot v-for="i in 10" :key="i" :name="'foo' + 'ter'" />
</template>
