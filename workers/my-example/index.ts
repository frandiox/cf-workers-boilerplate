import setup from '../setup'
import myWebhookRoute from '../../src/api/my-webhook'
import createOrderRoute from '../../src/api/create-order'

setup({ worker: 'my-example', routes: [myWebhookRoute, createOrderRoute] })
