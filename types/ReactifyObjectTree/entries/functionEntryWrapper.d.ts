import { PreprocessFunction, ProcessFunction } from "./ExportedType"

declare function preprocess(name: string): PreprocessFunction
declare function process(name: string, defaultFunction: ProcessFunction): ProcessFunction

declare let exportedObject: {
  preprocess: typeof preprocess
  process: typeof process
}

export = exportedObject
