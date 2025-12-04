import type { Id, NullableId, Paginated, Params } from '@feathersjs/feathers'
import type { Application } from '../../declarations'
import { SalesforceCartClient, MockSalesforceCartClient } from '../salesforceCartClient/salesforce.class'
import { BadRequest, GeneralError } from '@feathersjs/errors'

type Basket = any
type SubmittedOrder = any

interface CheckoutServiceOptions {
  salesforceCartClient: SalesforceCartClient
}

export class CheckoutService {
  private salesforceCartClient: SalesforceCartClient

  constructor(options: CheckoutServiceOptions) {
    this.salesforceCartClient = options.salesforceCartClient
  }

  // These are not standard Feathers methods, but custom ones.
  // We will expose them via custom routes.
  async getBasket(params: Params): Promise<Basket> {
    const { organizationId, basketId } = params.query || {}

    if (!organizationId) {
      throw new BadRequest('organizationId is required')
    }
    if (!basketId) {
      throw new BadRequest('basketId is required')
    }

    return this.salesforceCartClient.getBaskets(organizationId, basketId)
  }

  async removeItems(id: string, params: Params): Promise<Basket> {
    const { organizationId, basketId } = params.query || {}
    const itemId = id

    if (!organizationId) {
      throw new BadRequest('organizationId is required')
    }
    if (!basketId) {
      throw new BadRequest('basketId is required')
    }
    if (!itemId) {
      throw new BadRequest('itemId is required')
    }

    return this.salesforceCartClient.deleteBasketItems(organizationId, basketId, itemId)
  }

  async patchItems(id: NullableId, data: any, params?: Params): Promise<Basket> {
    console.log({ data, params })
    if (params) {
      const { organizationId, basketId } = params.query || { organizationId: 'test', basketId: 'test' }
      const itemId = id?.toString()
      const { itemObject } = data

      if (!organizationId) {
        throw new BadRequest('organizationId is required')
      }
      if (!basketId) {
        throw new BadRequest('basketId is required')
      }
      if (!itemId) {
        throw new BadRequest('itemId is required')
      }
      if (!itemObject) {
        throw new BadRequest('itemObject is required in the body')
      }

      return this.salesforceCartClient.patchBasketItems(organizationId, basketId, itemId, itemObject)

    }

  }

  async placeOrder(data: {}, params: Params): Promise<SubmittedOrder> {
    const { organizationId, basketId } = params.query || {}

    if (!organizationId) {
      throw new BadRequest('organizationId is required')
    }
    if (!basketId) {
      throw new BadRequest('basketId is required')
    }

    return this.salesforceCartClient.placeOrder(organizationId, basketId)
  }

  // Standard Feathers methods - we need to implement them, but they will not be used
  async find(params?: Params): Promise<any> {
    return []
  }

  async get(id: Id, params?: Params): Promise<any> {
    return {}
  }

  async create(data: any, params?: Params): Promise<any> {
    return {}
  }

  async update(id: NullableId, data: any, params?: Params): Promise<any> {
    return {}
  }

  async patch(id: NullableId, data: any, params?: Params): Promise<any> {
    return {}
  }

  async remove(id: NullableId, params?: Params): Promise<any> {
    return {}
  }
}

export const getOptions = (app: Application) => {
  const salesforceCartClient = new MockSalesforceCartClient();
  return { salesforceCartClient }
}
