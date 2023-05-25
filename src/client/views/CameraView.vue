<script setup lang="ts">
import CarouselListVue from '@/client/components/CarouselList.vue'
import { cameras, type Camera } from '@/common/config'
import { getListing } from '@/common/util'
import type { Item } from '@/types'
import { watch, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const camIndex = ref<number>(0)
const camera = ref<Camera>()
const clips = ref<Item[]>([])

const refresh = () => {
  camIndex.value = parseInt((route.params.camIndex as string) || '0')
  camera.value = cameras[camIndex.value]
  getListing(`${camera.value?.captures}?C=M;O=D`).then((list) => {
    clips.value = list.files.slice(0, 10)
  })
}
watch(() => route.params, refresh)
refresh()
</script>

<template>
  <main>
    <video
      class="stream"
      id="videoPlayer"
      autoplay
      muted
      controls
      :src="`/srv/stream/${camIndex}`"
    ></video>
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
