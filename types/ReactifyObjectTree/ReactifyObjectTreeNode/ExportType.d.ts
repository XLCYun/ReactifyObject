import ReactifyObjectTreeNode = require("./ReactifyObjectTreeNode")
import {
  AsyncObjectConfig,
  SyncObjectConfig,
  ExtractTSType,
  PromiseWrapper,
  ExtractConfigValueType,
  ExtractConfigValueJSType,
  ExtractTSTypePromise
} from "./../../Config"
import ArrayValueClass = require("./ArrayValueClass/ArrayValueClass")

export type TreeNodeType = "node" | "leaf" | "root"
export type TreeNodeValueJSType = "object" | "array" | "property"
/** ----------------------------- 条件类型： 获取 children 的类型声明 ----------------------------- */
/** 如果 Config 是一个 object 类型的 Config，返回其 ReactifyObjectTreeNode.children 的类型 */
export type ROTreeNodeChildren<Config> = ExtractConfigValueJSType<Config> extends "object"
  ? {
      [K in keyof ExtractPropertiesConfig<Config>]: ReactifyObjectTreeNode<ExtractPropertiesConfig<Config>[K], Config>
    }
  : never
/** 如果 Config 是一个 object 类型的 Config，返回其中的 properties 类型 */
export type ExtractPropertiesConfig<Config> = Config extends AsyncObjectConfig | SyncObjectConfig
  ? Config["properties"]
  : never
/** ----------------------------- 条件类型： 获取 value 的类型声明 ----------------------------- */
/** object 类型的 value 取值 */
export interface ObjectValueView_Injected<ROConfig> {
  $roTree: ReactifyObjectTreeNode<ROConfig>
  $set<
    Key extends ExtractConfigValueJSType<ROConfig> extends "array"
      ? number
      : ExtractConfigValueJSType<ROConfig> extends "object"
      ? keyof ExtractPropertiesConfig<ROConfig>
      : never
  >(
    propertyName: Key,
    newValue: ExtractConfigValueJSType<ROConfig> extends "array"
      ? ExtractTSType<ExtractConfigValueType<ROConfig>>
      : ExtractConfigValueJSType<ROConfig> extends "object"
      ? ExtractTSType<ExtractPropertiesConfig<ROConfig>[Key]>
      : never
  ): PromiseWrapper<
    ExtractConfigValueJSType<ROConfig> extends "array"
      ? ExtractConfigValueType<ROConfig>
      : ExtractConfigValueJSType<ROConfig> extends "object"
      ? ExtractPropertiesConfig<ROConfig>[Key]
      : never,
    void
  >
  $root: typeof ReactifyObjectTreeNode
  $object: ObjectValueView<ROConfig>
}
export type ObjectValueView<ROConfig> = ObjectValueView_Injected<ROConfig> &
  PromiseWrapper<
    ROConfig,
    { [Key in keyof ExtractConfigValueType<ROConfig>]: ValueView<ExtractConfigValueType<ROConfig>[Key]> }
  >

/** Array 类型的 value 取值 */
export type ArrayValueView<ROConfig> = ArrayValueClass<ROConfig>
/** Property 类型的 value 取值 */
export type PropertyValueView<ROConfig> = PromiseWrapper<ROConfig, ExtractTSType<ROConfig>>
/** 条件类型：根据 Config 的类型(array/object/property) 返回其 Value 的 TS 类型 */
export type ValueView<ROConfig> = ExtractConfigValueJSType<ROConfig> extends "object"
  ? ObjectValueView<ROConfig>
  : ExtractConfigValueJSType<ROConfig> extends "array"
  ? PromiseWrapper<ROConfig, ArrayValueView<ROConfig>>
  : ExtractConfigValueJSType<ROConfig> extends "property"
  ? PropertyValueView<ROConfig>
  : never

export type SetSequenceObjectType<Config> = ExtractConfigValueJSType<Config> extends "property"
  ? ExtractConfigValueType<Config>[keyof ExtractConfigValueType<Config>]
  : ExtractConfigValueJSType<Config> extends "array"
  ? [number, number, ...ExtractTSType<ExtractConfigValueType<Config>>[]]
  : { [prop in keyof ExtractConfigValueType<Config>]?: SetSequenceObjectType<ExtractConfigValueType<Config>[prop]> }

/** 根据 ParentConfig, RootConfig 选择根的 Config，一般 RootConfig 都要给
 * 如果没有给，只有根结点能够判断自己是根，子结点知道自己不是根，但子结点没有办法知道根结点
 */
export type PickRootConfig<ROConfig, ParentConfig, RootConfig> = ParentConfig extends null ? ROConfig : RootConfig
export type PickRootROTreeNode<ROConfig, ParentConfig, RootConfig, InjectedObjectType = {}> = ReactifyObjectTreeNode<
  PickRootConfig<ROConfig, ParentConfig, RootConfig>,
  null,
  null,
  InjectedObjectType
>
export type Injected<RootConfig, InjectedObjectType> = ValueView<RootConfig> & InjectedObjectType
