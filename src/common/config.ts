type Camera = {
  name: string
  feed: string
  captures: string
}

export const cameras: Camera[] = [
  {
    name: 'doorbell',
    feed: 'https://pluto/streams2/cam1-.m3u8',
    captures: 'https://pluto/motion/camera1/'
  },
  {
    name: 'garage',
    feed: 'https://pluto/streams2/cam2-.m3u8',
    captures: 'https://pluto/motion/camera1/'
  },
  {
    name: 'stairs',
    feed: 'https://pluto/streams2/cam3-.m3u8',
    captures: 'https://pluto/motion/camera1/'
  }
]
