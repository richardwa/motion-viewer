<script setup lang="ts">
import { cameras } from '@/common/config'
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink :class="$style.link" :to="`/camera/${i}`" v-for="(cam, i) in cameras">
          {{ cam.name }}
        </RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style module>
nav {
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
}
.link {
  padding: 1rem 2rem;
  font-size: larger;
  border: 1px solid gray;
  border-collapse: collapse;
  margin-right: -1px;
  width: 10rem;
  text-align: center;
}
</style>
