import { Handler, Route } from '../@types/http'
import { logger } from '../utils/logger'

const handler: Handler = async function ({ body }) {
  logger.info('My Webhook', body)
}

export default ['*', '/my-webhook', handler] as Route
