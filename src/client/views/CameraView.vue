<script setup lang="ts">
import type CarouselListVue from '@/client/components/CarouselList.vue'
import { cameras } from '@/common/config'
import { getListing } from '@/common/util'
import type { Item } from '@/types'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const camIndex = parseInt((route.params.camIndex as string) || '0')
const camera = cameras[camIndex]
const clips = ref<Item[]>()

onMounted(() => {
  getListing(`${camera.captures}?C=M;O=D`).then((list) => {
    clips.value = list.files.slice(0, 10)
  })
})
</script>

<template>
  <main>
    <video id="videoPlayer" autoplay muted controls :src="camera.feed"></video>
    <CarouselListVue :clips="clips" />
  </main>
</template>
<style scoped>
preview {
  display: 'inline-block';
  width: '250px';
  cursor: 'pointer';
  margin: 4;
  text-align: 'center';
}

stream {
  width: '100%';
  max-width: '1920px';
  margin: 'auto';
  display: 'block';
}
</style>
