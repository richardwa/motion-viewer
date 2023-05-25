<script setup lang="ts">
import type { Item } from '@/types'
defineProps<{ clips: Item[] }>()
</script>

<template>
  <main>
    <div class="captures">
      <div :key="f.name" v-for="f in clips">
        <video :src="f.path" preload="metadata" controls="true" />
        <label>{{ f.name }}</label>
      </div>
    </div>
  </main>
</template>
<style scoped>
.captures {
  overflow-x: scroll;
  overflow-y: hidden;
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
}
.captures video {
  height: 8rem;
}
</style>
