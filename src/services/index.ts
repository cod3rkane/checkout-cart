import { checkout } from './checkout/checkout'
import { shopper } from './shoppers/shoppers'
// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions
import type { Application } from '../declarations'

export const services = (app: Application) => {
  app.configure(checkout)
  app.configure(shopper)
  // All services will be registered here
}
