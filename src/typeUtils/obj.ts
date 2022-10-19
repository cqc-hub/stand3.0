import { Intersection, Difference, Complement } from './arr';

export type Flatten<T> = { [K in keyof T]: T[K] };

type Without<T, U> = {
  [P in Exclude<keyof T, keyof U>]?: never;
};

export type XOR<T, U> = (Without<T, U> & U) | (Without<U, T> & T);

export type PlainObjectType = Record<string, any>;

export type ObjectKeysConcurrence<
  T extends PlainObjectType,
  U extends PlainObjectType
> = keyof T | keyof U;

export type ObjectKeysIntersection<
  T extends PlainObjectType,
  U extends PlainObjectType
> = Intersection<keyof T, keyof U>;

export type ObjectKeysDifference<
  T extends PlainObjectType,
  U extends PlainObjectType
> = Difference<keyof T, keyof U>;

export type ObjectKeysComplement<
  T extends U,
  U extends PlainObjectType
> = Complement<keyof T, keyof U>;

export type ObjectIntersection<
  T extends PlainObjectType,
  U extends PlainObjectType
> = Pick<T, ObjectKeysIntersection<T, U>>;

export type ObjectDifference<
  T extends PlainObjectType,
  U extends PlainObjectType
> = Pick<T, ObjectKeysDifference<T, U>>;

export type ObjectComplement<T extends U, U extends PlainObjectType> = Pick<
  T,
  ObjectKeysComplement<T, U>
>;

/**
 * 合并对象， U 优先
 */
export type Merge<
  T extends PlainObjectType,
  U extends PlainObjectType
> = ObjectDifference<T, U> & ObjectIntersection<U, T> & ObjectDifference<U, T>;

/**
 * 合并对象， T 优先
 */
export type Assign<
  T extends PlainObjectType,
  U extends PlainObjectType
> = ObjectDifference<T, U> & ObjectIntersection<T, U> & ObjectDifference<U, T>;

/**
 * 合并对象，U 覆盖 T，（不会合并 U 中独占的）
 */
export type Override<
  T extends PlainObjectType,
  U extends PlainObjectType
> = ObjectDifference<T, U> & ObjectIntersection<T, U>;
