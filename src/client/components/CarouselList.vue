<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ base?: string; clips: string[] }>()
const selected = ref<number>()
</script>

<template>
  <main>
    <div class="captures">
      <div :key="clip" v-for="(clip, i) in clips">
        <div @click="selected = i">
          <video :src="`${base}/${clip}`" controls preload="metadata" v-if="i === selected" />
          <img :src="`${base}/${clip}.jpg`" v-else />
          <label>{{ clip }}</label>
        </div>
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
.captures video,
.captures img {
  height: 8rem;
}
</style>
