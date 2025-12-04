// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { Id, NullableId, Params, ServiceInterface } from '@feathersjs/feathers'
import { BadRequest, GeneralError } from '@feathersjs/errors'

import type { Application } from '../../declarations'
import type { Checkout, CheckoutData, CheckoutPatch, CheckoutQuery } from './checkout.schema'
import { MockSalesforceCartClient, SalesforceCartClient } from '../salesforceCartClient/salesforce.class'

export type { Checkout, CheckoutData, CheckoutPatch, CheckoutQuery }

type Basket = any
type SubmittedOrder = any


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

  async getBasket(id: NullableId, data: any, params?: ServiceParams): Promise<Basket> {
    console.log(params)

    // if (params) {
    //   const { organizationId, basketId } = params.query || {}

    //   if (!organizationId) {
    //     throw new BadRequest('organizationId is required')
    //   }
    //   if (!basketId) {
    //     throw new BadRequest('basketId is required')
    //   }

    //   return this.salesforceCartClient.getBaskets(organizationId, basketId)
    // }

  }

  async removeItems(id: string, params: ServiceParams): Promise<Basket> {
    // const { organizationId, basketId } = params.query || {}
    // const itemId = id

    // if (!organizationId) {
    //   throw new BadRequest('organizationId is required')
    // }
    // if (!basketId) {
    //   throw new BadRequest('basketId is required')
    // }
    // if (!itemId) {
    //   throw new BadRequest('itemId is required')
    // }

    // return this.salesforceCartClient.deleteBasketItems(organizationId, basketId, itemId)
  }

  async patchItems(id: NullableId, data: any, params?: ServiceParams): Promise<Basket> {
    console.log({ data, params })
    // if (params) {
    //   const { organizationId, basketId } = params.query || { organizationId: 'test', basketId: 'test' }
    //   const itemId = id?.toString()
    //   const { itemObject } = data

    //   if (!organizationId) {
    //     throw new BadRequest('organizationId is required')
    //   }
    //   if (!basketId) {
    //     throw new BadRequest('basketId is required')
    //   }
    //   if (!itemId) {
    //     throw new BadRequest('itemId is required')
    //   }
    //   if (!itemObject) {
    //     throw new BadRequest('itemObject is required in the body')
    //   }

    //   return this.salesforceCartClient.patchBasketItems(organizationId, basketId, itemId, itemObject)
    // }

  }

  async placeOrder(data: {}, params: ServiceParams): Promise<SubmittedOrder> {
    // const { organizationId, basketId } = params.query || {}

    // if (!organizationId) {
    //   throw new BadRequest('organizationId is required')
    // }
    // if (!basketId) {
    //   throw new BadRequest('basketId is required')
    // }

    // return this.salesforceCartClient.placeOrder(organizationId, basketId)
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
