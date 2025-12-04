// For more information about this file see https://dove.feathersjs.com/guides/cli/service.test.html
import assert from 'assert'
import axios from 'axios'

import { app } from '../../../src/app'

const port = 3030
const acess_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImF1ZCI6Imh0dHBzOi8veW91cmRvbWFpbi5jb20iLCJiYXNrZXRJZCI6ImExMGZmMzIwODI5Y2IwZWVmOTNjYTUzMTBhIiwib3JnYW5pemF0aW9uSWQiOiJjYzZlZjQzZjIwN2JmNjQwOTkyODhhZWMzNiIsImlhdCI6MTc2NDk1NjQxNX0.9_KGB4HFZYd72cwGkH2GnnkuL-hEbNdfIjIeAR4YrPI"
const basket_id = "a10ff320829cb0eef93ca5310a"
const item_id = "3d4e28425ce0b3a65b0ac4e163"

describe('checkout service', () => {
  it('registered the service', () => {
    const service = app.service('checkout')

    assert.ok(service, 'Registered the service')
  })

  describe('GET /checkout/basket', () => {
    it('should get a basket with valid params', async () => {
      await axios.post(`http://localhost:${port}/authentication`, {
        "strategy": "jwt",
        "accessToken": acess_token,
      })

      const response = await axios.get(`http://localhost:${port}/checkout/basket`, {
        headers: { Authorization: `Bearer ${acess_token}` },
      })

      assert.strictEqual(response.status, 200)
      assert.strictEqual(response.data.basketId, basket_id)
    })

    it('should fail without auth', async () => {
      try {
        await axios.get(`http://localhost:${port}/checkout/basket`)
        assert.fail('should have failed')
      } catch (error: any) {
        assert.strictEqual(error.response.status, 401)
      }
    })
  })

  describe('DELETE /checkout/items/:itemId', () => {
    it('should delete an item from the basket', async () => {
      const response = await axios.delete(`http://localhost:${port}/checkout/items/${item_id}`, {
        headers: { Authorization: `Bearer ${acess_token}` },
      })

      assert.strictEqual(response.status, 200)
      assert.ok(response.data.productItems.every((item: any) => item.itemId !== item_id))
    })

    it('should fail without auth', async () => {
      try {
        await axios.delete(`http://localhost:${port}/checkout/items/${item_id}`)
        assert.fail('should have failed')
      } catch (error: any) {
        assert.strictEqual(error.response.status, 401)
      }
    })
  })

  describe('PATCH /checkout/items/:itemId', () => {
    const patchData = { itemId: item_id, itemText: "Green Umbrella - King Edition" }

    it('should fail without auth', async () => {
      try {
        await axios.patch(`http://localhost:${port}/checkout/items/${item_id}`, patchData, {
        })
        assert.fail('should have failed')
      } catch (error: any) {
        assert.strictEqual(error.response.status, 401)
      }
    })
  })

  describe('POST /checkout/place-order', () => {
    it('should place an order', async () => {
      const response = await axios.post(`http://localhost:${port}/checkout/place-order`, {}, {
        headers: { Authorization: `Bearer ${acess_token}` }
      })
      assert.strictEqual(response.status, 201) // Spec says 201, but feathers default is 200 for custom methods
      assert.strictEqual(response.data.status, 'submitted')
    })

    it('should fail without auth', async () => {
      try {
        await axios.post(`http://localhost:${port}/checkout/place-order`, {}, {
        })
        assert.fail('should have failed')
      } catch (error: any) {
        assert.strictEqual(error.response.status, 401)
      }
    })
  })
})
