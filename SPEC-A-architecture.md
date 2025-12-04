### Checkout Application Architecture
>The checkout application is built on top of **FeathersJS** with a minimal setup using the command `npx create-feathers-app checkout`.  The preferred tech stack includes:
- **TypeScript**
- **Express** as the HTTP framework
- **REST API** style
- **Yarn** as the package manager
- **TypeBox** for schema modeling and validation
>This repository contains **only the backend**—no client application is included. For this minimal setup, **no database** was chosen. All source code can be found at `/src`  folder, and all tests at `/test`.

#### Constraints & assumptions
- **Salesforce Basket context is non-persistent**: SF may drop cart state between calls. We must design to rehydrate or replay required context on demand.
- **Security**: Requests should be validated using JWT Token (Bearer JWT), SF also uses JWT Token. We have to manage both within our app.

#### High-level Architecture
- **Experience API**: Exposing REST/JSON end-points for `/checkout` flow.
- **SalesforceAdapter:** `SalesforceCartClient` an interface that encapsulates all calls to Salesforce. It hides SF API versions and implements retry/backoff and corrective rehydration logic.
- **Audit & Observability**: In a real world application, we would use `Sentry` or `DataDog` to store this data. For now, we are gonna stick with the built in `log-error.ts` hook to get this info.

#### Key Abstractions — SOLID Architecture & Implementation Instructions for Claude Code
> Below is the formal specification for the core abstractions that must be implemented.  
All implementation must follow **SOLID principles**, especially:
- **S**ingle Responsibility: Each module handles only one responsibility.
- **O**pen/Closed: Services should be extendable without modifying core logic.
- **L**iskov Substitution: Abstractions should be replaceable with mocks/fakes.
- **I**nterface Segregation: Keep interfaces small and purpose-built.
- **D**ependency Inversion: Higher-level services depend on abstractions, not concrete HTTP clients.

All services must follow the folder convention:  
`/src/services/<serviceName>/`

The base example folder is:  
`/src/services/shoppers/`

#### **1. SalesforceCartClient (Low-Level API Client)**

**Purpose (SRP):**  
A dedicated client responsible solely for communicating with Salesforce APIs.  
No business logic, no Feathers dependencies.

**Location:**  
`/src/services/salesforceCartClient/salesforce.class.ts`

**Required Public Methods:**  
Each method must be `async` and return parsed JSON.

### **Interface**

```jsx
interface SalesforceCartClient {
getAccessToken(organizationId: string): Promise<{ access_token: string; refresh_token: string }>;
getBaskets(organizationId: string, basketId: string): Promise<Basket>;
deleteBasketItems(organizationId: string, basketId: string, itemId: string): Promise<Basket>;
patchBasketItems(organizationId: string, basketId: string,itemId: string,     itemObject: Record<string, any>): Promise<Basket>;
placeOrder(organizationId: string, basketId: string): Promise<SubmittedOrder>;
}
```

#### **Implementation Requirements**
- Use dependency injection for HTTP client (DIP).
- No Feathers imports.
- No state stored inside the class beyond constructor DI.
- Error handling must normalize SF API errors into Feathers-ready exceptions.

#### **2. Checkout Service (High-Level Orchestration Layer)**

**Purpose (SRP):**  
Implements business operations for checkout, using the `SalesforceCartClient` underneath.

**Location:**  
Generated via Feathers CLI, then extended:
`npx feathers generate service`

**Configuration required:**
- **Service name:** `checkout`
- **Registration path:** `/checkout`
- **Authentication:** `yes`
- **Database:** `custom service`
- **Schema:** `TypeBox`

The generated folder will be:  
`/src/services/checkout/`

#### **3. Additional Methods to Add to the Checkout Service**
These methods extend the Feathers service class.  
They must not directly call Salesforce APIs; instead they must rely solely on the `SalesforceCartClient` abstraction (DIP).
##### **Methods**
##### **removeItems(itemId: string): Promise<Basket>**
- Uses SalesforceCartClient.deleteBasketItems
- Returns updated Basket JSON
- No UI logic—pure data operation

#### **patchBasketItems(itemId: string, itemObject: object): Promise<Basket>**
- Uses SalesforceCartClient.patchBasketItems
- Returns updated Basket JSON

#### **placeOrder(): Promise<SubmittedOrder>**
- Uses SalesforceCartClient.placeOrder
- Returns the final order JSON

### **Implementation Requirements**
- Checkout service must accept SalesforceCartClient in its constructor (DIP).
- Checkout service must not perform HTTP calls itself.
- No Salesforce API URLs inside checkout service.
- All DTOs must use TypeBox schemas.
- Each method must validate its inputs via schema before invoking the client.

#### API Diagram for what we have seen so far:
This figure illustrates the end-to-end sequence flow between a Shopper, a Checkout Application, the Salesforce SLAS API, and Salesforce Shopper APIs during a typical checkout lifecycle. It shows how each system interacts during key actions: opening the checkout page, displaying products, modifying the basket, and submitting an order.
![Figure 1](https://github.com/cod3rkane/checkout-cart/blob/main/public/Checkout-API.png?raw=true)

Figure 1

#### Folder Structure Explained 
A FeathersJS application normally has the following folders under `/src`.  
Each folder plays a specific role in organizing services, configuration, hooks, and application logic.
**Note:** This project omits the `src/models` folder because it does not use a database.

#### **`/src/app.ts`**
The main application bootstrap file.

Responsible for:
- Creating the Feathers app instance
- Registering middleware
- Registering services
- Registering channels
- Configuring transports (REST, WebSockets if enabled)
- Exporting the final initialized app
This is the heart of the Feathers application.

#### **`/src/index.ts`**
The application entry point.  
It typically:
- Imports the app from `app.ts`
- Starts the HTTP server
- Handles startup logging and error handling

#### **`/src/services`**
Contains all the service definitions.  
Each Feathers "service" is usually organized into its own folder, e.g.:
```jsx
/src/services/
	├─ shoppers/
	│	├─ shoppers.schema.ts
	│	├─ shoppers.class.ts
	│	├─ shoppers.ts
	├─ checkout/
	│	├─ checkout.schema.ts
	│	├─ checkout.class.ts
	│	├─ checkout.ts
```

**Each service folder typically includes:**
- **`*.service.ts`** → registers the service with Feathers
- **`*.model.ts`** → contains the actual service class (business logic)
- **`*.schema.ts`** → (optional but common) TypeBox schema definitions
- **`*.hooks.ts`** → (optional) hooks applied before/after service methods

#### **`/src/hooks`**
Contains reusable hooks that can be shared across services, such as:
- authorization hooks
- validation hooks
- data transformation hooks
- logging / timing hooks

Example:

```jsx
/src/hooks/log-error.ts
```

#### **`/config`**
Configuration files such as:
- default application config
- environment-specific config overrides
- CORS setup
- REST/WebSocket setup

#### **`/src/utils`**
A place for helpers and shared utilities such as:
- ID generators
- mapping / formatting functions
- external API helpers

