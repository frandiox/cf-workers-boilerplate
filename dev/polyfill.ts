import fetch, { Response, Request } from 'node-fetch'

// @ts-ignore
globalThis.fetch = fetch
// @ts-ignore
globalThis.Request = Request
// @ts-ignore
globalThis.Response = Response

const fetchEventHandlers: Function[] = []

// @ts-ignore
globalThis.addEventListener = function (
  eventName: string,
  eventHandler: Function
) {
  if (eventName === 'fetch') {
    fetchEventHandlers.push(eventHandler)
  }
}

export default fetchEventHandlers
