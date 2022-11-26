import { debounce } from './utils';

export const CDebounce = function (time: number = 300, immediate = false) {
  return function (
    target,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.value = debounce(descriptor.value, time, immediate);
    return descriptor;
  };
};
