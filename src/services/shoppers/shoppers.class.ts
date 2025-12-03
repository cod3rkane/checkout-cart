// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { Id, NullableId, Params, ServiceInterface } from '@feathersjs/feathers'

import type { Application } from '../../declarations'
import type { Shopper, ShopperData, ShopperPatch, ShopperQuery } from './shoppers.schema'

export type { Shopper, ShopperData, ShopperPatch, ShopperQuery }

export interface ShopperServiceOptions {
  app: Application
}

export interface ShopperParams extends Params<ShopperQuery> {}

// This is a skeleton for a custom service class. Remove or add the methods you need here
export class ShopperService<ServiceParams extends ShopperParams = ShopperParams> implements ServiceInterface<
  Shopper,
  ShopperData,
  ServiceParams,
  ShopperPatch
> {
  constructor(public options: ShopperServiceOptions) {}

  async find(_params?: ServiceParams): Promise<Shopper[]> {
    return []
  }

  async get(id: Id, _params?: ServiceParams): Promise<Shopper> {
    return {
      id: 0,
      text: `A new message with ID: ${id}!`
    }
  }

  async create(data: ShopperData, params?: ServiceParams): Promise<Shopper>
  async create(data: ShopperData[], params?: ServiceParams): Promise<Shopper[]>
  async create(data: ShopperData | ShopperData[], params?: ServiceParams): Promise<Shopper | Shopper[]> {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)))
    }

    return {
      id: 0,
      ...data
    }
  }

  // This method has to be added to the 'methods' option to make it available to clients
  async update(id: NullableId, data: ShopperData, _params?: ServiceParams): Promise<Shopper> {
    return {
      id: 0,
      ...data
    }
  }

  async patch(id: NullableId, data: ShopperPatch, _params?: ServiceParams): Promise<Shopper> {
    return {
      id: 0,
      text: `Fallback for ${id}`,
      ...data
    }
  }

  async remove(id: NullableId, _params?: ServiceParams): Promise<Shopper> {
    return {
      id: 0,
      text: 'removed'
    }
  }
}

export const getOptions = (app: Application) => {
  return { app }
}
