export const serverBase = '/srv'
export const endPoints = {
  hello: `${serverBase}/hello`,
  stream: `${serverBase}/stream`,
  captures: `/captures`,
}


export type Camera = {
  name: string
  feed: string,
  captures: string,
}

export const cameras: { [s: string]: Camera } = {
  doorbell: {
    name: 'Doorbell',
    feed: `${endPoints.stream}/1/stream`,
    captures: `${endPoints.captures}/doorbell`
  }
}
