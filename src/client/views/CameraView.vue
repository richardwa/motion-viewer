<script setup lang="ts">
import CarouselListVue from '@/client/components/CarouselList.vue'
import { watch, ref } from 'vue'
import { useRoute } from 'vue-router'
import VideoPlayer from '@/client/components/VideoPlayer.vue'
import { endPoints } from '@/common/config'

const route = useRoute()
const clips = ref<string[]>([])

const refresh = () => {
  const key = route.params.key as string
  fetch(`/captures/${key}`)
    .then((r) => r.json() as Promise<string[]>)
    .then((list) => {
      clips.value = list.slice(0, 10)
    })
}
watch(() => route.params, refresh)
refresh()
</script>

<template>
  <main>
    <VideoPlayer :url="`${endPoints.stream}/${route.params.key}`" />
    <CarouselListVue :clips="clips" />
  </main>
</template>
<style scoped>
.stream {
  width: 100%;
  max-width: 10rem;
  max-width: 100rem;
  display: block;
  margin: 0.5rem auto;
}
</style>
