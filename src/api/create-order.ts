import { Handler, Route } from '../@types/http'
import { logger } from '../utils/logger'
import { UserInputError } from '../utils/http'
import { sendSlackMessage } from '../services/slack'

type CreateOrderInput = {
  restaurantId: string
  items: [
    {
      name: string
      quantity: number
    }
  ]
}

const handler: Handler = async function ({ body }) {
  logger.info('Create Order', body)

  const { restaurantId, items } = body as CreateOrderInput

  if (!restaurantId) {
    throw new UserInputError('Restaurant is not registered', { restaurantId })
  }

  // Do stuff

  await sendSlackMessage({ text: 'New order!' })

  return {
    message: 'This is an optional message',
    status: 418,
    statusText: `I'm a teapot`,
    data: {
      id: 'new-order',
      restaurantId,
      items,
    },
  }
}

export default ['POST', '/order/create', handler] as Route
