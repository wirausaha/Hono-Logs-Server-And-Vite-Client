import camelCase from 'lodash-es/camelCase.js';


export function camelCaseKey<T extends Record<string, any>>(obj: T): Record<string, any> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [camelCase(key), value])
  )
}