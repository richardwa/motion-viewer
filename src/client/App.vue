<script setup lang="ts">
import { cameras } from '@/common/config'
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink class="link" :to="`/camera/${i}`" v-for="(cam, i) in cameras">
          {{ cam.name }}
        </RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
.link {
  padding: 1rem;
}

.router-link-active {
  color: black;
  cursor: default;
}
</style>
