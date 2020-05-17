import http, { OutgoingHttpHeaders } from 'http'
import dotenv from 'dotenv'
import fetchEventHandlers from './polyfill'

dotenv.config({ path: '.env.development' })

export default function serve({ port = 1337 } = {}) {
  return new Promise((resolve) =>
    http
      .createServer((req, res) => {
        if (fetchEventHandlers.length === 0) {
          res.writeHead(500)
          return res.end('No worker was setup', 'utf-8')
        }

        let data: any[] = []
        req.on('data', (chunk) => data.push(chunk))
        req.on('end', async () => {
          // Simulate a FetchEvent.request https://developer.mozilla.org/en-US/docs/Web/API/Request
          const fetchRequest = new Request(
            `http://locahost:${port}${req.url}`,
            {
              method: req.method,
              body: data.length === 0 ? undefined : Buffer.concat(data),
            }
          )

          try {
            const workerResponsePromises: Promise<Response>[] = []

            // Since, a priori, we don't know which worker is meant to receive
            // a new request, we call all of them and see which one returns
            // a meaningful (i.e. non 404) response.
            for (const handler of fetchEventHandlers) {
              handler({
                request: fetchRequest,
                respondWith: (ResponsePromise: Promise<Response>) =>
                  workerResponsePromises.push(ResponsePromise),
              })
            }

            const responses = await Promise.all(workerResponsePromises)
            // Find the first response that is meaningful, or get the first if none is.
            const finalResponse =
              responses.find((r) => r.status !== 404) || responses[0]

            const responseData = await finalResponse.json()
            res.writeHead(
              finalResponse.status,
              finalResponse.statusText,
              (finalResponse.headers as unknown) as OutgoingHttpHeaders // TODO
            )
            res.end(JSON.stringify(responseData, null, 2), 'utf-8')
          } catch (error) {
            console.error(error)
            res.writeHead(500)
            res.end(error.message, 'utf-8')
          }
        })
      })
      .listen(port, resolve)
  )
}
