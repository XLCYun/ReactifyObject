import { Comparator } from "./ExportedType"
import exportedObject = require("../clone/clone")

declare let functions: { [index: string]: Comparator }
declare function getTypes(): string[]
declare function compare<T = any>(a: T, b: T, passibleType: string[]): boolean
declare function typeFilter(typeArray: string, throwError?: boolean): string[]
declare function defineCompare(type: string, func: Comparator): void

declare let ExportedObject: {
  functions: typeof functions
  getTypes: typeof getTypes
  compare: typeof compare
  typeFilter: typeof typeFilter
  defineCompare: typeof defineCompare
}

export = exportedObject
