export const serverBase = '/srv'
export const endPoints = {
  hello: `${serverBase}/hello`,
  stream: `${serverBase}/stream`
}

export type Camera = {
  name: string
  feed: string
  rtsp: string
  rtspLow: string
  captures: string
}

export const cameras: Camera[] = [
  {
    name: 'Doorbell',
    feed: '/streams2/cam1-.m3u8',
    rtsp: 'rtsp://admin:tAThGG2NAr5vjY5@192.168.2.21/Streaming/Channels/101/',
    rtspLow: 'rtsp://admin:tAThGG2NAr5vjY5@192.168.2.21/Streaming/Channels/102/',
    captures: '/motion/camera1/'
  }
  // {
  //   name: 'Garage',
  //   feed: '/streams2/cam2-.m3u8',
  //   rtsp: 'rtsp://rich:9876@192.168.2.163/live',
  //   rtspLow: 'rtsp://rich:9876@192.168.2.163/live',
  //   captures: '/motion/camera2/'
  // },
  // {
  //   name: 'Stairs',
  //   feed: '/streams2/cam3-.m3u8',
  //   rtsp: 'rtsp://rich:9876@192.168.2.190/live',
  //   rtspLow: 'rtsp://rich:9876@192.168.2.190/live',
  //   captures: '/motion/camera3/'
  // }
]
