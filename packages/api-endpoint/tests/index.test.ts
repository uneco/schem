/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { endpointSchemaFactory } from '../src/index'
import { field } from '@schem/core'

it('definition with custom key map from factory', () => {
  const customEndpointSchema = endpointSchemaFactory({
    keyNameMap: {
      request: {
        query: 'q',
        body: 'b',
        headers: 'h'
      },
      response: {
        body: 'b',
        headers: 'h'
      }
    }
  })
  const schema = customEndpointSchema({
    request: {
      query: field.object({
        q: field.string()
      }),
      body: field.object({
        b: field.string()
      }),
      headers: field.object({
        h: field.string()
      })
    },
    response: {
      body: field.object({
        b: field.string()
      }),
      headers: field.object({
        h: field.string()
      })
    }
  })

  expect(schema.request.toJSONSchema()).toStrictEqual({
    type: 'object',
    properties: {
      q: {
        type: 'object',
        properties: { q: { type: 'string' } },
        required: ['q'],
        additionalProperties: true
      },
      b: {
        type: 'object',
        properties: { b: { type: 'string' } },
        required: ['b'],
        additionalProperties: false
      },
      h: {
        type: 'object',
        properties: { h: { type: 'string' } },
        required: ['h'],
        additionalProperties: true
      }
    },
    required: ['q', 'b', 'h']
  })
  expect(schema.response.toJSONSchema()).toStrictEqual({
    type: 'object',
    properties: {
      b: {
        type: 'object',
        properties: { b: { type: 'string' } },
        required: ['b'],
        additionalProperties: false
      },
      h: {
        type: 'object',
        properties: { h: { type: 'string' } },
        required: ['h'],
        additionalProperties: false
      }
    },
    required: ['b', 'h']
  })
})
