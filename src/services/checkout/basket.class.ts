// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { Id, Params, ServiceInterface } from '@feathersjs/feathers'
import { BadRequest, GeneralError } from '@feathersjs/errors'

import type { Application } from '../../declarations'
import type { Checkout, CheckoutData, CheckoutPatch, CheckoutQuery } from './checkout.schema'
import { MockSalesforceCartClient, SalesforceCartClient } from '../salesforceCartClient/salesforce.class'
import { Basket, CheckoutParams, CheckoutServiceOptions } from './checkout.class'

export type { Checkout, CheckoutData, CheckoutPatch, CheckoutQuery }

export class BasketService<
  ServiceParams extends CheckoutParams = CheckoutParams
> implements ServiceInterface<Checkout, CheckoutData, ServiceParams, CheckoutPatch> {
  private salesforceCartClient: SalesforceCartClient

  constructor(public options: CheckoutServiceOptions) {
    this.salesforceCartClient = options.salesforceCartClient
  }

  async find(params?: ServiceParams): Promise<Checkout> {
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
}

export const getOptions = (app: Application) => {
  const salesforceCartClient = new MockSalesforceCartClient();

  return { app, salesforceCartClient  }
}
