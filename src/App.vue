<template>
  <div class="stacks-container">
    <Stack
      v-for="(stack, index) of EventLoop.orderedStacks"
      :name="stack.name"
      :tasks="stack.tasks"
      :tasksContainerStyle="index === 0 && { display: 'flex', flexDirection: 'column-reverse' }" />

    <div>
      <h3>Tarea ejecutándose</h3>

      <p>
        {{ EventLoop.taskBeingProcessed.value }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import Stack from './components/Stack.vue'
import { EventLoop } from './EventLoop'

async function main() {
  await EventLoop.queueEvent(function helloWorld() {
    EventLoop.queueMacrotask(async function iAmAMacroTask() {
      EventLoop.queueMicrotask(function iAmAMicroTaskWithinAMacroTask() {
        console.log('A microtask within a macrotask')
      })

      await EventLoop.queueEvent(function syncEvent() {
        console.log('Synchronous event')
      })

      console.log('A macrotask')
    })

    EventLoop.queueMicrotask(function iAmAMicroTask1() {
      console.log('A microtask')
    })

    EventLoop.queueMicrotask(function iAmAMicroTask2() {
      console.log('Another microtask')
    })

    console.log('Hello world! Sync')
  })
}

EventLoop.queueEvent(main)
</script>

<style>
.stacks-container {
  display: flex;
  align-items: flex-start;
}
</style>
