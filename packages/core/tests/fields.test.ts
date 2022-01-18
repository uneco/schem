import { validate, assertValid, Pure, ValidationError, combineSchema, defineObjectSchema, field } from '../src/index'

it('validate', () => {
  const schema = defineObjectSchema({
    name: field.string()
  })

  expect(validate({ name: 'test' }, schema)).toBe(true)
  expect(validate({ name: 1 }, schema)).toBe(false)
})

it('assertValid', () => {
  const schema = defineObjectSchema({
    name: field.string()
  })

  expect(() => assertValid({ name: 'test' }, schema)).not.toThrow()
  expect(() => assertValid({ name: 1 }, schema)).toThrow(/string/)
  expect(() => assertValid({ name: 1 }, schema)).toThrow(ValidationError)
})

describe('defineObjectSchema', () => {
  it('nested', () => {
    expect(() => defineObjectSchema({
      path: field.string(),
      id: field.integer({
        minimum: 0
      }),
      data: field.object({
        createdAt: field.integer({
          title: '発生時刻'
        }),
        type: field.string({
          title: 'タイプ'
        }),
        qualifier: field.string({
          title: '修飾子'
        }),
        payload: field.string({
          title: 'ペイロード'
        })
      }, {}, {
        title: 'データ'
      })
    })).not.toThrow()
  })

  it('toJSONSchema', () => {
    const schema = defineObjectSchema({
      stringRequired: field.string(),
      stringRequiredNullable: field.string().nullable(),
      numberRequired: field.number(),
      numberRequiredNullable: field.number().nullable(),
      integerRequired: field.integer(),
      integerRequiredNullable: field.integer().nullable(),
      booleanRequired: field.boolean(),
      booleanRequiredNullable: field.boolean().nullable(),
      nullRequired: field.null(),
      enumStringRequired: field.enum('string', ['a', 'b', 'c']),
      enumStringRequiredNullable: field.enum('string', ['a', 'b', 'c']).nullable(),
      enumNumberRequired: field.enum('number', [1, 2, 3]),
      enumNumberRequiredNullable: field.enum('number', [1, 2, 3]).nullable(),
      enumIntegerRequired: field.enum('integer', [1, 2, 3]),
      enumIntegerRequiredNullable: field.enum('integer', [1, 2, 3]).nullable(),

      arrayStringRequired: field.array('string'),
      arrayStringRequiredNullable: field.array('string').nullable(),
      arrayNumberRequired: field.array('number'),
      arrayNumberRequiredNullable: field.array('number').nullable(),
      arrayIntegerRequired: field.array('integer'),
      arrayIntegerRequiredNullable: field.array('integer').nullable(),
      arrayBooleanRequired: field.array('boolean'),
      arrayBooleanRequiredNullable: field.array('boolean').nullable(),
      arrayNullRequired: field.array('null'),
      arrayNullRequiredNullable: field.array('null').nullable(),
      arrayObjectRequired: field.array('object', {
        a: field.string()
      }),
      arrayObjectRequiredNullable: field.array('object', {
        a: field.string()
      }).nullable(),

      arrayStringFieldRequired: field.array(field.string()),
      arrayStringFieldRequiredNullable: field.array(field.string()).nullable(),
      arrayNumberFieldRequired: field.array(field.number()),
      arrayNumberFieldRequiredNullable: field.array(field.number()).nullable(),
      arrayIntegerFieldRequired: field.array(field.integer()),
      arrayIntegerFieldRequiredNullable: field.array(field.integer()).nullable(),
      arrayBooleanFieldRequired: field.array(field.boolean()),
      arrayBooleanFieldRequiredNullable: field.array(field.boolean()).nullable(),
      arrayNullFieldRequired: field.array(field.null()),
      arrayNullFieldRequiredNullable: field.array(field.null()).nullable(),
      arrayObjectFieldRequired: field.array(field.object({
        a: field.string()
      }, {})),
      arrayObjectFieldRequiredNullable: field.array(field.object({
        a: field.string()
      }, {})).nullable(),

      objectRequired: field.object({
        a: field.string()
      }),
      objectRequiredNullable: field.object({
        a: field.string()
      }).nullable(),
      objectRequiredFromSchema: field.object(defineObjectSchema({
        a: field.string()
      }, {}))
    }, {
      stringOptional: field.string(),
      stringOptionalNullable: field.string().nullable(),
      numberOptional: field.number(),
      numberOptionalNullable: field.number().nullable(),
      integerOptional: field.integer(),
      integerOptionalNullable: field.integer().nullable(),
      booleanOptional: field.boolean(),
      booleanOptionalNullable: field.boolean().nullable(),
      nullOptional: field.null(),
      enumStringOptional: field.enum('string', ['a', 'b', 'c']),
      enumStringOptionalNullable: field.enum('string', ['a', 'b', 'c']).nullable(),
      enumNumberOptional: field.enum('number', [1, 2, 3]),
      enumNumberOptionalNullable: field.enum('number', [1, 2, 3]).nullable(),
      enumIntegerOptional: field.enum('integer', [1, 2, 3]),
      enumIntegerOptionalNullable: field.enum('integer', [1, 2, 3]).nullable(),
      arrayStringOptional: field.array('string'),
      arrayStringOptionalNullable: field.array('string').nullable(),
      arrayNumberOptional: field.array('number'),
      arrayNumberOptionalNullable: field.array('number').nullable(),
      arrayIntegerOptional: field.array('integer'),
      arrayIntegerOptionalNullable: field.array('integer').nullable(),
      arrayBooleanOptional: field.array('boolean'),
      arrayBooleanOptionalNullable: field.array('boolean').nullable(),
      arrayNullOptional: field.array('null'),
      arrayNullOptionalNullable: field.array('null').nullable(),
      arrayObjectOptional: field.array('object', {
        a: field.string()
      }),
      arrayObjectOptionalNullable: field.array('object', {
        a: field.string()
      }).nullable(),

      arrayStringFieldOptional: field.array(field.string()),
      arrayStringFieldOptionalNullable: field.array(field.string()).nullable(),
      arrayNumberFieldOptional: field.array(field.number()),
      arrayNumberFieldOptionalNullable: field.array(field.number()).nullable(),
      arrayIntegerFieldOptional: field.array(field.integer()),
      arrayIntegerFieldOptionalNullable: field.array(field.integer()).nullable(),
      arrayBooleanFieldOptional: field.array(field.boolean()),
      arrayBooleanFieldOptionalNullable: field.array(field.boolean()).nullable(),
      arrayNullFieldOptional: field.array(field.null()),
      arrayNullFieldOptionalNullable: field.array(field.null()).nullable(),
      arrayObjectFieldOptional: field.array(field.object({
        a: field.string()
      }, {})),
      arrayObjectFieldOptionalNullable: field.array(field.object({
        a: field.string()
      }, {})).nullable(),

      objectOptional: field.object({
        a: field.string()
      }),
      objectOptionalNullable: field.object({
        a: field.string()
      }).nullable(),
      objectOptionalFromSchema: field.object(defineObjectSchema({
        a: field.string()
      }, {}))
    })

    expect(schema.toJSONSchema()).toStrictEqual({
      type: 'object',
      properties: {
        stringRequired: {
          type: 'string'
        },
        stringOptional: {
          type: 'string'
        },
        stringRequiredNullable: {
          oneOf: [
            { type: 'string' },
            { type: 'null' }
          ]
        },
        stringOptionalNullable: {
          oneOf: [
            { type: 'string' },
            { type: 'null' }
          ]
        },
        numberRequired: {
          type: 'number'
        },
        numberOptional: {
          type: 'number'
        },
        numberRequiredNullable: {
          oneOf: [
            { type: 'number' },
            { type: 'null' }
          ]
        },
        numberOptionalNullable: {
          oneOf: [
            { type: 'number' },
            { type: 'null' }
          ]
        },
        integerRequired: {
          type: 'integer'
        },
        integerOptional: {
          type: 'integer'
        },
        integerRequiredNullable: {
          oneOf: [
            { type: 'integer' },
            { type: 'null' }
          ]
        },
        integerOptionalNullable: {
          oneOf: [
            { type: 'integer' },
            { type: 'null' }
          ]
        },
        booleanRequired: {
          type: 'boolean'
        },
        booleanOptional: {
          type: 'boolean'
        },
        booleanRequiredNullable: {
          oneOf: [
            { type: 'boolean' },
            { type: 'null' }
          ]
        },
        booleanOptionalNullable: {
          oneOf: [
            { type: 'boolean' },
            { type: 'null' }
          ]
        },
        nullRequired: {
          type: 'null'
        },
        nullOptional: {
          type: 'null'
        },
        enumStringRequired: {
          type: 'string',
          enum: ['a', 'b', 'c']
        },
        enumStringOptional: {
          type: 'string',
          enum: ['a', 'b', 'c']
        },
        enumStringRequiredNullable: {
          oneOf: [
            {
              type: 'string',
              enum: ['a', 'b', 'c']
            },
            { type: 'null' }
          ]
        },
        enumStringOptionalNullable: {
          oneOf: [
            {
              type: 'string',
              enum: ['a', 'b', 'c']
            },
            { type: 'null' }
          ]
        },
        enumNumberRequired: {
          type: 'number',
          enum: [1, 2, 3]
        },
        enumNumberOptional: {
          type: 'number',
          enum: [1, 2, 3]
        },
        enumNumberRequiredNullable: {
          oneOf: [
            {
              type: 'number',
              enum: [1, 2, 3]
            },
            { type: 'null' }
          ]
        },
        enumNumberOptionalNullable: {
          oneOf: [
            {
              type: 'number',
              enum: [1, 2, 3]
            },
            { type: 'null' }
          ]
        },
        enumIntegerRequired: {
          type: 'integer',
          enum: [1, 2, 3]
        },
        enumIntegerOptional: {
          type: 'integer',
          enum: [1, 2, 3]
        },
        enumIntegerRequiredNullable: {
          oneOf: [
            {
              type: 'integer',
              enum: [1, 2, 3]
            },
            { type: 'null' }
          ]
        },
        enumIntegerOptionalNullable: {
          oneOf: [
            {
              type: 'integer',
              enum: [1, 2, 3]
            },
            { type: 'null' }
          ]
        },
        arrayStringRequired: {
          type: 'array',
          items: { type: 'string' }
        },
        arrayStringOptional: {
          type: 'array',
          items: { type: 'string' }
        },
        arrayStringRequiredNullable: {
          oneOf: [
            {
              type: 'array',
              items: { type: 'string' }
            },
            { type: 'null' }
          ]
        },
        arrayStringOptionalNullable: {
          oneOf: [
            {
              type: 'array',
              items: { type: 'string' }
            },
            { type: 'null' }
          ]
        },
        arrayNumberRequired: {
          type: 'array',
          items: { type: 'number' }
        },
        arrayNumberOptional: {
          type: 'array',
          items: { type: 'number' }
        },
        arrayNumberRequiredNullable: {
          oneOf: [
            {
              type: 'array',
              items: { type: 'number' }
            },
            { type: 'null' }
          ]
        },
        arrayNumberOptionalNullable: {
          oneOf: [
            {
              type: 'array',
              items: { type: 'number' }
            },
            { type: 'null' }
          ]
        },
        arrayIntegerRequired: {
          type: 'array',
          items: { type: 'integer' }
        },
        arrayIntegerOptional: {
          type: 'array',
          items: { type: 'integer' }
        },
        arrayIntegerRequiredNullable: {
          oneOf: [
            {
              type: 'array',
              items: { type: 'integer' }
            },
            { type: 'null' }
          ]
        },
        arrayIntegerOptionalNullable: {
          oneOf: [
            {
              type: 'array',
              items: { type: 'integer' }
            },
            { type: 'null' }
          ]
        },
        arrayBooleanRequired: {
          type: 'array',
          items: { type: 'boolean' }
        },
        arrayBooleanOptional: {
          type: 'array',
          items: { type: 'boolean' }
        },
        arrayBooleanRequiredNullable: {
          oneOf: [
            {
              type: 'array',
              items: { type: 'boolean' }
            },
            { type: 'null' }
          ]
        },
        arrayBooleanOptionalNullable: {
          oneOf: [
            {
              type: 'array',
              items: { type: 'boolean' }
            },
            { type: 'null' }
          ]
        },
        arrayNullRequired: {
          type: 'array',
          items: { type: 'null' }
        },
        arrayNullOptional: {
          type: 'array',
          items: { type: 'null' }
        },
        arrayNullRequiredNullable: {
          oneOf: [
            {
              type: 'array',
              items: { type: 'null' }
            },
            { type: 'null' }
          ]
        },
        arrayNullOptionalNullable: {
          oneOf: [
            {
              type: 'array',
              items: { type: 'null' }
            },
            { type: 'null' }
          ]
        },
        arrayObjectRequired: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              a: { type: 'string' }
            },
            required: ['a']
          }
        },
        arrayObjectOptional: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              a: { type: 'string' }
            },
            required: ['a']
          }
        },
        arrayObjectRequiredNullable: {
          oneOf: [
            {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  a: { type: 'string' }
                },
                required: ['a']
              }
            },
            { type: 'null' }
          ]
        },
        arrayObjectOptionalNullable: {
          oneOf: [
            {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  a: { type: 'string' }
                },
                required: ['a']
              }
            },
            { type: 'null' }
          ]
        },
        arrayStringFieldRequired: {
          type: 'array',
          items: {
            type: 'string'
          }
        },
        arrayStringFieldRequiredNullable: {
          oneOf: [
            {
              type: 'array',
              items: {
                type: 'string'
              }
            },
            {
              type: 'null'
            }
          ]
        },
        arrayNumberFieldRequired: {
          type: 'array',
          items: {
            type: 'number'
          }
        },
        arrayNumberFieldRequiredNullable: {
          oneOf: [
            {
              type: 'array',
              items: {
                type: 'number'
              }
            },
            {
              type: 'null'
            }
          ]
        },
        arrayIntegerFieldRequired: {
          type: 'array',
          items: {
            type: 'integer'
          }
        },
        arrayIntegerFieldRequiredNullable: {
          oneOf: [
            {
              type: 'array',
              items: {
                type: 'integer'
              }
            },
            {
              type: 'null'
            }
          ]
        },
        arrayBooleanFieldRequired: {
          type: 'array',
          items: {
            type: 'boolean'
          }
        },
        arrayBooleanFieldRequiredNullable: {
          oneOf: [
            {
              type: 'array',
              items: {
                type: 'boolean'
              }
            },
            {
              type: 'null'
            }
          ]
        },
        arrayNullFieldRequired: {
          type: 'array',
          items: {
            type: 'null'
          }
        },
        arrayNullFieldRequiredNullable: {
          oneOf: [
            {
              type: 'array',
              items: {
                type: 'null'
              }
            },
            {
              type: 'null'
            }
          ]
        },
        arrayObjectFieldRequired: {
          type: 'array',
          items: {
            type: 'object',
            properties: {},
            required: []
          }
        },
        arrayObjectFieldRequiredNullable: {
          oneOf: [
            {
              type: 'array',
              items: {
                type: 'object',
                properties: {},
                required: []
              }
            },
            {
              type: 'null'
            }
          ]
        },
        arrayStringFieldOptional: {
          type: 'array',
          items: {
            type: 'string'
          }
        },
        arrayStringFieldOptionalNullable: {
          oneOf: [
            {
              type: 'array',
              items: {
                type: 'string'
              }
            },
            {
              type: 'null'
            }
          ]
        },
        arrayNumberFieldOptional: {
          type: 'array',
          items: {
            type: 'number'
          }
        },
        arrayNumberFieldOptionalNullable: {
          oneOf: [
            {
              type: 'array',
              items: {
                type: 'number'
              }
            },
            {
              type: 'null'
            }
          ]
        },
        arrayIntegerFieldOptional: {
          type: 'array',
          items: {
            type: 'integer'
          }
        },
        arrayIntegerFieldOptionalNullable: {
          oneOf: [
            {
              type: 'array',
              items: {
                type: 'integer'
              }
            },
            {
              type: 'null'
            }
          ]
        },
        arrayBooleanFieldOptional: {
          type: 'array',
          items: {
            type: 'boolean'
          }
        },
        arrayBooleanFieldOptionalNullable: {
          oneOf: [
            {
              type: 'array',
              items: {
                type: 'boolean'
              }
            },
            {
              type: 'null'
            }
          ]
        },
        arrayNullFieldOptional: {
          type: 'array',
          items: {
            type: 'null'
          }
        },
        arrayNullFieldOptionalNullable: {
          oneOf: [
            {
              type: 'array',
              items: {
                type: 'null'
              }
            },
            {
              type: 'null'
            }
          ]
        },
        arrayObjectFieldOptional: {
          type: 'array',
          items: {
            type: 'object',
            properties: {},
            required: []
          }
        },
        arrayObjectFieldOptionalNullable: {
          oneOf: [
            {
              type: 'array',
              items: {
                type: 'object',
                properties: {},
                required: []
              }
            },
            {
              type: 'null'
            }
          ]
        },
        objectRequired: {
          type: 'object',
          properties: {
            a: { type: 'string' }
          },
          required: ['a']
        },
        objectOptional: {
          type: 'object',
          properties: {
            a: { type: 'string' }
          },
          required: ['a']
        },
        objectRequiredNullable: {
          type: 'object',
          properties: {
            a: { type: 'string' }
          },
          required: ['a']
        },
        objectRequiredFromSchema: {
          type: 'object',
          properties: {
            a: { type: 'string' }
          },
          required: ['a']
        },
        objectOptionalNullable: {
          type: 'object',
          properties: {
            a: { type: 'string' }
          },
          required: ['a']
        },
        objectOptionalFromSchema: {
          type: 'object',
          properties: {
            a: { type: 'string' }
          },
          required: ['a']
        }
      },
      required: [
        'stringRequired',
        'stringRequiredNullable',
        'numberRequired',
        'numberRequiredNullable',
        'integerRequired',
        'integerRequiredNullable',
        'booleanRequired',
        'booleanRequiredNullable',
        'nullRequired',
        'enumStringRequired',
        'enumStringRequiredNullable',
        'enumNumberRequired',
        'enumNumberRequiredNullable',
        'enumIntegerRequired',
        'enumIntegerRequiredNullable',
        'arrayStringRequired',
        'arrayStringRequiredNullable',
        'arrayNumberRequired',
        'arrayNumberRequiredNullable',
        'arrayIntegerRequired',
        'arrayIntegerRequiredNullable',
        'arrayBooleanRequired',
        'arrayBooleanRequiredNullable',
        'arrayNullRequired',
        'arrayNullRequiredNullable',
        'arrayObjectRequired',
        'arrayObjectRequiredNullable',
        'arrayStringFieldRequired',
        'arrayStringFieldRequiredNullable',
        'arrayNumberFieldRequired',
        'arrayNumberFieldRequiredNullable',
        'arrayIntegerFieldRequired',
        'arrayIntegerFieldRequiredNullable',
        'arrayBooleanFieldRequired',
        'arrayBooleanFieldRequiredNullable',
        'arrayNullFieldRequired',
        'arrayNullFieldRequiredNullable',
        'arrayObjectFieldRequired',
        'arrayObjectFieldRequiredNullable',
        'objectRequired',
        'objectRequiredNullable',
        'objectRequiredFromSchema'
      ]
    })

    type SchemaType = Pure<typeof schema>
    const testSchema: SchemaType = {
      stringRequired: 'a',
      stringRequiredNullable: null,
      numberRequired: 1,
      numberRequiredNullable: null,
      integerRequired: 1,
      integerRequiredNullable: null,
      booleanRequired: true,
      booleanRequiredNullable: null,
      nullRequired: null,
      enumStringRequired: 'a',
      enumStringRequiredNullable: null,
      enumNumberRequired: 1,
      enumNumberRequiredNullable: null,
      enumIntegerRequired: 1,
      enumIntegerRequiredNullable: null,
      arrayStringRequired: ['a'],
      arrayStringRequiredNullable: null,
      arrayNumberRequired: [1],
      arrayNumberRequiredNullable: null,
      arrayIntegerRequired: [1],
      arrayIntegerRequiredNullable: null,
      arrayBooleanRequired: [true],
      arrayBooleanRequiredNullable: null,
      arrayNullRequired: [null],
      arrayNullRequiredNullable: null,
      arrayObjectRequired: [{ a: 'a' }],
      arrayObjectRequiredNullable: null,
      arrayStringFieldRequired: ['a'],
      arrayStringFieldRequiredNullable: null,
      arrayNumberFieldRequired: [1],
      arrayNumberFieldRequiredNullable: null,
      arrayIntegerFieldRequired: [1],
      arrayIntegerFieldRequiredNullable: null,
      arrayBooleanFieldRequired: [true],
      arrayBooleanFieldRequiredNullable: null,
      arrayNullFieldRequired: [null],
      arrayNullFieldRequiredNullable: null,
      arrayObjectFieldRequired: [{ a: 'a' }],
      arrayObjectFieldRequiredNullable: null,
      objectRequired: { a: 'a' },
      objectRequiredNullable: null,
      objectRequiredFromSchema: { a: 'a ' }
    }

    // only type tesing
    expect(testSchema).toBeTruthy()
  })

  it('omit', () => {
    const schema = defineObjectSchema({
      name: field.string(),
      phoneNumber: field.string()
    })

    const omittedSchema = schema.omit('phoneNumber')

    expect(omittedSchema.toJSONSchema()).toStrictEqual({
      type: 'object',
      properties: {
        name: {
          type: 'string'
        }
      },
      required: ['name']
    })
  })

  it('omit multiple', () => {
    const schema = defineObjectSchema({
      name: field.string(),
      phoneNumber: field.string(),
      age: field.string()
    })

    const omittedSchema = schema.omit('phoneNumber', 'age')

    expect(omittedSchema.toJSONSchema()).toStrictEqual({
      type: 'object',
      properties: {
        name: {
          type: 'string'
        }
      },
      required: ['name']
    })
  })

  it('pick', () => {
    const schema = defineObjectSchema({
      name: field.string(),
      phoneNumber: field.string()
    })

    const pickedSchema = schema.pick('phoneNumber')

    expect(pickedSchema.toJSONSchema()).toStrictEqual({
      type: 'object',
      properties: {
        phoneNumber: {
          type: 'string'
        }
      },
      required: ['phoneNumber']
    })
  })

  it('pick multiple', () => {
    const schema = defineObjectSchema({
      name: field.string(),
      phoneNumber: field.string(),
      age: field.string()
    })

    const pickedSchema = schema.pick('name', 'phoneNumber')

    expect(pickedSchema.toJSONSchema()).toStrictEqual({
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        phoneNumber: {
          type: 'string'
        }
      },
      required: ['name', 'phoneNumber']
    })
  })

  it('oneOf', () => {
    const schema = combineSchema.oneOf([
      defineObjectSchema({
        type: field.const('email'),
        email: field.string({
          format: 'email'
        })
      }),
      defineObjectSchema({
        type: field.const('webhook'),
        endpoint: field.string({
          format: 'uri'
        })
      })
    ] as const)

    const values: Pure<typeof schema>[] = [{
      type: 'email',
      email: 'test@example.com'
    }, {
      type: 'webhook',
      endpoint: 'https://example.com/test'
    }]

    // only type tesing
    expect(values).toStrictEqual(values)

    expect(schema.toJSONSchema()).toStrictEqual({
      oneOf: [
        {
          type: 'object',
          properties: {
            type: {
              const: 'email'
            },
            email: {
              type: 'string',
              format: 'email'
            }
          },
          required: [
            'type',
            'email'
          ]
        },
        {
          type: 'object',
          properties: {
            type: {
              const: 'webhook'
            },
            endpoint: {
              type: 'string',
              format: 'uri'
            }
          },
          required: [
            'type',
            'endpoint'
          ]
        }
      ]
    })

    expect(() => assertValid({}, schema)).toThrow(/is not exactly one/)
    expect(() => assertValid({
      type: 'email',
      email: 'invalid-format-email'
    }, schema)).toThrow(/is not exactly one/)
    expect(() => assertValid({
      type: 'email',
      email: 'valid-format-email@example.com'
    }, schema)).not.toThrow()
  })
})
