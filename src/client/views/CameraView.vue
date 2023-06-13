<script setup lang="ts">
import CarouselListVue from '@/client/components/CarouselList.vue'
import { watch, ref } from 'vue'
import { useRoute } from 'vue-router'
import VideoPlayer from '@/client/components/VideoPlayer.vue'
import { cameras, type Camera } from '@/common/config'

const route = useRoute()
const clips = ref<string[]>([])
const camera = ref<Camera>()

const refresh = () => {
  const key = route.params.key as string
  const cam = cameras[key]
  camera.value = cam
  fetch(cam.captures)
    .then((r) => r.json() as Promise<string[]>)
    .then((list) => {
      clips.value = list
        .filter((s) => !s.endsWith('.jpg'))
        .sort()
        .slice(0, 200)
        .reverse()
    })
}
watch(() => route.params, refresh)
refresh()
</script>

<template>
  <main>
    <VideoPlayer :url="camera?.feed" />
    <CarouselListVue :base="camera?.captures" :clips="clips" />
  </main>
</template>
