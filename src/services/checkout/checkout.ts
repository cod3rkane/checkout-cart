// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  checkoutDataValidator,
  checkoutPatchValidator,
  checkoutQueryValidator,
  checkoutResolver,
  checkoutExternalResolver,
  checkoutDataResolver,
  checkoutPatchResolver,
  checkoutQueryResolver
} from './checkout.schema'

import type { Application } from '../../declarations'
import { CheckoutService, getOptions } from './checkout.class'
import { ItemsService } from './items.class'
import { PlaceOrderService } from './placeOrder.class'
import { BasketService } from './basket.class'

export const checkoutPath = 'checkout'
export const checkoutMethods: Array<keyof CheckoutService> = ['find', 'get', 'create', 'patch', 'remove', 'getBasket', 'removeItems', 'patchItems', 'placeOrder']

export * from './checkout.class'
export * from './checkout.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const checkout = (app: Application) => {
  // Register our service on the Feathers application
  app.use(checkoutPath, new CheckoutService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: checkoutMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  app.use('checkout/items', new ItemsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: ['patch', 'remove'],
    // You can add additional custom events to be sent to clients here
    events: []
  })
  app.use('checkout/place-order', new PlaceOrderService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: ['create'],
    // You can add additional custom events to be sent to clients here
    events: []
  })
  app.use('checkout/basket', new BasketService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: ['find'],
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(checkoutPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(checkoutExternalResolver),
        schemaHooks.resolveResult(checkoutResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(checkoutQueryValidator),
        schemaHooks.resolveQuery(checkoutQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(checkoutDataValidator),
        schemaHooks.resolveData(checkoutDataResolver)
      ],
      patch: [
        schemaHooks.validateData(checkoutPatchValidator),
        schemaHooks.resolveData(checkoutPatchResolver)
      ],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
  app.service('checkout/items').hooks({
    before: {
      patch: [authenticate('jwt')],
      remove: [authenticate('jwt')],
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
  app.service('checkout/place-order').hooks({
    before: {
      create: [authenticate('jwt')],
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
  app.service('checkout/basket').hooks({
    before: {
      find: [authenticate('jwt')],
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [checkoutPath]: CheckoutService,
    ['checkout/items']: ItemsService,
    ['checkout/place-order']: PlaceOrderService,
    ['checkout/basket']: BasketService,
  }
}
