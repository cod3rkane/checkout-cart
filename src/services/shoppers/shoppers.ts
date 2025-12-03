// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  shopperDataValidator,
  shopperPatchValidator,
  shopperQueryValidator,
  shopperResolver,
  shopperExternalResolver,
  shopperDataResolver,
  shopperPatchResolver,
  shopperQueryResolver
} from './shoppers.schema'

import type { Application } from '../../declarations'
import { ShopperService, getOptions } from './shoppers.class'

export const shopperPath = 'shoppers'
export const shopperMethods: Array<keyof ShopperService> = ['find', 'get', 'create', 'patch', 'remove']

export * from './shoppers.class'
export * from './shoppers.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const shopper = (app: Application) => {
  // Register our service on the Feathers application
  app.use(shopperPath, new ShopperService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: shopperMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(shopperPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(shopperExternalResolver), schemaHooks.resolveResult(shopperResolver)],
      find: [authenticate('jwt')],
      get: [authenticate('jwt')],
      create: [],
      update: [authenticate('jwt')],
      patch: [authenticate('jwt')],
      remove: [authenticate('jwt')]
    },
    before: {
      all: [schemaHooks.validateQuery(shopperQueryValidator), schemaHooks.resolveQuery(shopperQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(shopperDataValidator), schemaHooks.resolveData(shopperDataResolver)],
      patch: [schemaHooks.validateData(shopperPatchValidator), schemaHooks.resolveData(shopperPatchResolver)],
      remove: []
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
    [shopperPath]: ShopperService
  }
}
