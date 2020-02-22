import ReactifyObjectTreeNode = require("../ReactifyObjectTreeNode/ReactifyObjectTreeNode")

export type PreprocessFunction = (treeNode: ReactifyObjectTreeNode<any, any, any, any>) => void
export type ProcessFunction = PreprocessFunction
export interface EntryProcessor {
  process: PreprocessFunction
  preprocess: ProcessFunction
}

export interface EntryProcessorCollection {
  [index: string]: EntryProcessor
  type: EntryProcessor
  bsonType: EntryProcessor
  beforeGet: EntryProcessor
  afterGet: EntryProcessor
  beforeSet: EntryProcessor
  afterSet: EntryProcessor
  update: EntryProcessor
  beforeUpdate: EntryProcessor
  afterUpdate: EntryProcessor
  mode: EntryProcessor
  init: EntryProcessor
  properties: EntryProcessor
  items: EntryProcessor
  default: EntryProcessor
}
