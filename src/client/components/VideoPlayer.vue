<script setup lang="ts">
defineProps<{ src: string }>()
</script>

<template>
  <main>
    <video id="videoPlayer" autoplay muted controls :src="src"></video>
  </main>
</template>
<style scoped></style>
