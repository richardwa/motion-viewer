<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ base?: string; clips: string[] }>()
const selected = ref<number>()
</script>

<template>
  <main>
    <div class="captures">
      <div :key="clip" v-for="(clip, i) in clips" @click="selected = i">
        <video :src="`${base}/${clip}`" controls preload="metadata" v-if="i === selected" />
        <img v-lazy="`${base}/${clip}.jpg`" v-else />
        <label>{{ clip }}</label>
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
  gap: var(--gap);
}
.captures > div {
  display: flex;
  flex-direction: column;
}

.captures video,
.captures img {
  height: 8rem;
  aspect-ratio: 16/9;
  background-color: #ccc;
}
.captures label {
  align-self: center;
}
</style>
