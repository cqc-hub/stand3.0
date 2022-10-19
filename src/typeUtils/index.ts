export type Flatten<T> = { [K in keyof T]: T[K] };

type Without<T, U> = {
  [P in Exclude<keyof T, keyof U>]?: never;
};

export type XOR<T, U> = (Without<T, U> & U) | (Without<U, T> & T);
