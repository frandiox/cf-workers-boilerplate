import { makeRequest } from '../utils/http'
import { logger } from '../utils/logger'

const SLACK_WEBHOOK: string = process.env.SLACKWEBHOOK as string

export async function sendSlackMessage(body: {
  text: string | void
  blocks?: object
}) {
  if (SLACK_WEBHOOK) {
    logger.info('Slack Payload', body)
    return makeRequest(SLACK_WEBHOOK, { method: 'POST', body })
  }
}
