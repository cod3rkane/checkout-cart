// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { Id, NullableId, Params, ServiceInterface } from '@feathersjs/feathers'
import { BadRequest, GeneralError } from '@feathersjs/errors'

import type { Application } from '../../declarations'
import type { Checkout, CheckoutData, CheckoutPatch, CheckoutQuery, CheckoutRemoveItem } from './checkout.schema'
import { MockSalesforceCartClient, SalesforceCartClient } from '../salesforceCartClient/salesforce.class'

export type { Checkout, CheckoutData, CheckoutPatch, CheckoutQuery }

export type Basket = any
export type SubmittedOrder = any

export interface CheckoutServiceOptions {
  app: Application
  salesforceCartClient: SalesforceCartClient
}

export interface CheckoutParams extends Params<CheckoutQuery> {}

// This is a skeleton for a custom service class. Remove or add the methods you need here
export class CheckoutService<
  ServiceParams extends CheckoutParams = CheckoutParams
> implements ServiceInterface<Checkout, CheckoutData, ServiceParams, CheckoutPatch> {
  private salesforceCartClient: SalesforceCartClient

  constructor(public options: CheckoutServiceOptions) {
    this.salesforceCartClient = options.salesforceCartClient
  }

  async getBasket(id: Id, params?: ServiceParams): Promise<Basket> {
    if (params) {
      if (!params.shopper?.organizationId) {
        throw new BadRequest('organizationId is required')
      }

      if (!params.shopper?.basketId) {
        throw new BadRequest('basketId is required')
      }

      return this.salesforceCartClient.getBaskets(params.shopper?.organizationId, params.shopper?.basketId)
    }

    throw new GeneralError('Could not resolve params in getBasket call')
  }

  async removeItems(data: CheckoutRemoveItem, params: ServiceParams): Promise<Basket> {
    if (params) {
      if (!params.shopper?.organizationId) {
        throw new BadRequest('organizationId is required')
      }

      if (!params.shopper?.basketId) {
        throw new BadRequest('basketId is required')
      }

      if (!data.itemId) {
        throw new BadRequest('itemId is required')
      }

      return this.salesforceCartClient.deleteBasketItems(params.shopper?.organizationId, params.shopper?.basketId, data.itemId)
    }

    throw new GeneralError('Could not resolve params in removeItems call')
  }

  async patchItems(data: CheckoutRemoveItem, params: ServiceParams): Promise<Basket> {
    if (params) {
      if (!params.shopper?.organizationId) {
        throw new BadRequest('organizationId is required')
      }

      if (!params.shopper?.basketId) {
        throw new BadRequest('basketId is required')
      }

      if (!data.itemId) {
        throw new BadRequest('itemId is required')
      }

      return this.salesforceCartClient.patchBasketItems(params.shopper?.organizationId, params.shopper?.basketId, data.itemId, data)
    }

    throw new GeneralError('Could not resolve params in patchItems call')
  }

  async placeOrder(id: NullableId, params: ServiceParams): Promise<SubmittedOrder> {
     if (params) {
      if (!params.shopper?.organizationId) {
        throw new BadRequest('organizationId is required')
      }

      if (!params.shopper?.basketId) {
        throw new BadRequest('basketId is required')
      }

       return this.salesforceCartClient.placeOrder(params.shopper?.organizationId, params.shopper?.basketId)
    }

    throw new GeneralError('Could not resolve place the order in placeOrder call')
  }

  async find(_params?: ServiceParams): Promise<Checkout[]> {
    return []
  }

  async get(id: Id, params?: ServiceParams): Promise<Checkout> {
    console.log(params)

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
  const salesforceCartClient = new MockSalesforceCartClient();

  return { app, salesforceCartClient  }
}
