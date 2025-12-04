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
      "adjustedMerchandizeTotalTax": 30,
      "adjustedShippingTotalTax": 0.8,
      "agentBasket": false,
      "basketId": "a10ff320829cb0eef93ca5310a",
      "billingAddress": {
        "address1": "104 Presidential Way",
        "city": "Woburn",
        "countryCode": "US",
        "firstName": "Stephanie",
        "fullName": "Stephanie Miller",
        "id": "bfea663fd3de75d5be3ec02702",
        "lastName": "Miller",
        "postalCode": "01801",
        "stateCode": "MA"
      },
      "channelType": "storefront",
      "couponItems": [
        {
          "code": "5ties",
          "couponItemId": "cc6ef43f207bf64099288aec36",
          "statusCode": "no_applicable_promotion",
          "valid": true
        }
      ],
      "creationDate": "2019-10-17T08:29:55.340Z",
      "currency": "USD",
      "customerInfo": {
        "customerId": "beQeANXJNsd0xcINsB6cSrobQa",
        "email": "shopper@salesforce-test.com"
      },
      "lastModified": "2019-10-17T08:29:55.698Z",
      "merchandizeTotalTax": 30,
      "orderTotal": 646.76,
      "paymentInstruments": [
        {
          "amount": 0,
          "paymentCard": {
            "cardType": "Visa",
            "creditCardExpired": false
          },
          "paymentInstrumentId": "b7679bea661819b2de78b9de7d",
          "paymentMethodId": "CREDIT_CARD"
        }
      ],
      "productItems": [
        {
          "adjustedTax": 30,
          "basePrice": 199.99,
          "bonusProductLineItem": false,
          "gift": false,
          "itemId": "3d4e28425ce0b3a65b0ac4e163",
          "itemText": "Green Umbrella - Sustained Edition",
          "optionItems": [
            {
              "adjustedTax": 0,
              "basePrice": 0,
              "bonusProductLineItem": false,
              "gift": false,
              "itemId": "ff9452ed11fcf5c80f9143a8f1",
              "itemText": "We will plant a tree for your order.",
              "optionId": "plantATree",
              "optionValueId": "000",
              "price": 0,
              "priceAfterItemDiscount": 0,
              "priceAfterOrderDiscount": 0,
              "productId": "000",
              "productName": "Plant a tree.",
              "quantity": 3,
              "shipmentId": "me",
              "tax": 0,
              "taxBasis": 0,
              "taxClassId": "standard",
              "taxRate": 0.05
            }
          ],
          "price": 599.97,
          "priceAfterItemDiscount": 599.97,
          "priceAfterOrderDiscount": 599.97,
          "productId": "green-umbrella",
          "productName": "Green Umbrella - Sustained Edition",
          "quantity": 3,
          "shipmentId": "me",
          "tax": 30,
          "taxBasis": 599.97,
          "taxClassId": "standard",
          "taxRate": 0.05
        }
      ],
      "productSubTotal": 599.97,
      "productTotal": 599.97,
      "shipments": [
        {
          "adjustedMerchandizeTotalTax": 30,
          "adjustedShippingTotalTax": 0.8,
          "gift": false,
          "merchandizeTotalTax": 30,
          "productSubTotal": 599.97,
          "productTotal": 599.97,
          "shipmentId": "me",
          "shipmentTotal": 646.76,
          "shippingAddress": {
            "address1": "4162  Turkey Pen Road",
            "city": "New York",
            "countryCode": "US",
            "firstName": "Agustin",
            "fullName": "Agustin Estes",
            "id": "4432af77112f7c2433248a48e8",
            "lastName": "Estes",
            "postalCode": "10016",
            "stateCode": "NY"
          },
          "shippingMethod": {
            "description": "Order received within 7-10 business days",
            "id": "001",
            "name": "Ground",
            "price": 15.99
          },
          "shippingStatus": "not_shipped",
          "shippingTotal": 15.99,
          "shippingTotalTax": 0.8,
          "taxTotal": 30.8
        }
      ],
      "shippingItems": [
        {
          "adjustedTax": 0.8,
          "basePrice": 15.99,
          "itemId": "d5ed0e58b8f8b5efe8d617a630",
          "itemText": "Shipping",
          "price": 15.99,
          "priceAfterItemDiscount": 15.99,
          "shipmentId": "me",
          "tax": 0.8,
          "taxBasis": 15.99,
          "taxClassId": "standard",
          "taxRate": 0.05
        }
      ],
      "shippingTotal": 15.99,
      "shippingTotalTax": 0.8,
      "taxation": "net",
      "taxTotal": 30.8
    };

    this.baskets.set('a10ff320829cb0eef93ca5310a', sampleBasket);
  }

  async getAccessToken(organizationId: string): Promise<{ access_token: string; refresh_token: string }> {
    console.log(`Getting access token for org: ${organizationId}`);
    return {
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImF1ZCI6Imh0dHBzOi8veW91cmRvbWFpbi5jb20iLCJiYXNrZXRJZCI6ImExMGZmMzIwODI5Y2IwZWVmOTNjYTUzMTBhIiwib3JnYW5pemF0aW9uSWQiOiJjYzZlZjQzZjIwN2JmNjQwOTkyODhhZWMzNiIsImlhdCI6MTc2NDk1NjQxNX0.9_KGB4HFZYd72cwGkH2GnnkuL-hEbNdfIjIeAR4YrPI',
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
    basket.productItems = basket.productItems.filter((item: any) => item.itemId !== itemId);
    return Promise.resolve(basket);
  }

  async patchBasketItems(organizationId: string, basketId: string, itemId: string, itemObject: Record<string, any>): Promise<Basket> {
    console.log(`Patching item ${itemId} in basket ${basketId} for org: ${organizationId}`);
    const basket = this.baskets.get(basketId);
    if (!basket) {
      throw new NotFound(`Basket with id ${basketId} not found`);
    }
    const item = basket.productItems.find((item: any) => item.itemId === itemId);
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
