// The dev-server acts as a gateway to every worker imported here.
// In development, workers are prefixed with their name. Example:
// https://my-worker.my-org.workers.dev/path => http://localhost:0000/my-worker/path

import { promises as fs } from 'fs'
import path from 'path'
import serve from './server'

importWorkers(path.resolve(__dirname, '../workers')).then(async (workers) => {
  console.log(`Workers: ${workers.join(', ')}\n`)

  const port = 1337
  await serve({ port })

  console.log(
    `🚀  Dev server listening on port ${port} in "${
      process.env.MODE || process.env.NODE_ENV
    }" mode\n`
  )
})

async function importWorkers(dirPath: string) {
  const workers = (await fs.readdir(dirPath, 'utf8')).filter(
    (filename) => !/(^_|\.[jt]s$)/i.test(filename)
  )

  const workerFiles = workers.map((dirName) => `${dirPath}/${dirName}/index.ts`)
  await Promise.all(workerFiles.map((file) => import(file)))

  return workers
}
