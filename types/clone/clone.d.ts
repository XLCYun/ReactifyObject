import { Cloner } from "./ExportedType"

declare let functions: { [index: string]: Cloner }
declare function getTypes(): string[]
declare function clone<T = any>(value: T, passibleType: string[])
declare function typeFilter(typeArray: string[], throwError?: boolean)
declare function defineClone(type: string, func: Cloner): void

declare let exportedObject: {
  functions: typeof functions
  getTypes: typeof getTypes
  clone: typeof clone
  typeFilter: typeof typeFilter
  defineClone: typeof defineClone
}

export = exportedObject
