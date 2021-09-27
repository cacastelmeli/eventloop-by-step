<template>
  <div class="stack-container">
    <h2>{{ props.name }}</h2>

    <div :style="props.tasksContainerStyle">
      <div class="task-container" v-for="task in props.tasks">
        <p>{{ task.toString() }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

import type { Task } from '../EventLoop'

const props = defineProps<{
  name: string
  tasks: Task[]
  tasksContainerStyle: any
}>()
</script>

<style>
.stack-container {
  display: flex;
  flex-direction: column;
  border: 1px solid #000;
  padding: 1em;
  margin: 0 1em;
}

.task-container {
  border: 1px solid #000;
  padding: 1em;
  margin-top: 1em;
}
</style>
