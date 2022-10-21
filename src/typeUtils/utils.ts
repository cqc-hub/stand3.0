export type NotNullable<T> = T extends null | undefined ? never : T;
