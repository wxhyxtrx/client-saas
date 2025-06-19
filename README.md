# client-saas

`client-saas` is a TypeScript-based HTTP client for SAAS platform integration, built using Axios. It provides a `fetch` method that handles token-based communication, request/response separation (`in` and `out`), idempotency key generation, and automatic retrying.

---

## 🚀 Features

- 🔒 Token-based request authorization
- 🔁 Built-in retry logic (default 3x)
- 🧠 Separation of input/output requests (requestIn & requestOut)
- 🆔 Auto-generated Idempotency Key support
- ✅ Full TypeScript support
- ⚙️ Axios-based with custom headers

---

## 📦 Installation

```bash
npm install client-saas
# or
yarn add client-saas
``` 

## 📦 Usage

```js

import { createClientSaas } from 'client-saas';

const client = createClientSaas({
  baseURL: 'https://api.example.com',
  endpointIn: '/v1/in',
  endpointOut: '/v1/out',
  platformKey: 'your-platform-key',
});

const response = await client.fetch({
  token: 'your-token',
  headers: {
    Authorization: 'Bearer your-token',
  },
  body: {
    ClientId: 'CLIENT001',
    UserId: 'USER001',
    Subject: 'transaction',
    SubjectType: 'web',
    SubjectIdentifier: 'pos',
    Action: 'report',
    Date: '2025-06-18 00:00:00',
  },
});

console.log(response);

```