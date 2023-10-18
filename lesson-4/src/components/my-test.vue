<script setup lang="ts">
  console.log('x')
</script>

<template>
  <div>
    <div class="static">
      <span> More static info </span>
      <span> More static info </span>
      <span> More static info </span>
      <span> More static info </span>
      <span>
        <span> More static info </span> More
      </span>
      <span> More static info </span>
    </div>
    <span> {{ 'check' }} </span>
    <span @click="() => console.log('test')"> {{ 'check' }} </span>
    {{ (() => {debugger})() }}
  </div>
</template>

<style scoped>

</style>