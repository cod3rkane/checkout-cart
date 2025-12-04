// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { Id, NullableId, Params, ServiceInterface } from '@feathersjs/feathers'

import type { Application } from '../../declarations'
import type { Checkout, CheckoutData, CheckoutPatch, CheckoutQuery } from './checkout.schema'

export type { Checkout, CheckoutData, CheckoutPatch, CheckoutQuery }

export interface CheckoutServiceOptions {
  app: Application
}

export interface CheckoutParams extends Params<CheckoutQuery> {}

// This is a skeleton for a custom service class. Remove or add the methods you need here
export class CheckoutService<
  ServiceParams extends CheckoutParams = CheckoutParams
> implements ServiceInterface<Checkout, CheckoutData, ServiceParams, CheckoutPatch> {
  constructor(public options: CheckoutServiceOptions) {}

  async find(_params?: ServiceParams): Promise<Checkout[]> {
    return []
  }

  async get(id: Id, _params?: ServiceParams): Promise<Checkout> {
    return {
      id: 0,
      text: `A new message with ID: ${id}!`
    }
  }

  async create(data: CheckoutData, params?: ServiceParams): Promise<Checkout>
  async create(data: CheckoutData[], params?: ServiceParams): Promise<Checkout[]>
  async create(data: CheckoutData | CheckoutData[], params?: ServiceParams): Promise<Checkout | Checkout[]> {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)))
    }

    return {
      id: 0,
      ...data
    }
  }

  // This method has to be added to the 'methods' option to make it available to clients
  async update(id: NullableId, data: CheckoutData, _params?: ServiceParams): Promise<Checkout> {
    return {
      id: 0,
      ...data
    }
  }

  async patch(id: NullableId, data: CheckoutPatch, _params?: ServiceParams): Promise<Checkout> {
    return {
      id: 0,
      text: `Fallback for ${id}`,
      ...data
    }
  }

  async remove(id: NullableId, _params?: ServiceParams): Promise<Checkout> {
    return {
      id: 0,
      text: 'removed'
    }
  }
}

export const getOptions = (app: Application) => {
  return { app }
}
