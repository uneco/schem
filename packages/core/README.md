# schema

A library designed to implement both TypeScript Interface and json-schema.

# install

```bash
npm install schem
```

or

```bash
yarn add schem
```

# Usage

## Schema definition

Construct JSON Schema and TypeScript types simultaneously using `defineSchemaObject()` and `field.___`.
The following methods are provided for schema definition:

- `field.string (options?)`
- `field.number (options?)`
- `field.integer (options?)`
- `field.boolean (options?)`
- `field.null (options?):`
- `field.const (value, options?)`
- `field.enum (type, values, options?)`
- `field.array (otherFieldItem, arrayOptions?)`
- `field.object (requiredParameters, optionalParameters, objectOptions?)`

For example:

`defineObjectSchema({ ... }) -> schema`

```typescript
import { defineObjectSchema, field } from 'schem'

const user = defineObjectSchema({
  // required fields
  name: field.string(),
  type: field.enum('string', ['creator', 'observer']),
}, {
  // optional fields
  channels: field.array('object', {
    name: field.string(),
    category: field.enum('string', ['music', 'nature', 'game'])
  })
})
```

## Omit specific key

`schema.omit (...keys) -> schema`

```typescript
const exampleUserSchemaWithoutPrivateInfo = exampleUserSchema
  .omit(
    'age',
    'name',
    'phoneNumber'
  )
```

## Pick specific key

`schema.pick (...keys) -> schema`

```typescript
const exampleUserSchemaOnlyPublicInfo = exampleUserSchema
  .pick(
    'id',
    'email',
    'nickName'
  )
```

## Combine

`combineSchema.oneOf ([schema1, schema2, ...]) -> schema`

```typescript
import { combineSchema } from 'schem'

const contactSchema = combineschema.oneOf([
  phoneNumberContactSchema,
  emailContactSchema,
])
```

## Runtime conversion to JSON Schema

call instance method `toJSONSchema()` of schema.

```typescript
const jsonSchema = exampleUserSchema.toJSONSchema()
console.log(jsonSchema)
```

The return value is a standard JSON Schema object (supports Draft 7).
```typescript
{
  type: 'object',
  properties: {
    name: { type: 'string', maxLength: 32, minLength: 1 },
    age: { type: 'integer', minimum: 0 }
  },
  required: [ 'name', 'age' ]
}
```

## Validation

Assume the following "dirty" data for validation.

```typescript
const dirtyUser = {
  name: 'roa',
  age: Math.random() < 0.5 ? 13 : '13'
}

dirtyUser.age // number | string
```

### Validation with [User-Defined Type Guard](https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards)

`validate (instance, schema) -> boolean`

Returns `true` or `false` using `validate` function in [jsonschema](https://www.npmjs.com/package/jsonschema) package with options `{ throwError: false }`.
When used inside an if conditional expression, type guard is enabled.

```typescript
import { validate } from 'schem'

if (validate(dirtyUser, exampleUserSchema)) {
  dirtyUser.age // number
}
dirtyUser.age // number | string
```

### Validation with [Assertion Function](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions)

`assertValid (instance, schema) -> void`

Throws `ValidationError` if instance are invalid, and does nothing if valid. Internally it uses `validate` function in [jsonschema](https://www.npmjs.com/package/jsonschema) package with options `{ throwError: true }`.
This function is an Assertion Function that uses the new features of TS3.7 and this fixes the type in a scope where no error occurred.

```typescript
import { validate } from 'schem'

// throw validation error if age is not a number
assertValid(dirtyUser, exampleUserSchema)

dirtyUser.age // number
```

## Type utilities

### Pure

Provides a purified schema type. Same as guarded by `validate` or` assertValid`.

```typescript
import { Pure } from 'schem'
type UserType = Pure<typeof exampleUserSchema>

const user: UserType = {
  name: 'roa',
  age: 13,
}
```

### Dirty

Provides an explicitly tainted schema type. It can be used to indicate an external value as input value for `validate` or` assertValid`.

```typescript
import { Dirty, assertValid } from 'schem'
type DirtyUserType = Dirty<typeof exampleUserSchema>

app.post('/users', (req) => {
  const user: DirtyUserType = req.body

  user.name // unknown
  user.age // unknown

  assertValid(user)

  user.name // string
  user.age // number
})
```

# License

MIT
