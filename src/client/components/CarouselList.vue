<script setup lang="ts">
defineProps<{ base?: string; clips: string[] }>()
</script>

<template>
  <main>
    <div class="captures">
      <div :key="clip" v-for="clip in clips">
        <video :src="`${base}/${clip}`" preload="metadata" controls="true" />
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
  gap: 0.5rem;
}
.captures video {
  height: 8rem;
}
</style>
