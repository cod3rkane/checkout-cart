// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { ShopperService } from './shoppers.class'

// Main data model schema
export const shopperSchema = Type.Object(
  {
    id: Type.Number(),
    basketId: Type.String(),
    organizationId: Type.String(),
    accessToken: Type.String(),
    auth0Id: Type.Optional(Type.String()),
    text: Type.Optional(Type.String())
  },
  { $id: 'Shopper', additionalProperties: false }
)
export type Shopper = Static<typeof shopperSchema>
export const shopperValidator = getValidator(shopperSchema, dataValidator)
export const shopperResolver = resolve<ShopperQuery, HookContext<ShopperService>>({})

export const shopperExternalResolver = resolve<Shopper, HookContext<ShopperService>>({})

// Schema for creating new entries
export const shopperDataSchema = Type.Pick(shopperSchema, ['auth0Id'], {
  $id: 'ShopperData'
})
export type ShopperData = Static<typeof shopperDataSchema>
export const shopperDataValidator = getValidator(shopperDataSchema, dataValidator)
export const shopperDataResolver = resolve<ShopperData, HookContext<ShopperService>>({})

// Schema for updating existing entries
export const shopperPatchSchema = Type.Partial(shopperSchema, {
  $id: 'ShopperPatch'
})
export type ShopperPatch = Static<typeof shopperPatchSchema>
export const shopperPatchValidator = getValidator(shopperPatchSchema, dataValidator)
export const shopperPatchResolver = resolve<ShopperPatch, HookContext<ShopperService>>({})

// Schema for allowed query properties
export const shopperQueryProperties = Type.Pick(shopperSchema, ['id', 'auth0Id'])
export const shopperQuerySchema = Type.Intersect(
  [
    querySyntax(shopperQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type ShopperQuery = Static<typeof shopperQuerySchema>
export const shopperQueryValidator = getValidator(shopperQuerySchema, queryValidator)
export const shopperQueryResolver = resolve<ShopperQuery, HookContext<ShopperService>>({
  // If there is a user (e.g. with authentication), they are only allowed to see their own data
  id: async (value, user, context) => {
    console.log(context)
    // if (context.params.user) {
    //   return context.params.user.id
    // }

    return value
  }
})
