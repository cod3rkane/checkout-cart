// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { CheckoutService } from './checkout.class'

// Main data model schema
export const checkoutSchema = Type.Object(
  {
    id: Type.Number(),
    text: Type.String()
  },
  { $id: 'Checkout', additionalProperties: false }
)
export type Checkout = Static<typeof checkoutSchema>
export const checkoutValidator = getValidator(checkoutSchema, dataValidator)
export const checkoutResolver = resolve<CheckoutQuery, HookContext<CheckoutService>>({})

export const checkoutExternalResolver = resolve<Checkout, HookContext<CheckoutService>>({})

// Schema for creating new entries
export const checkoutDataSchema = Type.Pick(checkoutSchema, ['text'], {
  $id: 'CheckoutData'
})
export type CheckoutData = Static<typeof checkoutDataSchema>
export const checkoutDataValidator = getValidator(checkoutDataSchema, dataValidator)
export const checkoutDataResolver = resolve<CheckoutData, HookContext<CheckoutService>>({})

// Schema for updating existing entries
export const checkoutPatchSchema = Type.Partial(checkoutSchema, {
  $id: 'CheckoutPatch'
})
export type CheckoutPatch = Static<typeof checkoutPatchSchema>
export const checkoutPatchValidator = getValidator(checkoutPatchSchema, dataValidator)
export const checkoutPatchResolver = resolve<CheckoutPatch, HookContext<CheckoutService>>({})

// Schema for allowed query properties
export const checkoutQueryProperties = Type.Pick(checkoutSchema, ['id', 'text'])
export const checkoutQuerySchema = Type.Intersect(
  [
    querySyntax(checkoutQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type CheckoutQuery = Static<typeof checkoutQuerySchema>
export const checkoutQueryValidator = getValidator(checkoutQuerySchema, queryValidator)
export const checkoutQueryResolver = resolve<CheckoutQuery, HookContext<CheckoutService>>({})
