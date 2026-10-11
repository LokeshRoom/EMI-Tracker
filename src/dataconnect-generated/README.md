# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetUser*](#getuser)
  - [*ListUsers*](#listusers)
  - [*GetCreditCard*](#getcreditcard)
  - [*ListCreditCards*](#listcreditcards)
  - [*GetEMI*](#getemi)
  - [*ListEMIs*](#listemis)
  - [*GetPayment*](#getpayment)
  - [*ListPayments*](#listpayments)
  - [*GetReminder*](#getreminder)
  - [*ListReminders*](#listreminders)
- [**Mutations**](#mutations)
  - [*CreateUser*](#createuser)
  - [*UpdateUser*](#updateuser)
  - [*DeleteUser*](#deleteuser)
  - [*CreateCreditCard*](#createcreditcard)
  - [*UpdateCreditCard*](#updatecreditcard)
  - [*DeleteCreditCard*](#deletecreditcard)
  - [*CreateEMI*](#createemi)
  - [*UpdateEMI*](#updateemi)
  - [*DeleteEMI*](#deleteemi)
  - [*CreatePayment*](#createpayment)
  - [*UpdatePayment*](#updatepayment)
  - [*DeletePayment*](#deletepayment)
  - [*CreateReminder*](#createreminder)
  - [*UpdateReminder*](#updatereminder)
  - [*DeleteReminder*](#deletereminder)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetUser
You can execute the `GetUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getUser(options?: ExecuteQueryOptions): QueryPromise<GetUserData, undefined>;

interface GetUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUserData, undefined>;
}
export const getUserRef: GetUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUser(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetUserData, undefined>;

interface GetUserRef {
  ...
  (dc: DataConnect): QueryRef<GetUserData, undefined>;
}
export const getUserRef: GetUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserRef:
```typescript
const name = getUserRef.operationName;
console.log(name);
```

### Variables
The `GetUser` query has no variables.
### Return Type
Recall that executing the `GetUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserData {
  user?: {
    email: string;
    name: string;
  };
}
```
### Using `GetUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUser } from '@dataconnect/generated';


// Call the `getUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUser(dataConnect);

console.log(data.user);

// Or, you can use the `Promise` API.
getUser().then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserRef } from '@dataconnect/generated';


// Call the `getUserRef()` function to get a reference to the query.
const ref = getUserRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## ListUsers
You can execute the `ListUsers` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listUsers(options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;

interface ListUsersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUsersData, undefined>;
}
export const listUsersRef: ListUsersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listUsers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;

interface ListUsersRef {
  ...
  (dc: DataConnect): QueryRef<ListUsersData, undefined>;
}
export const listUsersRef: ListUsersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listUsersRef:
```typescript
const name = listUsersRef.operationName;
console.log(name);
```

### Variables
The `ListUsers` query has no variables.
### Return Type
Recall that executing the `ListUsers` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListUsersData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListUsersData {
  users: ({
    name: string;
  })[];
}
```
### Using `ListUsers`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listUsers } from '@dataconnect/generated';


// Call the `listUsers()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listUsers();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listUsers(dataConnect);

console.log(data.users);

// Or, you can use the `Promise` API.
listUsers().then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

### Using `ListUsers`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listUsersRef } from '@dataconnect/generated';


// Call the `listUsersRef()` function to get a reference to the query.
const ref = listUsersRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listUsersRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.users);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

## GetCreditCard
You can execute the `GetCreditCard` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getCreditCard(vars: GetCreditCardVariables, options?: ExecuteQueryOptions): QueryPromise<GetCreditCardData, GetCreditCardVariables>;

interface GetCreditCardRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCreditCardVariables): QueryRef<GetCreditCardData, GetCreditCardVariables>;
}
export const getCreditCardRef: GetCreditCardRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getCreditCard(dc: DataConnect, vars: GetCreditCardVariables, options?: ExecuteQueryOptions): QueryPromise<GetCreditCardData, GetCreditCardVariables>;

interface GetCreditCardRef {
  ...
  (dc: DataConnect, vars: GetCreditCardVariables): QueryRef<GetCreditCardData, GetCreditCardVariables>;
}
export const getCreditCardRef: GetCreditCardRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getCreditCardRef:
```typescript
const name = getCreditCardRef.operationName;
console.log(name);
```

### Variables
The `GetCreditCard` query requires an argument of type `GetCreditCardVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetCreditCardVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetCreditCard` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetCreditCardData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetCreditCardData {
  creditCard?: {
    nickname: string;
    issuerName: string;
  };
}
```
### Using `GetCreditCard`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getCreditCard, GetCreditCardVariables } from '@dataconnect/generated';

// The `GetCreditCard` query requires an argument of type `GetCreditCardVariables`:
const getCreditCardVars: GetCreditCardVariables = {
  id: ..., 
};

// Call the `getCreditCard()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getCreditCard(getCreditCardVars);
// Variables can be defined inline as well.
const { data } = await getCreditCard({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getCreditCard(dataConnect, getCreditCardVars);

console.log(data.creditCard);

// Or, you can use the `Promise` API.
getCreditCard(getCreditCardVars).then((response) => {
  const data = response.data;
  console.log(data.creditCard);
});
```

### Using `GetCreditCard`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getCreditCardRef, GetCreditCardVariables } from '@dataconnect/generated';

// The `GetCreditCard` query requires an argument of type `GetCreditCardVariables`:
const getCreditCardVars: GetCreditCardVariables = {
  id: ..., 
};

// Call the `getCreditCardRef()` function to get a reference to the query.
const ref = getCreditCardRef(getCreditCardVars);
// Variables can be defined inline as well.
const ref = getCreditCardRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getCreditCardRef(dataConnect, getCreditCardVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.creditCard);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.creditCard);
});
```

## ListCreditCards
You can execute the `ListCreditCards` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listCreditCards(options?: ExecuteQueryOptions): QueryPromise<ListCreditCardsData, undefined>;

interface ListCreditCardsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListCreditCardsData, undefined>;
}
export const listCreditCardsRef: ListCreditCardsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listCreditCards(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListCreditCardsData, undefined>;

interface ListCreditCardsRef {
  ...
  (dc: DataConnect): QueryRef<ListCreditCardsData, undefined>;
}
export const listCreditCardsRef: ListCreditCardsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listCreditCardsRef:
```typescript
const name = listCreditCardsRef.operationName;
console.log(name);
```

### Variables
The `ListCreditCards` query has no variables.
### Return Type
Recall that executing the `ListCreditCards` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListCreditCardsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListCreditCardsData {
  creditCards: ({
    nickname: string;
    lastFourDigits: string;
  })[];
}
```
### Using `ListCreditCards`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listCreditCards } from '@dataconnect/generated';


// Call the `listCreditCards()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listCreditCards();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listCreditCards(dataConnect);

console.log(data.creditCards);

// Or, you can use the `Promise` API.
listCreditCards().then((response) => {
  const data = response.data;
  console.log(data.creditCards);
});
```

### Using `ListCreditCards`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listCreditCardsRef } from '@dataconnect/generated';


// Call the `listCreditCardsRef()` function to get a reference to the query.
const ref = listCreditCardsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listCreditCardsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.creditCards);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.creditCards);
});
```

## GetEMI
You can execute the `GetEMI` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getEmi(vars: GetEmiVariables, options?: ExecuteQueryOptions): QueryPromise<GetEmiData, GetEmiVariables>;

interface GetEmiRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetEmiVariables): QueryRef<GetEmiData, GetEmiVariables>;
}
export const getEmiRef: GetEmiRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getEmi(dc: DataConnect, vars: GetEmiVariables, options?: ExecuteQueryOptions): QueryPromise<GetEmiData, GetEmiVariables>;

interface GetEmiRef {
  ...
  (dc: DataConnect, vars: GetEmiVariables): QueryRef<GetEmiData, GetEmiVariables>;
}
export const getEmiRef: GetEmiRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getEmiRef:
```typescript
const name = getEmiRef.operationName;
console.log(name);
```

### Variables
The `GetEMI` query requires an argument of type `GetEmiVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetEmiVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetEMI` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetEmiData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetEmiData {
  eMI?: {
    purchaseName: string;
    totalAmount: number;
  };
}
```
### Using `GetEMI`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getEmi, GetEmiVariables } from '@dataconnect/generated';

// The `GetEMI` query requires an argument of type `GetEmiVariables`:
const getEmiVars: GetEmiVariables = {
  id: ..., 
};

// Call the `getEmi()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getEmi(getEmiVars);
// Variables can be defined inline as well.
const { data } = await getEmi({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getEmi(dataConnect, getEmiVars);

console.log(data.eMI);

// Or, you can use the `Promise` API.
getEmi(getEmiVars).then((response) => {
  const data = response.data;
  console.log(data.eMI);
});
```

### Using `GetEMI`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getEmiRef, GetEmiVariables } from '@dataconnect/generated';

// The `GetEMI` query requires an argument of type `GetEmiVariables`:
const getEmiVars: GetEmiVariables = {
  id: ..., 
};

// Call the `getEmiRef()` function to get a reference to the query.
const ref = getEmiRef(getEmiVars);
// Variables can be defined inline as well.
const ref = getEmiRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getEmiRef(dataConnect, getEmiVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.eMI);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.eMI);
});
```

## ListEMIs
You can execute the `ListEMIs` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listEmIs(options?: ExecuteQueryOptions): QueryPromise<ListEmIsData, undefined>;

interface ListEmIsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListEmIsData, undefined>;
}
export const listEmIsRef: ListEmIsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listEmIs(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListEmIsData, undefined>;

interface ListEmIsRef {
  ...
  (dc: DataConnect): QueryRef<ListEmIsData, undefined>;
}
export const listEmIsRef: ListEmIsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listEmIsRef:
```typescript
const name = listEmIsRef.operationName;
console.log(name);
```

### Variables
The `ListEMIs` query has no variables.
### Return Type
Recall that executing the `ListEMIs` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListEmIsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListEmIsData {
  eMIS: ({
    purchaseName: string;
    nextDueDate: DateString;
  })[];
}
```
### Using `ListEMIs`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listEmIs } from '@dataconnect/generated';


// Call the `listEmIs()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listEmIs();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listEmIs(dataConnect);

console.log(data.eMIS);

// Or, you can use the `Promise` API.
listEmIs().then((response) => {
  const data = response.data;
  console.log(data.eMIS);
});
```

### Using `ListEMIs`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listEmIsRef } from '@dataconnect/generated';


// Call the `listEmIsRef()` function to get a reference to the query.
const ref = listEmIsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listEmIsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.eMIS);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.eMIS);
});
```

## GetPayment
You can execute the `GetPayment` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getPayment(vars: GetPaymentVariables, options?: ExecuteQueryOptions): QueryPromise<GetPaymentData, GetPaymentVariables>;

interface GetPaymentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPaymentVariables): QueryRef<GetPaymentData, GetPaymentVariables>;
}
export const getPaymentRef: GetPaymentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getPayment(dc: DataConnect, vars: GetPaymentVariables, options?: ExecuteQueryOptions): QueryPromise<GetPaymentData, GetPaymentVariables>;

interface GetPaymentRef {
  ...
  (dc: DataConnect, vars: GetPaymentVariables): QueryRef<GetPaymentData, GetPaymentVariables>;
}
export const getPaymentRef: GetPaymentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPaymentRef:
```typescript
const name = getPaymentRef.operationName;
console.log(name);
```

### Variables
The `GetPayment` query requires an argument of type `GetPaymentVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetPaymentVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetPayment` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPaymentData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetPaymentData {
  payment?: {
    amountPaid: number;
    paymentDate: DateString;
  };
}
```
### Using `GetPayment`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getPayment, GetPaymentVariables } from '@dataconnect/generated';

// The `GetPayment` query requires an argument of type `GetPaymentVariables`:
const getPaymentVars: GetPaymentVariables = {
  id: ..., 
};

// Call the `getPayment()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getPayment(getPaymentVars);
// Variables can be defined inline as well.
const { data } = await getPayment({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getPayment(dataConnect, getPaymentVars);

console.log(data.payment);

// Or, you can use the `Promise` API.
getPayment(getPaymentVars).then((response) => {
  const data = response.data;
  console.log(data.payment);
});
```

### Using `GetPayment`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPaymentRef, GetPaymentVariables } from '@dataconnect/generated';

// The `GetPayment` query requires an argument of type `GetPaymentVariables`:
const getPaymentVars: GetPaymentVariables = {
  id: ..., 
};

// Call the `getPaymentRef()` function to get a reference to the query.
const ref = getPaymentRef(getPaymentVars);
// Variables can be defined inline as well.
const ref = getPaymentRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPaymentRef(dataConnect, getPaymentVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.payment);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.payment);
});
```

## ListPayments
You can execute the `ListPayments` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listPayments(options?: ExecuteQueryOptions): QueryPromise<ListPaymentsData, undefined>;

interface ListPaymentsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPaymentsData, undefined>;
}
export const listPaymentsRef: ListPaymentsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listPayments(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListPaymentsData, undefined>;

interface ListPaymentsRef {
  ...
  (dc: DataConnect): QueryRef<ListPaymentsData, undefined>;
}
export const listPaymentsRef: ListPaymentsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listPaymentsRef:
```typescript
const name = listPaymentsRef.operationName;
console.log(name);
```

### Variables
The `ListPayments` query has no variables.
### Return Type
Recall that executing the `ListPayments` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListPaymentsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListPaymentsData {
  payments: ({
    amountPaid: number;
    status: string;
  })[];
}
```
### Using `ListPayments`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listPayments } from '@dataconnect/generated';


// Call the `listPayments()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listPayments();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listPayments(dataConnect);

console.log(data.payments);

// Or, you can use the `Promise` API.
listPayments().then((response) => {
  const data = response.data;
  console.log(data.payments);
});
```

### Using `ListPayments`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listPaymentsRef } from '@dataconnect/generated';


// Call the `listPaymentsRef()` function to get a reference to the query.
const ref = listPaymentsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listPaymentsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.payments);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.payments);
});
```

## GetReminder
You can execute the `GetReminder` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getReminder(vars: GetReminderVariables, options?: ExecuteQueryOptions): QueryPromise<GetReminderData, GetReminderVariables>;

interface GetReminderRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetReminderVariables): QueryRef<GetReminderData, GetReminderVariables>;
}
export const getReminderRef: GetReminderRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getReminder(dc: DataConnect, vars: GetReminderVariables, options?: ExecuteQueryOptions): QueryPromise<GetReminderData, GetReminderVariables>;

interface GetReminderRef {
  ...
  (dc: DataConnect, vars: GetReminderVariables): QueryRef<GetReminderData, GetReminderVariables>;
}
export const getReminderRef: GetReminderRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getReminderRef:
```typescript
const name = getReminderRef.operationName;
console.log(name);
```

### Variables
The `GetReminder` query requires an argument of type `GetReminderVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetReminderVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetReminder` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetReminderData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetReminderData {
  reminder?: {
    leadDays: number;
    isEnabled: boolean;
  };
}
```
### Using `GetReminder`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getReminder, GetReminderVariables } from '@dataconnect/generated';

// The `GetReminder` query requires an argument of type `GetReminderVariables`:
const getReminderVars: GetReminderVariables = {
  id: ..., 
};

// Call the `getReminder()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getReminder(getReminderVars);
// Variables can be defined inline as well.
const { data } = await getReminder({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getReminder(dataConnect, getReminderVars);

console.log(data.reminder);

// Or, you can use the `Promise` API.
getReminder(getReminderVars).then((response) => {
  const data = response.data;
  console.log(data.reminder);
});
```

### Using `GetReminder`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getReminderRef, GetReminderVariables } from '@dataconnect/generated';

// The `GetReminder` query requires an argument of type `GetReminderVariables`:
const getReminderVars: GetReminderVariables = {
  id: ..., 
};

// Call the `getReminderRef()` function to get a reference to the query.
const ref = getReminderRef(getReminderVars);
// Variables can be defined inline as well.
const ref = getReminderRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getReminderRef(dataConnect, getReminderVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.reminder);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.reminder);
});
```

## ListReminders
You can execute the `ListReminders` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listReminders(options?: ExecuteQueryOptions): QueryPromise<ListRemindersData, undefined>;

interface ListRemindersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListRemindersData, undefined>;
}
export const listRemindersRef: ListRemindersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listReminders(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListRemindersData, undefined>;

interface ListRemindersRef {
  ...
  (dc: DataConnect): QueryRef<ListRemindersData, undefined>;
}
export const listRemindersRef: ListRemindersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listRemindersRef:
```typescript
const name = listRemindersRef.operationName;
console.log(name);
```

### Variables
The `ListReminders` query has no variables.
### Return Type
Recall that executing the `ListReminders` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListRemindersData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListRemindersData {
  reminders: ({
    leadDays: number;
    isEnabled: boolean;
  })[];
}
```
### Using `ListReminders`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listReminders } from '@dataconnect/generated';


// Call the `listReminders()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listReminders();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listReminders(dataConnect);

console.log(data.reminders);

// Or, you can use the `Promise` API.
listReminders().then((response) => {
  const data = response.data;
  console.log(data.reminders);
});
```

### Using `ListReminders`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listRemindersRef } from '@dataconnect/generated';


// Call the `listRemindersRef()` function to get a reference to the query.
const ref = listRemindersRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listRemindersRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.reminders);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.reminders);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateUser
You can execute the `CreateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createUser(): MutationPromise<CreateUserData, undefined>;

interface CreateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateUserData, undefined>;
}
export const createUserRef: CreateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUser(dc: DataConnect): MutationPromise<CreateUserData, undefined>;

interface CreateUserRef {
  ...
  (dc: DataConnect): MutationRef<CreateUserData, undefined>;
}
export const createUserRef: CreateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserRef:
```typescript
const name = createUserRef.operationName;
console.log(name);
```

### Variables
The `CreateUser` mutation has no variables.
### Return Type
Recall that executing the `CreateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserData {
  user_insert: User_Key;
}
```
### Using `CreateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUser } from '@dataconnect/generated';


// Call the `createUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUser(dataConnect);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
createUser().then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `CreateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserRef } from '@dataconnect/generated';


// Call the `createUserRef()` function to get a reference to the mutation.
const ref = createUserRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## UpdateUser
You can execute the `UpdateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateUser(): MutationPromise<UpdateUserData, undefined>;

interface UpdateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<UpdateUserData, undefined>;
}
export const updateUserRef: UpdateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateUser(dc: DataConnect): MutationPromise<UpdateUserData, undefined>;

interface UpdateUserRef {
  ...
  (dc: DataConnect): MutationRef<UpdateUserData, undefined>;
}
export const updateUserRef: UpdateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateUserRef:
```typescript
const name = updateUserRef.operationName;
console.log(name);
```

### Variables
The `UpdateUser` mutation has no variables.
### Return Type
Recall that executing the `UpdateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateUserData {
  user_update?: User_Key | null;
}
```
### Using `UpdateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateUser } from '@dataconnect/generated';


// Call the `updateUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateUser(dataConnect);

console.log(data.user_update);

// Or, you can use the `Promise` API.
updateUser().then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

### Using `UpdateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateUserRef } from '@dataconnect/generated';


// Call the `updateUserRef()` function to get a reference to the mutation.
const ref = updateUserRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateUserRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

## DeleteUser
You can execute the `DeleteUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteUser(): MutationPromise<DeleteUserData, undefined>;

interface DeleteUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<DeleteUserData, undefined>;
}
export const deleteUserRef: DeleteUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteUser(dc: DataConnect): MutationPromise<DeleteUserData, undefined>;

interface DeleteUserRef {
  ...
  (dc: DataConnect): MutationRef<DeleteUserData, undefined>;
}
export const deleteUserRef: DeleteUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteUserRef:
```typescript
const name = deleteUserRef.operationName;
console.log(name);
```

### Variables
The `DeleteUser` mutation has no variables.
### Return Type
Recall that executing the `DeleteUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteUserData {
  user_delete?: User_Key | null;
}
```
### Using `DeleteUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteUser } from '@dataconnect/generated';


// Call the `deleteUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteUser(dataConnect);

console.log(data.user_delete);

// Or, you can use the `Promise` API.
deleteUser().then((response) => {
  const data = response.data;
  console.log(data.user_delete);
});
```

### Using `DeleteUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteUserRef } from '@dataconnect/generated';


// Call the `deleteUserRef()` function to get a reference to the mutation.
const ref = deleteUserRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteUserRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_delete);
});
```

## CreateCreditCard
You can execute the `CreateCreditCard` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createCreditCard(vars: CreateCreditCardVariables): MutationPromise<CreateCreditCardData, CreateCreditCardVariables>;

interface CreateCreditCardRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCreditCardVariables): MutationRef<CreateCreditCardData, CreateCreditCardVariables>;
}
export const createCreditCardRef: CreateCreditCardRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createCreditCard(dc: DataConnect, vars: CreateCreditCardVariables): MutationPromise<CreateCreditCardData, CreateCreditCardVariables>;

interface CreateCreditCardRef {
  ...
  (dc: DataConnect, vars: CreateCreditCardVariables): MutationRef<CreateCreditCardData, CreateCreditCardVariables>;
}
export const createCreditCardRef: CreateCreditCardRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createCreditCardRef:
```typescript
const name = createCreditCardRef.operationName;
console.log(name);
```

### Variables
The `CreateCreditCard` mutation requires an argument of type `CreateCreditCardVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateCreditCardVariables {
  nickname: string;
  issuerName: string;
  lastFourDigits: string;
}
```
### Return Type
Recall that executing the `CreateCreditCard` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateCreditCardData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateCreditCardData {
  creditCard_insert: CreditCard_Key;
}
```
### Using `CreateCreditCard`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createCreditCard, CreateCreditCardVariables } from '@dataconnect/generated';

// The `CreateCreditCard` mutation requires an argument of type `CreateCreditCardVariables`:
const createCreditCardVars: CreateCreditCardVariables = {
  nickname: ..., 
  issuerName: ..., 
  lastFourDigits: ..., 
};

// Call the `createCreditCard()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createCreditCard(createCreditCardVars);
// Variables can be defined inline as well.
const { data } = await createCreditCard({ nickname: ..., issuerName: ..., lastFourDigits: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createCreditCard(dataConnect, createCreditCardVars);

console.log(data.creditCard_insert);

// Or, you can use the `Promise` API.
createCreditCard(createCreditCardVars).then((response) => {
  const data = response.data;
  console.log(data.creditCard_insert);
});
```

### Using `CreateCreditCard`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createCreditCardRef, CreateCreditCardVariables } from '@dataconnect/generated';

// The `CreateCreditCard` mutation requires an argument of type `CreateCreditCardVariables`:
const createCreditCardVars: CreateCreditCardVariables = {
  nickname: ..., 
  issuerName: ..., 
  lastFourDigits: ..., 
};

// Call the `createCreditCardRef()` function to get a reference to the mutation.
const ref = createCreditCardRef(createCreditCardVars);
// Variables can be defined inline as well.
const ref = createCreditCardRef({ nickname: ..., issuerName: ..., lastFourDigits: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createCreditCardRef(dataConnect, createCreditCardVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.creditCard_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.creditCard_insert);
});
```

## UpdateCreditCard
You can execute the `UpdateCreditCard` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateCreditCard(vars: UpdateCreditCardVariables): MutationPromise<UpdateCreditCardData, UpdateCreditCardVariables>;

interface UpdateCreditCardRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateCreditCardVariables): MutationRef<UpdateCreditCardData, UpdateCreditCardVariables>;
}
export const updateCreditCardRef: UpdateCreditCardRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateCreditCard(dc: DataConnect, vars: UpdateCreditCardVariables): MutationPromise<UpdateCreditCardData, UpdateCreditCardVariables>;

interface UpdateCreditCardRef {
  ...
  (dc: DataConnect, vars: UpdateCreditCardVariables): MutationRef<UpdateCreditCardData, UpdateCreditCardVariables>;
}
export const updateCreditCardRef: UpdateCreditCardRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateCreditCardRef:
```typescript
const name = updateCreditCardRef.operationName;
console.log(name);
```

### Variables
The `UpdateCreditCard` mutation requires an argument of type `UpdateCreditCardVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateCreditCardVariables {
  id: UUIDString;
  nickname: string;
}
```
### Return Type
Recall that executing the `UpdateCreditCard` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateCreditCardData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateCreditCardData {
  creditCard_update?: CreditCard_Key | null;
}
```
### Using `UpdateCreditCard`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateCreditCard, UpdateCreditCardVariables } from '@dataconnect/generated';

// The `UpdateCreditCard` mutation requires an argument of type `UpdateCreditCardVariables`:
const updateCreditCardVars: UpdateCreditCardVariables = {
  id: ..., 
  nickname: ..., 
};

// Call the `updateCreditCard()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateCreditCard(updateCreditCardVars);
// Variables can be defined inline as well.
const { data } = await updateCreditCard({ id: ..., nickname: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateCreditCard(dataConnect, updateCreditCardVars);

console.log(data.creditCard_update);

// Or, you can use the `Promise` API.
updateCreditCard(updateCreditCardVars).then((response) => {
  const data = response.data;
  console.log(data.creditCard_update);
});
```

### Using `UpdateCreditCard`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateCreditCardRef, UpdateCreditCardVariables } from '@dataconnect/generated';

// The `UpdateCreditCard` mutation requires an argument of type `UpdateCreditCardVariables`:
const updateCreditCardVars: UpdateCreditCardVariables = {
  id: ..., 
  nickname: ..., 
};

// Call the `updateCreditCardRef()` function to get a reference to the mutation.
const ref = updateCreditCardRef(updateCreditCardVars);
// Variables can be defined inline as well.
const ref = updateCreditCardRef({ id: ..., nickname: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateCreditCardRef(dataConnect, updateCreditCardVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.creditCard_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.creditCard_update);
});
```

## DeleteCreditCard
You can execute the `DeleteCreditCard` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteCreditCard(vars: DeleteCreditCardVariables): MutationPromise<DeleteCreditCardData, DeleteCreditCardVariables>;

interface DeleteCreditCardRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteCreditCardVariables): MutationRef<DeleteCreditCardData, DeleteCreditCardVariables>;
}
export const deleteCreditCardRef: DeleteCreditCardRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteCreditCard(dc: DataConnect, vars: DeleteCreditCardVariables): MutationPromise<DeleteCreditCardData, DeleteCreditCardVariables>;

interface DeleteCreditCardRef {
  ...
  (dc: DataConnect, vars: DeleteCreditCardVariables): MutationRef<DeleteCreditCardData, DeleteCreditCardVariables>;
}
export const deleteCreditCardRef: DeleteCreditCardRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteCreditCardRef:
```typescript
const name = deleteCreditCardRef.operationName;
console.log(name);
```

### Variables
The `DeleteCreditCard` mutation requires an argument of type `DeleteCreditCardVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteCreditCardVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteCreditCard` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteCreditCardData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteCreditCardData {
  creditCard_delete?: CreditCard_Key | null;
}
```
### Using `DeleteCreditCard`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteCreditCard, DeleteCreditCardVariables } from '@dataconnect/generated';

// The `DeleteCreditCard` mutation requires an argument of type `DeleteCreditCardVariables`:
const deleteCreditCardVars: DeleteCreditCardVariables = {
  id: ..., 
};

// Call the `deleteCreditCard()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteCreditCard(deleteCreditCardVars);
// Variables can be defined inline as well.
const { data } = await deleteCreditCard({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteCreditCard(dataConnect, deleteCreditCardVars);

console.log(data.creditCard_delete);

// Or, you can use the `Promise` API.
deleteCreditCard(deleteCreditCardVars).then((response) => {
  const data = response.data;
  console.log(data.creditCard_delete);
});
```

### Using `DeleteCreditCard`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteCreditCardRef, DeleteCreditCardVariables } from '@dataconnect/generated';

// The `DeleteCreditCard` mutation requires an argument of type `DeleteCreditCardVariables`:
const deleteCreditCardVars: DeleteCreditCardVariables = {
  id: ..., 
};

// Call the `deleteCreditCardRef()` function to get a reference to the mutation.
const ref = deleteCreditCardRef(deleteCreditCardVars);
// Variables can be defined inline as well.
const ref = deleteCreditCardRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteCreditCardRef(dataConnect, deleteCreditCardVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.creditCard_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.creditCard_delete);
});
```

## CreateEMI
You can execute the `CreateEMI` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createEmi(vars: CreateEmiVariables): MutationPromise<CreateEmiData, CreateEmiVariables>;

interface CreateEmiRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateEmiVariables): MutationRef<CreateEmiData, CreateEmiVariables>;
}
export const createEmiRef: CreateEmiRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createEmi(dc: DataConnect, vars: CreateEmiVariables): MutationPromise<CreateEmiData, CreateEmiVariables>;

interface CreateEmiRef {
  ...
  (dc: DataConnect, vars: CreateEmiVariables): MutationRef<CreateEmiData, CreateEmiVariables>;
}
export const createEmiRef: CreateEmiRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createEmiRef:
```typescript
const name = createEmiRef.operationName;
console.log(name);
```

### Variables
The `CreateEMI` mutation requires an argument of type `CreateEmiVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateEmiVariables {
  purchaseName: string;
  totalAmount: number;
  monthlyAmount: number;
  interestRate: number;
  totalInstallments: number;
  startDate: DateString;
  nextDueDate: DateString;
  creditCardId: UUIDString;
}
```
### Return Type
Recall that executing the `CreateEMI` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateEmiData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateEmiData {
  eMI_insert: EMI_Key;
}
```
### Using `CreateEMI`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createEmi, CreateEmiVariables } from '@dataconnect/generated';

// The `CreateEMI` mutation requires an argument of type `CreateEmiVariables`:
const createEmiVars: CreateEmiVariables = {
  purchaseName: ..., 
  totalAmount: ..., 
  monthlyAmount: ..., 
  interestRate: ..., 
  totalInstallments: ..., 
  startDate: ..., 
  nextDueDate: ..., 
  creditCardId: ..., 
};

// Call the `createEmi()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createEmi(createEmiVars);
// Variables can be defined inline as well.
const { data } = await createEmi({ purchaseName: ..., totalAmount: ..., monthlyAmount: ..., interestRate: ..., totalInstallments: ..., startDate: ..., nextDueDate: ..., creditCardId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createEmi(dataConnect, createEmiVars);

console.log(data.eMI_insert);

// Or, you can use the `Promise` API.
createEmi(createEmiVars).then((response) => {
  const data = response.data;
  console.log(data.eMI_insert);
});
```

### Using `CreateEMI`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createEmiRef, CreateEmiVariables } from '@dataconnect/generated';

// The `CreateEMI` mutation requires an argument of type `CreateEmiVariables`:
const createEmiVars: CreateEmiVariables = {
  purchaseName: ..., 
  totalAmount: ..., 
  monthlyAmount: ..., 
  interestRate: ..., 
  totalInstallments: ..., 
  startDate: ..., 
  nextDueDate: ..., 
  creditCardId: ..., 
};

// Call the `createEmiRef()` function to get a reference to the mutation.
const ref = createEmiRef(createEmiVars);
// Variables can be defined inline as well.
const ref = createEmiRef({ purchaseName: ..., totalAmount: ..., monthlyAmount: ..., interestRate: ..., totalInstallments: ..., startDate: ..., nextDueDate: ..., creditCardId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createEmiRef(dataConnect, createEmiVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.eMI_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.eMI_insert);
});
```

## UpdateEMI
You can execute the `UpdateEMI` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateEmi(vars: UpdateEmiVariables): MutationPromise<UpdateEmiData, UpdateEmiVariables>;

interface UpdateEmiRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateEmiVariables): MutationRef<UpdateEmiData, UpdateEmiVariables>;
}
export const updateEmiRef: UpdateEmiRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateEmi(dc: DataConnect, vars: UpdateEmiVariables): MutationPromise<UpdateEmiData, UpdateEmiVariables>;

interface UpdateEmiRef {
  ...
  (dc: DataConnect, vars: UpdateEmiVariables): MutationRef<UpdateEmiData, UpdateEmiVariables>;
}
export const updateEmiRef: UpdateEmiRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateEmiRef:
```typescript
const name = updateEmiRef.operationName;
console.log(name);
```

### Variables
The `UpdateEMI` mutation requires an argument of type `UpdateEmiVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateEmiVariables {
  id: UUIDString;
  status: string;
}
```
### Return Type
Recall that executing the `UpdateEMI` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateEmiData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateEmiData {
  eMI_update?: EMI_Key | null;
}
```
### Using `UpdateEMI`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateEmi, UpdateEmiVariables } from '@dataconnect/generated';

// The `UpdateEMI` mutation requires an argument of type `UpdateEmiVariables`:
const updateEmiVars: UpdateEmiVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateEmi()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateEmi(updateEmiVars);
// Variables can be defined inline as well.
const { data } = await updateEmi({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateEmi(dataConnect, updateEmiVars);

console.log(data.eMI_update);

// Or, you can use the `Promise` API.
updateEmi(updateEmiVars).then((response) => {
  const data = response.data;
  console.log(data.eMI_update);
});
```

### Using `UpdateEMI`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateEmiRef, UpdateEmiVariables } from '@dataconnect/generated';

// The `UpdateEMI` mutation requires an argument of type `UpdateEmiVariables`:
const updateEmiVars: UpdateEmiVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateEmiRef()` function to get a reference to the mutation.
const ref = updateEmiRef(updateEmiVars);
// Variables can be defined inline as well.
const ref = updateEmiRef({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateEmiRef(dataConnect, updateEmiVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.eMI_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.eMI_update);
});
```

## DeleteEMI
You can execute the `DeleteEMI` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteEmi(vars: DeleteEmiVariables): MutationPromise<DeleteEmiData, DeleteEmiVariables>;

interface DeleteEmiRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteEmiVariables): MutationRef<DeleteEmiData, DeleteEmiVariables>;
}
export const deleteEmiRef: DeleteEmiRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteEmi(dc: DataConnect, vars: DeleteEmiVariables): MutationPromise<DeleteEmiData, DeleteEmiVariables>;

interface DeleteEmiRef {
  ...
  (dc: DataConnect, vars: DeleteEmiVariables): MutationRef<DeleteEmiData, DeleteEmiVariables>;
}
export const deleteEmiRef: DeleteEmiRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteEmiRef:
```typescript
const name = deleteEmiRef.operationName;
console.log(name);
```

### Variables
The `DeleteEMI` mutation requires an argument of type `DeleteEmiVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteEmiVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteEMI` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteEmiData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteEmiData {
  eMI_delete?: EMI_Key | null;
}
```
### Using `DeleteEMI`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteEmi, DeleteEmiVariables } from '@dataconnect/generated';

// The `DeleteEMI` mutation requires an argument of type `DeleteEmiVariables`:
const deleteEmiVars: DeleteEmiVariables = {
  id: ..., 
};

// Call the `deleteEmi()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteEmi(deleteEmiVars);
// Variables can be defined inline as well.
const { data } = await deleteEmi({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteEmi(dataConnect, deleteEmiVars);

console.log(data.eMI_delete);

// Or, you can use the `Promise` API.
deleteEmi(deleteEmiVars).then((response) => {
  const data = response.data;
  console.log(data.eMI_delete);
});
```

### Using `DeleteEMI`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteEmiRef, DeleteEmiVariables } from '@dataconnect/generated';

// The `DeleteEMI` mutation requires an argument of type `DeleteEmiVariables`:
const deleteEmiVars: DeleteEmiVariables = {
  id: ..., 
};

// Call the `deleteEmiRef()` function to get a reference to the mutation.
const ref = deleteEmiRef(deleteEmiVars);
// Variables can be defined inline as well.
const ref = deleteEmiRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteEmiRef(dataConnect, deleteEmiVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.eMI_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.eMI_delete);
});
```

## CreatePayment
You can execute the `CreatePayment` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createPayment(vars: CreatePaymentVariables): MutationPromise<CreatePaymentData, CreatePaymentVariables>;

interface CreatePaymentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePaymentVariables): MutationRef<CreatePaymentData, CreatePaymentVariables>;
}
export const createPaymentRef: CreatePaymentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createPayment(dc: DataConnect, vars: CreatePaymentVariables): MutationPromise<CreatePaymentData, CreatePaymentVariables>;

interface CreatePaymentRef {
  ...
  (dc: DataConnect, vars: CreatePaymentVariables): MutationRef<CreatePaymentData, CreatePaymentVariables>;
}
export const createPaymentRef: CreatePaymentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createPaymentRef:
```typescript
const name = createPaymentRef.operationName;
console.log(name);
```

### Variables
The `CreatePayment` mutation requires an argument of type `CreatePaymentVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreatePaymentVariables {
  paymentDate: DateString;
  amountPaid: number;
  status: string;
  emiId: UUIDString;
}
```
### Return Type
Recall that executing the `CreatePayment` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreatePaymentData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreatePaymentData {
  payment_insert: Payment_Key;
}
```
### Using `CreatePayment`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createPayment, CreatePaymentVariables } from '@dataconnect/generated';

// The `CreatePayment` mutation requires an argument of type `CreatePaymentVariables`:
const createPaymentVars: CreatePaymentVariables = {
  paymentDate: ..., 
  amountPaid: ..., 
  status: ..., 
  emiId: ..., 
};

// Call the `createPayment()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createPayment(createPaymentVars);
// Variables can be defined inline as well.
const { data } = await createPayment({ paymentDate: ..., amountPaid: ..., status: ..., emiId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createPayment(dataConnect, createPaymentVars);

console.log(data.payment_insert);

// Or, you can use the `Promise` API.
createPayment(createPaymentVars).then((response) => {
  const data = response.data;
  console.log(data.payment_insert);
});
```

### Using `CreatePayment`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createPaymentRef, CreatePaymentVariables } from '@dataconnect/generated';

// The `CreatePayment` mutation requires an argument of type `CreatePaymentVariables`:
const createPaymentVars: CreatePaymentVariables = {
  paymentDate: ..., 
  amountPaid: ..., 
  status: ..., 
  emiId: ..., 
};

// Call the `createPaymentRef()` function to get a reference to the mutation.
const ref = createPaymentRef(createPaymentVars);
// Variables can be defined inline as well.
const ref = createPaymentRef({ paymentDate: ..., amountPaid: ..., status: ..., emiId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createPaymentRef(dataConnect, createPaymentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.payment_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.payment_insert);
});
```

## UpdatePayment
You can execute the `UpdatePayment` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updatePayment(vars: UpdatePaymentVariables): MutationPromise<UpdatePaymentData, UpdatePaymentVariables>;

interface UpdatePaymentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdatePaymentVariables): MutationRef<UpdatePaymentData, UpdatePaymentVariables>;
}
export const updatePaymentRef: UpdatePaymentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updatePayment(dc: DataConnect, vars: UpdatePaymentVariables): MutationPromise<UpdatePaymentData, UpdatePaymentVariables>;

interface UpdatePaymentRef {
  ...
  (dc: DataConnect, vars: UpdatePaymentVariables): MutationRef<UpdatePaymentData, UpdatePaymentVariables>;
}
export const updatePaymentRef: UpdatePaymentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updatePaymentRef:
```typescript
const name = updatePaymentRef.operationName;
console.log(name);
```

### Variables
The `UpdatePayment` mutation requires an argument of type `UpdatePaymentVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdatePaymentVariables {
  id: UUIDString;
  status: string;
}
```
### Return Type
Recall that executing the `UpdatePayment` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdatePaymentData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdatePaymentData {
  payment_update?: Payment_Key | null;
}
```
### Using `UpdatePayment`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updatePayment, UpdatePaymentVariables } from '@dataconnect/generated';

// The `UpdatePayment` mutation requires an argument of type `UpdatePaymentVariables`:
const updatePaymentVars: UpdatePaymentVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updatePayment()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updatePayment(updatePaymentVars);
// Variables can be defined inline as well.
const { data } = await updatePayment({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updatePayment(dataConnect, updatePaymentVars);

console.log(data.payment_update);

// Or, you can use the `Promise` API.
updatePayment(updatePaymentVars).then((response) => {
  const data = response.data;
  console.log(data.payment_update);
});
```

### Using `UpdatePayment`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updatePaymentRef, UpdatePaymentVariables } from '@dataconnect/generated';

// The `UpdatePayment` mutation requires an argument of type `UpdatePaymentVariables`:
const updatePaymentVars: UpdatePaymentVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updatePaymentRef()` function to get a reference to the mutation.
const ref = updatePaymentRef(updatePaymentVars);
// Variables can be defined inline as well.
const ref = updatePaymentRef({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updatePaymentRef(dataConnect, updatePaymentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.payment_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.payment_update);
});
```

## DeletePayment
You can execute the `DeletePayment` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deletePayment(vars: DeletePaymentVariables): MutationPromise<DeletePaymentData, DeletePaymentVariables>;

interface DeletePaymentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeletePaymentVariables): MutationRef<DeletePaymentData, DeletePaymentVariables>;
}
export const deletePaymentRef: DeletePaymentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deletePayment(dc: DataConnect, vars: DeletePaymentVariables): MutationPromise<DeletePaymentData, DeletePaymentVariables>;

interface DeletePaymentRef {
  ...
  (dc: DataConnect, vars: DeletePaymentVariables): MutationRef<DeletePaymentData, DeletePaymentVariables>;
}
export const deletePaymentRef: DeletePaymentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deletePaymentRef:
```typescript
const name = deletePaymentRef.operationName;
console.log(name);
```

### Variables
The `DeletePayment` mutation requires an argument of type `DeletePaymentVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeletePaymentVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeletePayment` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeletePaymentData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeletePaymentData {
  payment_delete?: Payment_Key | null;
}
```
### Using `DeletePayment`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deletePayment, DeletePaymentVariables } from '@dataconnect/generated';

// The `DeletePayment` mutation requires an argument of type `DeletePaymentVariables`:
const deletePaymentVars: DeletePaymentVariables = {
  id: ..., 
};

// Call the `deletePayment()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deletePayment(deletePaymentVars);
// Variables can be defined inline as well.
const { data } = await deletePayment({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deletePayment(dataConnect, deletePaymentVars);

console.log(data.payment_delete);

// Or, you can use the `Promise` API.
deletePayment(deletePaymentVars).then((response) => {
  const data = response.data;
  console.log(data.payment_delete);
});
```

### Using `DeletePayment`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deletePaymentRef, DeletePaymentVariables } from '@dataconnect/generated';

// The `DeletePayment` mutation requires an argument of type `DeletePaymentVariables`:
const deletePaymentVars: DeletePaymentVariables = {
  id: ..., 
};

// Call the `deletePaymentRef()` function to get a reference to the mutation.
const ref = deletePaymentRef(deletePaymentVars);
// Variables can be defined inline as well.
const ref = deletePaymentRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deletePaymentRef(dataConnect, deletePaymentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.payment_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.payment_delete);
});
```

## CreateReminder
You can execute the `CreateReminder` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createReminder(vars: CreateReminderVariables): MutationPromise<CreateReminderData, CreateReminderVariables>;

interface CreateReminderRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateReminderVariables): MutationRef<CreateReminderData, CreateReminderVariables>;
}
export const createReminderRef: CreateReminderRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createReminder(dc: DataConnect, vars: CreateReminderVariables): MutationPromise<CreateReminderData, CreateReminderVariables>;

interface CreateReminderRef {
  ...
  (dc: DataConnect, vars: CreateReminderVariables): MutationRef<CreateReminderData, CreateReminderVariables>;
}
export const createReminderRef: CreateReminderRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createReminderRef:
```typescript
const name = createReminderRef.operationName;
console.log(name);
```

### Variables
The `CreateReminder` mutation requires an argument of type `CreateReminderVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateReminderVariables {
  leadDays: number;
  isEnabled: boolean;
}
```
### Return Type
Recall that executing the `CreateReminder` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateReminderData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateReminderData {
  reminder_insert: Reminder_Key;
}
```
### Using `CreateReminder`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createReminder, CreateReminderVariables } from '@dataconnect/generated';

// The `CreateReminder` mutation requires an argument of type `CreateReminderVariables`:
const createReminderVars: CreateReminderVariables = {
  leadDays: ..., 
  isEnabled: ..., 
};

// Call the `createReminder()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createReminder(createReminderVars);
// Variables can be defined inline as well.
const { data } = await createReminder({ leadDays: ..., isEnabled: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createReminder(dataConnect, createReminderVars);

console.log(data.reminder_insert);

// Or, you can use the `Promise` API.
createReminder(createReminderVars).then((response) => {
  const data = response.data;
  console.log(data.reminder_insert);
});
```

### Using `CreateReminder`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createReminderRef, CreateReminderVariables } from '@dataconnect/generated';

// The `CreateReminder` mutation requires an argument of type `CreateReminderVariables`:
const createReminderVars: CreateReminderVariables = {
  leadDays: ..., 
  isEnabled: ..., 
};

// Call the `createReminderRef()` function to get a reference to the mutation.
const ref = createReminderRef(createReminderVars);
// Variables can be defined inline as well.
const ref = createReminderRef({ leadDays: ..., isEnabled: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createReminderRef(dataConnect, createReminderVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.reminder_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.reminder_insert);
});
```

## UpdateReminder
You can execute the `UpdateReminder` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateReminder(vars: UpdateReminderVariables): MutationPromise<UpdateReminderData, UpdateReminderVariables>;

interface UpdateReminderRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateReminderVariables): MutationRef<UpdateReminderData, UpdateReminderVariables>;
}
export const updateReminderRef: UpdateReminderRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateReminder(dc: DataConnect, vars: UpdateReminderVariables): MutationPromise<UpdateReminderData, UpdateReminderVariables>;

interface UpdateReminderRef {
  ...
  (dc: DataConnect, vars: UpdateReminderVariables): MutationRef<UpdateReminderData, UpdateReminderVariables>;
}
export const updateReminderRef: UpdateReminderRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateReminderRef:
```typescript
const name = updateReminderRef.operationName;
console.log(name);
```

### Variables
The `UpdateReminder` mutation requires an argument of type `UpdateReminderVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateReminderVariables {
  id: UUIDString;
  isEnabled: boolean;
}
```
### Return Type
Recall that executing the `UpdateReminder` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateReminderData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateReminderData {
  reminder_update?: Reminder_Key | null;
}
```
### Using `UpdateReminder`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateReminder, UpdateReminderVariables } from '@dataconnect/generated';

// The `UpdateReminder` mutation requires an argument of type `UpdateReminderVariables`:
const updateReminderVars: UpdateReminderVariables = {
  id: ..., 
  isEnabled: ..., 
};

// Call the `updateReminder()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateReminder(updateReminderVars);
// Variables can be defined inline as well.
const { data } = await updateReminder({ id: ..., isEnabled: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateReminder(dataConnect, updateReminderVars);

console.log(data.reminder_update);

// Or, you can use the `Promise` API.
updateReminder(updateReminderVars).then((response) => {
  const data = response.data;
  console.log(data.reminder_update);
});
```

### Using `UpdateReminder`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateReminderRef, UpdateReminderVariables } from '@dataconnect/generated';

// The `UpdateReminder` mutation requires an argument of type `UpdateReminderVariables`:
const updateReminderVars: UpdateReminderVariables = {
  id: ..., 
  isEnabled: ..., 
};

// Call the `updateReminderRef()` function to get a reference to the mutation.
const ref = updateReminderRef(updateReminderVars);
// Variables can be defined inline as well.
const ref = updateReminderRef({ id: ..., isEnabled: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateReminderRef(dataConnect, updateReminderVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.reminder_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.reminder_update);
});
```

## DeleteReminder
You can execute the `DeleteReminder` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteReminder(vars: DeleteReminderVariables): MutationPromise<DeleteReminderData, DeleteReminderVariables>;

interface DeleteReminderRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteReminderVariables): MutationRef<DeleteReminderData, DeleteReminderVariables>;
}
export const deleteReminderRef: DeleteReminderRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteReminder(dc: DataConnect, vars: DeleteReminderVariables): MutationPromise<DeleteReminderData, DeleteReminderVariables>;

interface DeleteReminderRef {
  ...
  (dc: DataConnect, vars: DeleteReminderVariables): MutationRef<DeleteReminderData, DeleteReminderVariables>;
}
export const deleteReminderRef: DeleteReminderRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteReminderRef:
```typescript
const name = deleteReminderRef.operationName;
console.log(name);
```

### Variables
The `DeleteReminder` mutation requires an argument of type `DeleteReminderVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteReminderVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteReminder` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteReminderData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteReminderData {
  reminder_delete?: Reminder_Key | null;
}
```
### Using `DeleteReminder`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteReminder, DeleteReminderVariables } from '@dataconnect/generated';

// The `DeleteReminder` mutation requires an argument of type `DeleteReminderVariables`:
const deleteReminderVars: DeleteReminderVariables = {
  id: ..., 
};

// Call the `deleteReminder()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteReminder(deleteReminderVars);
// Variables can be defined inline as well.
const { data } = await deleteReminder({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteReminder(dataConnect, deleteReminderVars);

console.log(data.reminder_delete);

// Or, you can use the `Promise` API.
deleteReminder(deleteReminderVars).then((response) => {
  const data = response.data;
  console.log(data.reminder_delete);
});
```

### Using `DeleteReminder`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteReminderRef, DeleteReminderVariables } from '@dataconnect/generated';

// The `DeleteReminder` mutation requires an argument of type `DeleteReminderVariables`:
const deleteReminderVars: DeleteReminderVariables = {
  id: ..., 
};

// Call the `deleteReminderRef()` function to get a reference to the mutation.
const ref = deleteReminderRef(deleteReminderVars);
// Variables can be defined inline as well.
const ref = deleteReminderRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteReminderRef(dataConnect, deleteReminderVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.reminder_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.reminder_delete);
});
```

