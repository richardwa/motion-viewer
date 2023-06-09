<script setup lang="ts">
const props = defineProps<{ url?: string }>()
</script>
<template>
  <div>
    <img :src="url" />
  </div>
</template>
<style scoped>
div {
  display: flex;
  padding-bottom: var(--gap);
}

img {
  width: 100%;
  max-width: 1920px;
  margin: auto;
  aspect-ratio: 16/9;
}
</style>
