<script setup lang="ts">
import { ref } from 'vue'
const servertext = ref<string>('')
fetch('/srv')
  .then((r) => r.text())
  .then((r) => (servertext.value = r))
</script>
<template>
  <div>
    <h1>{{ servertext }}</h1>
  </div>
</template>

<style></style>
