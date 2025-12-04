// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { Id, Params, ServiceInterface } from '@feathersjs/feathers'
import { BadRequest, GeneralError } from '@feathersjs/errors'

import type { Application } from '../../declarations'
import type { Checkout, CheckoutData, CheckoutPatch, CheckoutQuery } from './checkout.schema'
import { MockSalesforceCartClient, SalesforceCartClient } from '../salesforceCartClient/salesforce.class'
import { Basket, CheckoutParams, CheckoutServiceOptions } from './checkout.class'

export type { Checkout, CheckoutData, CheckoutPatch, CheckoutQuery }

export class PlaceOrderService<
  ServiceParams extends CheckoutParams = CheckoutParams
> implements ServiceInterface<Checkout, CheckoutData, ServiceParams, CheckoutPatch> {
  private salesforceCartClient: SalesforceCartClient

  constructor(public options: CheckoutServiceOptions) {
    this.salesforceCartClient = options.salesforceCartClient
  }

  async create(data: CheckoutData, params?: ServiceParams): Promise<Checkout>
  async create(data: CheckoutData[], params?: ServiceParams): Promise<Checkout[]>
  async create(data: CheckoutData | CheckoutData[], params?: ServiceParams): Promise<Checkout | Checkout[]> {
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
}

export const getOptions = (app: Application) => {
  const salesforceCartClient = new MockSalesforceCartClient();

  return { app, salesforceCartClient  }
}
