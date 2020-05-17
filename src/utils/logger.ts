import { makeRequest } from './http'

let loggerTmp = console

const apiKey: string = process.env.LOGFLARE_API_KEY as string
const source: string = process.env.LOGFLARE_SOURCE as string

if (apiKey && ['production' || 'staging'].includes(process.env.MODE || '')) {
  // @ts-ignore
  loggerTmp = new Proxy(
    {},
    {
      get: (target, key: string) => (message: string, extra?: object) => {
        // @ts-ignore
        console[key](message, extra)

        return makeRequest('https://api.logflare.app/logs', {
          method: 'POST',
          headers: { 'X-API-KEY': apiKey },
          body: {
            source,
            log_entry: `${key.toUpperCase()} - ${message}`,
            metadata: extra || {},
          },
        }).catch((error) => console.error(error))
      },
    }
  )
} else if (process.env.MODE === 'test') {
  // @ts-ignore
  loggerTmp = new Proxy({}, { get: () => () => null })
}

export const logger: Console = loggerTmp
