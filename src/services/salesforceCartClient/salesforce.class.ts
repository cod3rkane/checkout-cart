// A mock implementation of the SalesforceCartClient
// In a real application, this would make API calls to Salesforce

import { NotFound } from '@feathersjs/errors';

// DTOs based on SPEC
// In a real scenario, these would be more detailed
type Basket = any;
type SubmittedOrder = any;

export interface SalesforceCartClient {
  getAccessToken(organizationId: string): Promise<{ access_token: string; refresh_token: string }>;
  getBaskets(organizationId: string, basketId: string): Promise<Basket>;
  deleteBasketItems(organizationId: string, basketId: string, itemId: string): Promise<Basket>;
  patchBasketItems(organizationId: string, basketId: string, itemId: string, itemObject: Record<string, any>): Promise<Basket>;
  placeOrder(organizationId: string, basketId: string): Promise<SubmittedOrder>;
}

export class MockSalesforceCartClient implements SalesforceCartClient {
  private baskets: Map<string, Basket> = new Map();

  constructor() {
    // Seed with a sample basket
    const sampleBasket = {
      basketId: 'sample-basket',
      organizationId: 'sample-org',
      items: [{
        itemId: 'item-1',
        productName: 'Sample Product',
        quantity: 1
      }]
    };
    this.baskets.set('sample-basket', sampleBasket);
  }

  async getAccessToken(organizationId: string): Promise<{ access_token: string; refresh_token: string }> {
    console.log(`Getting access token for org: ${organizationId}`);
    return {
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token'
    };
  }

  async getBaskets(organizationId: string, basketId: string): Promise<Basket> {
    console.log(`Getting basket ${basketId} for org: ${organizationId}`);
    const basket = this.baskets.get(basketId);
    if (!basket) {
      throw new NotFound(`Basket with id ${basketId} not found`);
    }
    return Promise.resolve(basket);
  }

  async deleteBasketItems(organizationId: string, basketId: string, itemId: string): Promise<Basket> {
    console.log(`Deleting item ${itemId} from basket ${basketId} for org: ${organizationId}`);
    const basket = this.baskets.get(basketId);
    if (!basket) {
      throw new NotFound(`Basket with id ${basketId} not found`);
    }
    basket.items = basket.items.filter((item: any) => item.itemId !== itemId);
    return Promise.resolve(basket);
  }

  async patchBasketItems(organizationId: string, basketId: string, itemId: string, itemObject: Record<string, any>): Promise<Basket> {
    console.log(`Patching item ${itemId} in basket ${basketId} for org: ${organizationId}`);
    const basket = this.baskets.get(basketId);
    if (!basket) {
      throw new NotFound(`Basket with id ${basketId} not found`);
    }
    const item = basket.items.find((item: any) => item.itemId === itemId);
    if (!item) {
        throw new NotFound(`Item with id ${itemId} not found in basket`);
    }
    Object.assign(item, itemObject);
    return Promise.resolve(basket);
  }

  async placeOrder(organizationId: string, basketId: string): Promise<SubmittedOrder> {
    console.log(`Placing order for basket ${basketId} for org: ${organizationId}`);
    const basket = this.baskets.get(basketId);
    if (!basket) {
        throw new NotFound(`Basket with id ${basketId} not found`);
    }
    const order = {
        orderId: `order-${Date.now()}`,
        ...basket,
        status: 'submitted'
    };
    this.baskets.delete(basketId);
    return Promise.resolve(order);
  }
}
