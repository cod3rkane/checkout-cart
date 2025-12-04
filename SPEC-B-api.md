### Checkout API — Endpoint Contracts

> This document defines the **REST API contract** for the Checkout application.  
> It follows the same structure and formatting style as **SPEC-A**, and is written for Claude Code to consume directly.  
> All endpoints implement Salesforce basket interactions (non-persistent cart), using the `SalesforceCartClient` abstraction defined in SPEC-A.

---

## **1. Goals, constraints and assumptions**
### Goals
- Expose a clean, stable REST API for Checkout operations.
- Map UI actions (remove item, patch item, place order) to Salesforce Basket API calls.
- Keep endpoints thin: **validation + orchestration**, no Salesforce logic in the controller.
- Ensure consistent error handling using FeathersJS conventions.

### Constraints & Assumptions
- **Salesforce Basket is non-persistent** → endpoints must gracefully handle missing basket state.
- **Auth required**: All endpoints require JWT authentication.
- **Idempotency** is not required for this minimal implementation.
- **SalesforceCartClient** must be the single integration point for SF Shopper APIs.
- All endpoints return JSON and follow REST semantics.

---

## **2. High-level API Layer Architecture**

`[Client UI] ---> [Feathers REST Endpoints] ---> [Checkout Service]                                    |                 |                                    |                 --> Uses SalesforceCartClient                                    |                                    --> Validation (TypeBox)`

- **Feathers REST Endpoints** expose `/checkout` and subroutes.
    
- **Checkout Service** orchestrates calls, applying minimal validation.
    
- **SalesforceCartClient** encapsulates all Salesforce API communication.
    

---

## **3. API Endpoint Surface (Feathers REST)**

All endpoints live under:

`/checkout`

All endpoints must require authentication (`Authentication: required`).

Endpoints rely on three contextual identifiers:

|Field|Required|Description|
|---|---|---|
|`organizationId`|Yes|Salesforce org identifier|
|`basketId`|Yes|Shopper basket identifier|
|`itemId`|Route param|Identifier of a basket item|

---

## **4. Endpoint Contracts (Detailed)**

### ### **4.1 GET /checkout/basket**
**Purpose:**  
Retrieve the shopper's basket from Salesforce.
**Route:**
`GET /checkout/basket`

**Query Parameters:**

|Name|Required|Description|
|---|---|---|
|`organizationId`|Yes|Org context|
|`basketId`|Yes|Basket to fetch|

**Response (200):**  
Basket JSON (Salesforce standard).

**Notes:**

- Follows SRP: endpoint only retrieves data.
    
- Checkout Service must call:  
    `SalesforceCartClient.getBaskets()`.
    

---

#### **4.2 DELETE /checkout/items/:itemId**

**Purpose:**  
Remove an item from the basket.

**Route:**

`DELETE /checkout/items/:itemId`

**Query Parameters:**

- `organizationId` (req)
    
- `basketId` (req)
    

**Route Parameters:**

- `itemId` (req)
    

**Response (200):**  
Updated Basket JSON without the removed item.

**Mapping:**  
Checkout Service must call:  
`SalesforceCartClient.deleteBasketItems()`.

---

#### **4.3 PATCH /checkout/items/:itemId**

**Purpose:**  
Modify basket item data (quantity, attributes, etc.)

**Route:**

`PATCH /checkout/items/:itemId`

**Body JSON:**

`{   "itemObject": { "quantity": 2 } }`

**Query Parameters:**

- `organizationId` (req)
    
- `basketId` (req)
    

**Response (200):**  
Updated Basket JSON.

**Mapping:**  
Checkout Service must call:  
`SalesforceCartClient.patchBasketItems()`.

---

#### **4.4 POST /checkout/place-order**

**Purpose:**  
Submit the current basket as a final order.

**Route:**

`POST /checkout/place-order`

**Body JSON:** _(optional)_  
Empty — Salesforce does not require extra fields for minimal order creation.

**Query Parameters:**
- `organizationId`
- `basketId`

**Response (201):**  
Submitted Order JSON.

**Mapping:**  
Checkout Service must call:  
`SalesforceCartClient.placeOrder()`.

---

## **5. Input & Output Schemas (TypeBox)**

TypeBox schemas are required for **all endpoint bodies**.

### **Item Patch Schema**

`export const PatchItemSchema = Type.Object({   itemObject: Type.Record(Type.String(), Type.Any()) });`

### **Output Schemas**

Salesforce Basket and Submitted Order schemas must be typed as `Type.Any()` for now, since Salesforce provides large nested structures.

---

## **6. Error Handling Contract**
All errors must follow Feathers error structure.
### Common Errors
|Condition|Status|Error Type|
|---|---|---|
|Missing organizationId|400|BadRequest|
|Missing basketId|400|BadRequest|
|Invalid itemId|400|BadRequest|
|Item not found|404|NotFound|
|Unauthorized|401|NotAuthenticated|
|SF unreachable|503|ServiceUnavailable|

### Error Format
`{   "name": "BadRequest",   "message": "basketId is required",   "code": 400,   "className": "bad-request",   "errors": {} }`

---

## **7. Security, Auth, and Data Flow**

- All endpoints require `Bearer <JWT>` authentication.
    
- Organization and basket IDs must be validated, never trusted blindly.
    
- Salesforce access token must be retrieved via `SalesforceCartClient.getAccessToken`.
    
- Sensitive fields (accessToken, refreshToken) must **never** be logged.
    

---

## **8. Observability & Telemetry**

- All endpoint calls must produce structured logs using the `log-error.ts` hook.
- Minimum tracking fields:
    - `method`
    - `route`
    - `userId`
    - `organizationId`
    - `basketId`
    - `durationMs`
    - `statusCode`
---

## **9. Testing Strategy**

- Unit tests for endpoint validation using Feathers testing utilities.
    
- Integration tests with mocked SalesforceCartClient.
    
- Error-path tests for:
    
    - missing params
        
    - invalid itemId
        
    - Salesforce API failures
        

---

## **10. Implementation Checklist for Claude Code**

1. Generate the Feathers service:  
    `npx feathers generate service`
    
2. Implement routes inside `/src/services/checkout/checkout.ts`
    
3. Inject SalesforceCartClient into `checkout.class.ts`
    
4. Implement the four endpoint handlers exactly as defined:
    
    - GET basket
    - DELETE item
    - PATCH item
    - POST place-order

5. Validate request body using TypeBox schemas
    
6. Use Feathers errors for all failure cases
    
7. Export TypeScript types for all responses
