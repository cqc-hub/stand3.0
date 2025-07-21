export type NotNullable<T> = T extends null | undefined ? never : T;

export type IsAny<T> = 'cqc' extends 'cc' & T ? true : false;

export type FilterOptional<T extends BaseObject, F> = Pick<
  T,
  {
    [K in keyof T]: T[K] extends F ? never : K;
  }[keyof T]
>;

export function assignType<T>(val): asserts val is T {}


export type CanWrite<T> = {
  -readonly [K in keyof T]: T[K] extends Record<any, any>
    ? CanWrite<T[K]>
    : T[K];
};