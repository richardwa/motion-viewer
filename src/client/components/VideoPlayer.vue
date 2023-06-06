<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Hls from 'hls.js'

const videoElement = ref<HTMLVideoElement | null>(null)
const props = defineProps<{ url?: string }>()

onMounted(() => {
  const element = videoElement.value
  if (element && props.url) {
    if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(props.url)
      hls.attachMedia(element)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        element.play()
      })
    } else if (element.canPlayType('application/vnd.apple.mpegurl')) {
      element.src = props.url
      element.addEventListener('canplay', () => {
        element.play()
      })
    }
  }
})
</script>
<template>
  <div>
    <video ref="videoElement" controls autoplay muted></video>
  </div>
</template>
