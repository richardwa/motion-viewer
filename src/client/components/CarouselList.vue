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
  overflow-x: 'scroll';
  overflow-y: 'hidden';
  margin-top: '4px';
  white-space: 'nowrap';
}

.captures > div {
  margin: '4px';
  display: 'inline-block';
}

.captures video {
  width: '200px';
  height: '112.5px';
  display: 'block';
}
.captures label {
  text-align: 'center';
  display: 'block';
}
</style>
