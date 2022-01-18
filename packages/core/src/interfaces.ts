/* eslint-disable no-use-before-define */

import { JSONSchema7 } from 'json-schema'
import { Pure } from './index'

type Format = 'date-time' | 'date' | 'time' |
  'email' | 'idn-email' |
  'hostname' | 'idn-hostname' |
  'ipv4' | 'ipv6' |
  'uri' | 'uri-reference' | 'iri' | 'iri-reference' |
  'uri-template' |
  'json-pointer' | 'relative-json-pointer' |
  'regex'

export type TypeMap = {
  string: string;
  number: number;
  boolean: boolean;
  object: unknown;
  integer: number;
  null: null;
  array: Array<any>;
  const: string | number | boolean | unknown | null | Array<any>;
}

export interface Metadata {
  title?: string;
  description?: string;
}

export interface Generic <T> extends Metadata {
  default?: T;
  examples?: T[];
}

export interface TypeBrand <K extends string> {
  type: K;
}

export interface StringType extends Generic<string> {
  enum?: never;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  format?: Format;
}
export interface StringTypeWithBrand extends StringType, TypeBrand<'string'> {}

export interface NumberType extends Generic<number> {
  multipleOf?: number;
  minimum?: number;
  exclusiveMinimum?: number;
  maximum?: number;
  exclusiveMaximum?: number;
}
export interface NumberTypeWithBrand extends NumberType, TypeBrand<'number'> {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BooleanType extends Generic<boolean> {}
export interface BooleanTypeWithBrand extends BooleanType, TypeBrand<'boolean'> {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface NullType extends Generic<null> {}
export interface NullTypeWithBrand extends NullType, TypeBrand<'null'> {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EnumerableTypeMap extends Omit<TypeMap, 'const'> {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EnumType<T extends keyof EnumerableTypeMap> extends Generic<EnumerableTypeMap[T]> {}
export interface EnumTypeWithBrand<T extends keyof EnumerableTypeMap> extends EnumType<T>, TypeBrand<T> {}

export interface ObjectType <T> extends Generic<T> {
  minProperties?: number;
  maxProperties?: number;
  propertyNames?: { pattern: string };
  additionalProperties?: boolean | NumberTypeWithBrand | StringTypeWithBrand | BooleanTypeWithBrand | NullTypeWithBrand | EnumTypeWithBrand<any> | ArrayTypeWithBrand<any>;
}
export interface ObjectTypeWithBrand<T> extends ObjectType<T>, TypeBrand<'object'> {}

export interface ArrayType <T> extends Generic<T[]> {
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;
  items?: Array<NumberTypeWithBrand | StringTypeWithBrand | BooleanTypeWithBrand | NullTypeWithBrand | EnumTypeWithBrand<any> | ArrayTypeWithBrand<any>>;
}
export interface ArrayTypeWithBrand<T> extends ArrayType<T>, TypeBrand<'array'> {}

export type TypeOptionsMap = {
  string: StringType;
  number: NumberType;
  boolean: BooleanType;
  integer: NumberType;
  null: NullType;
}

type PropertyNonNullable<T> = T & { nullable?: false }

export interface SchemaIdentity <C = unknown> {
  identical (): SchemaIdentity<C>;
  toJSONSchema (): JSONSchema7;
}

export type SchemaDefinition <C = unknown> = SchemaIdentity<C> & SchemaBuilder<C>

export interface SchemaBuilder <C = unknown> {
  omit <K extends keyof C> (...names: K[]): SchemaDefinition<Omit<C, K>>;
  pick <K extends keyof C> (...names: K[]): SchemaDefinition<Pick<C, K>>;

  toJSONSchema (): JSONSchema7;
}

export interface Combine {
  oneOf <T extends readonly SchemaDefinition<unknown>[]> (definitions: T): SchemaIdentity<Pure<T[number]>>
}

export type FieldLike<T> = {
  type: string;
  options?: Record<string, unknown>;
  identical (): T;
}

export type Field<T> = FieldLike<T> & {
  nullable (): Field<T | null>;
  nonnullable (): Field<PropertyNonNullable<T>>;
}

export type ObjectField<T> = FieldLike<T> & {
  nullable (): ObjectField<T | null>;
  nonnullable (): ObjectField<PropertyNonNullable<T>>;
  allowAdditionalProperties(): ObjectField<T>;
  denyAdditionalProperties(): ObjectField<T>;
}

export type FieldBuilder = {
  string (options?: StringType): Field<string>;
  number (options?: NumberType): Field<number>;
  integer (options?: NumberType): Field<number>;
  boolean (options?: BooleanType): Field<boolean>;
  null (options?: NullType): Field<null>;
  const <T extends string | number | boolean> (value: T, options?: Metadata): Field<T>;
  enum <T extends keyof EnumerableTypeMap, X extends readonly EnumerableTypeMap[T][]> (type: T, values: X, options?: EnumType<T>): Field<X[number]>;

  array <T> (field: FieldLike<T>, arrayOptions?: ArrayType<T>): Field<T[]>;

  object <T, U> (definitionSchema: SchemaDefinition<ObjectSchema<T, U>>, objectOptions?: ObjectType<T>): ObjectField<ObjectSchema<T, U>>;
  object <T, U> (definition: T, definitionOptional?: U, objectOptions?: ObjectType<T>): ObjectField<ObjectSchema<T, U>>;
}

export type ExtractField<T> = T extends ObjectField<infer K> ? K : (T extends Field<infer K> ? K : never)
export type ObjectSchema<T, U> = {
    [P in keyof T]: ExtractField<T[P]>;
} & {
    [P in keyof U]?: ExtractField<U[P]>;
};
