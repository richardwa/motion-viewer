<script setup lang="ts">
const props = defineProps<{ url?: string }>()
</script>
<template>
  <div>
    <video :src="props.url" controls autoplay muted></video>
  </div>
</template>
