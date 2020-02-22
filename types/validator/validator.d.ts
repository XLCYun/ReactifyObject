import { Validator } from "./ExportedType"

declare function getTypes(): string[]
declare function validate(value: any, passibleType: string[]): boolean
declare function typeFilter(typeArray: string[], throwError: boolean): string[]
declare function defineValidator(type: string, func: Validator): void

declare let exportedObject: {
  functions: { [index: string]: Validator }
  deprecated: string[]
  notYetSupport: string[]
  getTypes: typeof getTypes
  validate: typeof validate
  typeFilter: typeof typeFilter
  defineValidator: typeof defineValidator
}

export = exportedObject
