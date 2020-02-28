import { PromiseWrapper, ExtractConfigValueType, ExtractTSType, ExtractTSTypePromise } from "../../../Config"
import ReactifyObjectTreeNode = require("../ReactifyObjectTreeNode")
import { ObjectValueView, ValueView } from "../ExportType"
declare class ArrayValueClass<ROConfig, RootConfig, InjectedObjectType> {
  constructor(treeNode: typeof ReactifyObjectTreeNode)
  [Symbol.iterator](): IterableIterator<ExtractTSTypePromise<ExtractConfigValueType<ROConfig>>>
  length: number

  $roTree: ReactifyObjectTreeNode<ROConfig>
  $set(
    this: ReactifyObjectTreeNode<ROConfig>,
    propertyName: number,
    newValue: ExtractTSType<ExtractConfigValueType<ROConfig>>
  ): void

  get $root(): typeof ReactifyObjectTreeNode
  emit<ResultType = any>(result: ResultType, eventName: string): ResultType
  pop(): ExtractTSTypePromise<ExtractConfigValueType<ROConfig>>
  shift(): ExtractTSTypePromise<ExtractConfigValueType<ROConfig>>[]
  unshift(
    ...addItems: ExtractTSType<ExtractConfigValueType<ROConfig>>[]
  ): ExtractTSTypePromise<ExtractConfigValueType<ROConfig>>[]
  splice(): ExtractTSTypePromise<ExtractConfigValueType<ROConfig>>[]
  push(): ExtractTSTypePromise<ExtractConfigValueType<ROConfig>>[]
  copyWithin(): PromiseWrapper<ROConfig, void>
  reverse(): ArrayValueClass<ROConfig, RootConfig, InjectedObjectType>
  fill(
    value: ExtractConfigValueType<ROConfig>,
    start: number,
    end: number
  ): ArrayValueClass<ROConfig, RootConfig, InjectedObjectType>
  update(): PromiseWrapper<ROConfig, void>
  updateLength(): PromiseWrapper<ROConfig, void>
  updateChildren(): PromiseWrapper<ROConfig, void>
  removeChild(
    symbol: symbol
  ): PromiseWrapper<ROConfig, undefined | ArrayValueClass<ROConfig, RootConfig, InjectedObjectType>>
  static addChild<ROConfig>(
    treeNode: ReactifyObjectTreeNode<ROConfig>,
    object: ExtractTSType<ROConfig>,
    copyFrom?: ExtractTSType<ROConfig>
  )
  getTreeNodeByIndex(index: number): ReactifyObjectTreeNode<ExtractConfigValueType<ROConfig>>
}

export = ArrayValueClass
