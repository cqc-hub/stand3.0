export type NotNullable<T> = T extends null | undefined ? never : T;

export type IsAny<T> = 'cqc' extends 'cc' & T ? true : false;

export function assignType<T>(val): asserts val is T {}
