import { PromiseWrapper, ExtractConfigValueType, ExtractTSType } from "../../../Config"
import ReactifyObjectTreeNode = require("../ReactifyObjectTreeNode")
import { ObjectValueView, ValueView } from "../ExportType"
declare class ArrayValueClass<ROConfig, RootConfig, InjectedObjectType> {
  constructor(treeNode: typeof ReactifyObjectTreeNode)
  [Symbol.iterator](): IterableIterator<ExtractTSType<ExtractConfigValueType<ROConfig>>>
  [index: number]: ExtractTSType<ExtractConfigValueType<ROConfig>>
  length: number

  $roTree: ReactifyObjectTreeNode<ROConfig>
  $set(propertyName: number, newValue: ExtractTSType<ExtractConfigValueType<ROConfig>>): void

  get $root(): typeof ReactifyObjectTreeNode
  emit<ResultType = any>(result: ResultType, eventName: string): ResultType
  pop(): ExtractTSType<ExtractConfigValueType<ROConfig>>
  shift(): ExtractTSType<ExtractConfigValueType<ROConfig>>[]
  unshift(
    ...addItems: ExtractTSType<ExtractConfigValueType<ROConfig>>[]
  ): ExtractTSType<ExtractConfigValueType<ROConfig>>[]
  splice(
    start: number,
    deleteCount: number,
    ...pushItems: ExtractTSType<ExtractConfigValueType<ROConfig>>[]
  ): ExtractTSType<ExtractConfigValueType<ROConfig>>[]
  push(value: ExtractTSType<ExtractConfigValueType<ROConfig>>): ExtractTSType<ExtractConfigValueType<ROConfig>>[]
  copyWithin(target: number, start: number, end: number): PromiseWrapper<ROConfig, void>
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
