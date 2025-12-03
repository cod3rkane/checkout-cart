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

#### Key abstractions (code-facing)
> The following interfaces and modules should be implemented by Claude Code. Using `/src/services/shoppers` as base to all Services Implementation.

- **SalesforceCartClient**: it should live inside `/src/services/salesforceCartClient/salesforce.class.ts` with the following async methods: 
	- getAccessToken(organizationId): Returns JWT access token and refresh token for SalesForce calls
	- getBaskets(organizationId, basketId): Returns a Basket JSON
	- deleteBasketItems(organizationId, basketId, itemId): Returns Basket JSON updated
	- patchBasketItems(organizationId, basketId, itemId, itemObject): Returns Basket JSON Updated
	- placeOrder(organizationId, basketId): Response Submitted Order JSON
- **Checkout**: This services must be created using: `npx feathers generate service` command, with the following: 
	- Service name: checkout
	- Path to be registed on: checkout
	- Authentication: Yes
	- Database: A custom service
	- Schema: TypeBox
	- On top of this Service, we're gonna generate the following new methods:
		- removeItems(itemId): Returns Basket JSON
		- patchBasketItems(itemId, itemObject): Returns Basket JSON Updated
		- placeOrder(): Returns Submitted Order JSON

#### API Diagram for what we have seen so far:
![API Diagram](https://github.com/cod3rkane/checkout-cart/blob/main/public/Checkout-API.png?raw=true)

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

