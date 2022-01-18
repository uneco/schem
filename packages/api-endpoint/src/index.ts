import { defineObjectSchema, SchemaDefinition, ObjectField } from '@schem/core'

export interface EndpointSchemaRequestInput<
  Q = unknown,
  B = unknown,
  H = unknown
> {
  query?: (schema: SchemaDefinition<unknown>) => SchemaDefinition<Q>;
  body?: (schema: SchemaDefinition<unknown>) => SchemaDefinition<B>;
  headers?: (schema: SchemaDefinition<unknown>) => SchemaDefinition<H>;
}

export interface EndpointSchemaResponseInput<B = unknown, H = unknown> {
  body?: (schema: SchemaDefinition<unknown>) => SchemaDefinition<B>;
  headers?: (schema: SchemaDefinition<unknown>) => SchemaDefinition<H>;
}

type Filter<F, T> = Pick<
  T,
  {
    [K in keyof T]: T[K] extends F ? K : never
  }[keyof T]
>

export interface EndpointSchemaInput<
  RequestQuery,
  RequestBody,
  RequestHeaders,
  ResponseBody,
  ResponseHeaders
> {
  summary?: string;
  description?: string;
  request?: {
    query?: ObjectField<RequestQuery>,
    body?: ObjectField<RequestBody>,
    headers?: ObjectField<RequestHeaders>,
  }
  response?: {
    body?: ObjectField<ResponseBody>,
    headers?: ObjectField<ResponseHeaders>,
  };
}

export type EndpointSchema<T, U> = {
  summary?: string;
  description?: string;
  request: SchemaDefinition<T>;
  response: SchemaDefinition<U>;
}

export type EndpointRequest<Q, B, H> = Filter<
  Record<string, unknown>,
  {
    query: Q;
    body: B;
    headers: H;
  }
>

export type EndpointResponse<B, H> = (
  B extends Record<string, unknown> ? { body: B } : unknown
) & (
  (H extends Record<string, unknown> ? { headers: H } : unknown)
  & { headers?: { [key: string]: string } }
)

export interface KeyNameMap {
  request: {
    query: string;
    body: string;
    headers: string;
  };
  response: {
    body: string;
    headers: string;
  };
}

export const defaultKeyNameMap: KeyNameMap = {
  request: {
    query: 'query',
    body: 'body',
    headers: 'headers'
  },
  response: {
    body: 'body',
    headers: 'headers'
  }
}

export interface Options {
  keyNameMap: KeyNameMap;
}

export const defaultOptions: Options = {
  keyNameMap: defaultKeyNameMap
}

export function endpointSchemaFactory (baseOptions: Options) {
  return function endpointSchema<
    RequestQuery,
    RequestBody,
    RequestHeaders,
    ResponseBody,
    ResponseHeaders
  > (
    input: EndpointSchemaInput<
      RequestQuery,
      RequestBody,
      RequestHeaders,
      ResponseBody,
      ResponseHeaders
    >,
    options = baseOptions
  ): EndpointSchema<
    EndpointRequest<RequestQuery, RequestBody, RequestHeaders>,
    EndpointResponse<ResponseBody, ResponseHeaders>
  > {
    const request: Record<string, ObjectField<RequestQuery | RequestBody | RequestHeaders>> = {}
    const response: Record<string, ObjectField<ResponseBody | ResponseHeaders>> = {}

    if (input.request?.query) {
      request[options.keyNameMap.request.query] = input.request.query.allowAdditionalProperties()
    }

    if (input.request?.body) {
      request[options.keyNameMap.request.body] = input.request.body.denyAdditionalProperties()
    }

    if (input.request?.headers) {
      request[options.keyNameMap.request.headers] = input.request.headers.allowAdditionalProperties()
    }

    if (input.response?.body) {
      response[options.keyNameMap.response.body] = input.response.body.denyAdditionalProperties()
    }

    if (input.response?.headers) {
      response[options.keyNameMap.response.headers] = input.response.headers.denyAdditionalProperties()
    }

    return {
      summary: input.summary,
      description: input.description,
      request: defineObjectSchema(request),
      response: defineObjectSchema(response)
    } as EndpointSchema<
      EndpointRequest<RequestQuery, RequestBody, RequestHeaders>,
      EndpointResponse<ResponseBody, ResponseHeaders>
    >
  }
}

export const endpointSchema = endpointSchemaFactory(defaultOptions)

export type ResponseBody<T> = T extends EndpointSchema<
  unknown,
  EndpointResponse<infer B, unknown>
> ? B : never

export type ResponseHeaders<T> = T extends EndpointSchema<
  unknown,
  EndpointResponse<unknown, infer H>
> ? H : never

export type RequestQuery<T> = T extends EndpointSchema<
  EndpointRequest<infer Q, unknown, unknown>,
  unknown
> ? Q : never

export type RequestBody<T> = T extends EndpointSchema<
  EndpointRequest<unknown, infer B, unknown>,
  unknown
> ? B : never

export type RequestHeaders<T> = T extends EndpointSchema<
  EndpointRequest<unknown, unknown, infer H>,
  unknown
> ? H : never
