import {
  Config,
  ConfigMode,
  ConfigType,
  ExtractTSType,
  AsyncObjectConfig,
  SyncObjectConfig,
  ExtractConfigValueJSType,
  ExtractConfigValueType,
  ExtractConfigMode,
  PromiseWrapper,
  ExtractTSTypePromise
} from "../../Config"
import EventMan = require("@xlcyun/event-man")
import ArrayValueClass from "./ArrayValueClass/ArrayValueClass"
import revision from "../revision/revision"
import {
  ROTreeNodeChildren,
  ValueView,
  TreeNodeType,
  SetSequenceObjectType,
  PickRootROTreeNode,
  PickRootConfig,
  Injected
} from "./ExportType"

/** ----------------------------- ReactifyObjectTreeNode 类声明 ----------------------------- */
declare class ReactifyObjectTreeNode<ROConfig, ParentConfig = null, RootConfig = null, InjectedObjectType = {}> {
  constructor(
    object: ExtractTSType<ROConfig> | {} | undefined | symbol,
    config: ROConfig,
    name: string,
    parent: ReactifyObjectTreeNode<ParentConfig> | null,
    copyFrom?: ExtractTSType<ROConfig> | {} | undefined | symbol
  )
  object: ExtractTSType<ROConfig> | symbol
  copyFrom?: ExtractTSType<ROConfig> | symbol
  event: EventMan<ReactifyObjectTreeNode<ROConfig>, ExtractTSType<ROConfig>>
  revision?: revision<ROConfig>
  id: string
  name: string
  children: ROTreeNodeChildren<ROConfig>
  parent: ParentConfig extends null ? null : ReactifyObjectTreeNode<ParentConfig, null, RootConfig, InjectedObjectType>
  config: ROConfig
  value: ValueView<ROConfig, RootConfig, InjectedObjectType>

  get nodeType(): TreeNodeType
  get isRoot(): boolean
  get isNode(): boolean
  get isLeaf(): boolean
  get root(): PickRootROTreeNode<ROConfig, ParentConfig, RootConfig, InjectedObjectType>
  get path(): string
  get $root(): ValueView<
    PickRootConfig<ROConfig, ParentConfig, RootConfig>,
    PickRootConfig<ROConfig, ParentConfig, RootConfig>,
    InjectedObjectType
  >
  get $object(): Injected<PickRootConfig<ROConfig, ParentConfig, RootConfig>, InjectedObjectType>
  get isArrayNode(): boolean
  get isObjectNode(): boolean
  get getter(): ExtractTSType<ROConfig>
  set setter(newValue: ExtractTSType<ROConfig>)

  get<
    Key extends ExtractConfigValueJSType<ROConfig> extends "object"
      ? keyof ExtractConfigValueType<ROConfig>
      : ExtractConfigValueJSType<ROConfig> extends "array"
      ? number
      : never
  >(
    propertyName: Key
  ): ExtractConfigValueJSType<ROConfig> extends "object"
    ? Key extends keyof ExtractConfigValueType<ROConfig>
      ? ExtractConfigValueType<ROConfig>[Key]
      : never
    : ExtractConfigValueJSType<ROConfig> extends "array"
    ? ExtractConfigValueType<ROConfig>
    : never

  set<
    Key extends ExtractConfigValueJSType<ROConfig> extends "object"
      ? keyof ExtractConfigValueType<ROConfig>
      : ExtractConfigValueJSType<ROConfig> extends "array"
      ? number
      : never
  >(
    propertyName: Key,
    newValue: ExtractConfigValueJSType<ROConfig> extends "object"
      ? Key extends keyof ExtractConfigValueType<ROConfig>
        ? ExtractConfigValueType<ROConfig>[Key]
        : never
      : ExtractConfigValueJSType<ROConfig> extends "array"
      ? ExtractTSType<ExtractConfigValueType<ROConfig>>
      : never
  ): PromiseWrapper<
    ExtractConfigValueJSType<ROConfig> extends "object"
      ? Key extends keyof ExtractConfigValueType<ROConfig>
        ? ExtractConfigValueType<ROConfig>[Key]
        : never
      : ExtractConfigValueJSType<ROConfig> extends "array"
      ? ExtractConfigValueType<ROConfig>
      : never,
    void
  >
  toObject(clone?: boolean): ExtractTSType<ROConfig>
  setSequence(object: SetSequenceObjectType<ROConfig>): IterableIterator<any | Promise<any>>
  setParent<SetParentROConfig>(parent: ReactifyObjectTreeNode<SetParentROConfig>): void
  appendChild<AppendChildROConfig>(child: ReactifyObjectTreeNode<AppendChildROConfig>): undefined | ReferenceError
  checkCircular(track?: string[]): boolean
  setupRevision(generateRevisionInfoFunction: (...args: any[]) => any): void
  getTreeNodeByPath(path: string): typeof ReactifyObjectTreeNode
  register(object: any, index: string | number, deep: boolean): void
}

export = ReactifyObjectTreeNode
