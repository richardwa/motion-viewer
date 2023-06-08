<script setup lang="ts">
const props = defineProps<{ url?: string }>()
</script>
<template>
  <div>
    <img :src="url" />
  </div>
</template>
<style scoped>
img {
  width: 100%;
  max-width: 1600px;
  margin: auto;
}
</style>
