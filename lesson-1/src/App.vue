<script setup lang="ts">
import {ref, computed, provide, readonly, onMounted} from 'vue'
import MyButton from '@/components/MyButton.vue'
import TodoList from '@/components/TodoList.vue'

type Task = { title: string, complete: boolean, id: number }

let id = 0
const taskTitle = ref('')
const color = ref('blue')
const showOnlyCompleted = ref(ref([]))
const tasks = ref([] as Task[])

function addTask() {
  tasks.value.push({ 
    title: taskTitle.value,
    complete: false,
    id: id++
  })
  taskTitle.value = ''
}

const additional = ref([])
const button = ref()

console.log(ref({a: 1}))

onMounted(() => {
  button.value.input.focus()
})
</script>

<template>
  <input v-model="taskTitle"> 
  <MyButton
    ref="button"
    v-model:tags="additional"
    class="button"
    @my-click="addTask"
  >
    Add task
  </MyButton>
  
  <TodoList :tasks="tasks">
    <template #default="{ task, title }">
      <div
        class="task" 
        @click="a"
      >
        {{ task.title }}
        {{ title }}
        <button @click="task.complete = !task.complete">
          complete
        </button>
      </div>
    </template>
  </TodoList>
</template>

<style>
.task-list {
  display: flex;
  flex-direction: column;
}

.task--complete {
  text-decoration: line-through;
}
</style>
