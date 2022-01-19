# @schem/api-endpoint

API endpoint specification based on @schem/core

# install

```bash
npm install @schem/api-endpoint
```

or

```bash
yarn add @schem/api-endpoint
```

# usage

```ts
const schema = endpointSchema({
  summary: 'test endpoint',
  description: 'this is test endpoint',
  request: {
    query: field.object({
      name: field.string(),
    }, {}),
    body: field.object({
      data: field.string(),
    }, {}),
    headers: field.object({
      authorization: field.string(),
    }, {}),
  },
  response: {
    body: field.object({
      data: field.string(),
    }, {}),
    headers: field.object({
      'cache-control': field.string(),
    }, {}),
  }
})

schema.request.toJSONSchema()
schema.response.toJSONSchema()
```

# license

MIT
