import { TreeNodeValueJSType } from "./ReactifyObjectTree/ReactifyObjectTreeNode/ExportType"
import ReactifyObjectTreeNode = require("./ReactifyObjectTree/ReactifyObjectTreeNode/ReactifyObjectTreeNode")

/** 工具类型：如果 Config 的 mode 类型是 "async"，用 Promise 包裹泛型参数 T */
export type PromiseWrapper<Config, T> = ExtractConfigMode<Config> extends "async" ? Promise<T> : T
export type AnyFunction<ArgumentArrayType extends any[] = any, ReturnType = any> = (
  ...args: ArgumentArrayType
) => ReturnType

/** 钩子函数 */
export type AsyncHookFunction<ArgsType extends any[] = any, ReturnType = any> = (
  ...args: ArgsType
) => Promise<void | ReturnType>
export type SyncHookFunction<ArgsType extends any[] = any, ReturnType = any> = (...args: ArgsType) => void | ReturnType

/** 条件类型：根据 mode 选择同/异步的钩子函数声明 */
export type PickASyncHookFunction<
  Mode extends ConfigMode,
  ArgsType extends any[] = any,
  ReturnType = any
> = Mode extends "async" ? AsyncHookFunction<ArgsType, ReturnType> : SyncHookFunction<ArgsType, ReturnType>

/** 同/异步模式 mode 的声明 */
export type ConfigMode = "async" | "sync"

/** 默认内置的 type 的可能取值以及对应的 TS 类型 */
export interface TypeMapper<ObjectType = any, ArrayType = any> {
  object: ObjectType
  array: ArrayType
  double: number
  bool: boolean
  string: string
  null: null
}

/** 默认内置的 bsonType 的可能取值以及对应的 TS 类型 */
export interface BsonTypeMapper<ObjectType = any, ArrayType = any> {
  double: number
  string: string
  object: ObjectType
  array: ArrayType
  bool: boolean
  date: Date
  null: null
  regex: RegExp
  int: number
  timestamp: number
  long: number
}

/** -------------------------------- Object 类型  -------------------------------- */
type ObjectHookFunctionReturnType<ObjectProperitesConfig> = {
  [prop in keyof ObjectProperitesConfig]: ExtractTSType<ObjectProperitesConfig[prop]>
}
type ObjectHookFunction<Mode extends ConfigMode, ObjectProperitesConfig, NumberOfArgs> = PickASyncHookFunction<
  Mode,
  NumberOfArgs extends "1"
    ? [ObjectHookFunctionReturnType<ObjectProperitesConfig>]
    : NumberOfArgs extends "2"
    ? [ObjectHookFunctionReturnType<ObjectProperitesConfig>, ObjectHookFunctionReturnType<ObjectProperitesConfig>]
    : [],
  ObjectHookFunctionReturnType<ObjectProperitesConfig>
>
/** Object 类型的基本配置结构声明
 * 其格式为 ObjectConfigBase<{propA: Config<...>, propB: Config<...>}>
 */
interface ObjectConfigBase<Mode extends ConfigMode, ObjectProperitesConfig = any> {
  /** Hooks */
  afterGet?: ObjectHookFunction<Mode, ObjectProperitesConfig, "1">
  afterSet?: ObjectHookFunction<Mode, ObjectProperitesConfig, "2">
  afterUpdate?: ObjectHookFunction<Mode, ObjectProperitesConfig, "2">
  beforeGet?: ObjectHookFunction<Mode, ObjectProperitesConfig, "1">
  beforeSet?: ObjectHookFunction<Mode, ObjectProperitesConfig, "2">
  beforeUpdate?: ObjectHookFunction<Mode, ObjectProperitesConfig, "2">
  update?: ObjectHookFunction<Mode, ObjectProperitesConfig, "0">

  bsonType?: "object"
  type?: "object"
  default?:
    | { [prop in keyof ObjectProperitesConfig]: ExtractTSType<ObjectProperitesConfig[prop]> }
    | AnyFunction<any, { [prop in keyof ObjectProperitesConfig]: ExtractTSType<ObjectProperitesConfig[prop]> }>
  init?: SyncHookFunction<any[], void>
  properties: { [prop in keyof ObjectProperitesConfig]: ObjectProperitesConfig[prop] }
}
/** 异步的 Object 类型的基本配置结构声明 */
export interface AsyncObjectConfig<ObjectProperitesConfig = any>
  extends ObjectConfigBase<"async", ObjectProperitesConfig> {
  mode: "async"
}
/** 同步的 Object 类型的基本配置结构声明 */
export interface SyncObjectConfig<ObjectProperitesConfig = any>
  extends ObjectConfigBase<"sync", ObjectProperitesConfig> {
  mode?: "sync"
}

/** -------------------------------- Array 类型  -------------------------------- */
type ArrayHookFunction<Mode extends ConfigMode, ArrayItemConfig, NumberOfArgs> = PickASyncHookFunction<
  Mode,
  NumberOfArgs extends "1"
    ? [ExtractTSType<ArrayItemConfig>[]]
    : NumberOfArgs extends "2"
    ? [ExtractTSType<ArrayItemConfig>[], ExtractTSType<ArrayItemConfig>[]]
    : [],
  ExtractTSType<ArrayItemConfig>[]
>
/** Array 类型的基本配置结构声明
 * 其格式为 ArrayConfigBase<Config<...>>
 */
export interface ArrayConfigBase<Mode extends ConfigMode, ArrayItemConfig = any> {
  /** Hooks */
  afterGet?: ArrayHookFunction<Mode, ArrayItemConfig, "1">
  afterSet?: ArrayHookFunction<Mode, ArrayItemConfig, "2">
  afterUpdate?: ArrayHookFunction<Mode, ArrayItemConfig, "2">
  beforeGet?: ArrayHookFunction<Mode, ArrayItemConfig, "1">
  beforeSet?: ArrayHookFunction<Mode, ArrayItemConfig, "2">
  beforeUpdate?: ArrayHookFunction<Mode, ArrayItemConfig, "2">
  update?: ArrayHookFunction<Mode, ArrayItemConfig, "0">

  bsonType?: "array"
  type?: "array"
  default?: ExtractTSType<ArrayItemConfig>[] | AnyFunction<any, ExtractTSType<ArrayItemConfig>[]>
  init?: SyncHookFunction<any[], void>
  items: ArrayItemConfig
}
/** 异步的 Array 类型的基本配置结构声明 */
export interface AsyncArrayConfig<ArrayItemConfig = any> extends ArrayConfigBase<"async", ArrayItemConfig> {
  mode: "async"
}
/** 同步的 Array 类型的基本配置结构声明 */
export interface SyncArrayConfig<ArrayItemConfig = any> extends ArrayConfigBase<"sync", ArrayItemConfig> {
  mode?: "sync"
}

/** -------------------------------- Property 类型  -------------------------------- */
type PropertyHookFunction<Mode extends ConfigMode, NameToTypeMapper, NumberOfArgs> = PickASyncHookFunction<
  Mode,
  NumberOfArgs extends "1"
    ? [NameToTypeMapper[keyof NameToTypeMapper]]
    : NumberOfArgs extends "2"
    ? [NameToTypeMapper[keyof NameToTypeMapper], NameToTypeMapper[keyof NameToTypeMapper]]
    : [],
  NameToTypeMapper[keyof NameToTypeMapper]
>
/** Property 属性类型的基本配置结构声明 */
export interface PropertyConfigBase<Mode extends ConfigMode, NameToTypeMapper = BsonTypeMapper> {
  /** Hooks */
  afterGet?: PropertyHookFunction<Mode, NameToTypeMapper, "1">
  afterSet?: PropertyHookFunction<Mode, NameToTypeMapper, "2">
  afterUpdate?: PropertyHookFunction<Mode, NameToTypeMapper, "2">
  beforeGet?: PropertyHookFunction<Mode, NameToTypeMapper, "1">
  beforeSet?: PropertyHookFunction<Mode, NameToTypeMapper, "2">
  beforeUpdate?: PropertyHookFunction<Mode, NameToTypeMapper, "2">
  update?: PropertyHookFunction<Mode, NameToTypeMapper, "0">

  bsonType?: keyof NameToTypeMapper | (keyof NameToTypeMapper)[]
  type?: keyof TypeMapper | keyof TypeMapper[]

  default?: NameToTypeMapper[keyof NameToTypeMapper] | AnyFunction<any, NameToTypeMapper[keyof NameToTypeMapper]>
  validator?: AnyFunction<[NameToTypeMapper[keyof NameToTypeMapper]], boolean>
  init?: SyncHookFunction<any, void>
}
/** 异步的 Property 属性类型的基本配置结构声明 */
export interface AsyncPropertyConfig<NameToTypeMapper = BsonTypeMapper>
  extends PropertyConfigBase<"async", NameToTypeMapper> {
  mode: "async"
}
/** 同步的 Property 属性类型的基本配置结构声明 */
export interface SyncPropertyConfig<NameToTypeMapper = BsonTypeMapper>
  extends PropertyConfigBase<"sync", NameToTypeMapper> {
  mode?: "sync"
}

/** 条件类型：根据 mode 挑选出 同/异 步的 Object 类型的配置结构声明接口 */
export type ObjectConfig<Mode extends ConfigMode, ObjectProperitesConfig = any> = Mode extends "async"
  ? AsyncObjectConfig<ObjectProperitesConfig>
  : SyncObjectConfig<ObjectProperitesConfig>

/** 条件类型：根据 mode 挑选出 同/异 步的 Array 类型的配置结构声明接口 */
export type ArrayConfig<Mode extends ConfigMode, ArrayItemConfig = any> = Mode extends "async"
  ? AsyncArrayConfig<ArrayItemConfig>
  : SyncArrayConfig<ArrayItemConfig>

/** 条件类型：根据 mode 挑选出 同/异 步的 Property 类型的配置结构声明接口 */
export type PropertyConfig<Mode extends ConfigMode, NameToTypeMapper = any> = Mode extends "async"
  ? AsyncPropertyConfig<NameToTypeMapper>
  : SyncPropertyConfig<NameToTypeMapper>

/** 根据同/异步以及 Config 配置的对象是 object/array/property 返回相应的 Config 接口
 * 当 ValueType 是 object 时， ValueType 视为 object 的 TS 类型声明结构 {a: number, b: string}...
 * 当 ValueType 是 array 时，ValueType 视为目标对象数组元素的 TS 类型声明结构，即对象为形如以下的数组：ValueType[]
 * 当 ValueType 是 property 时，ValueType 视为目标对象的可能取值接口：{number: number, string: string}，对象可取值为 number | string
 */
export type Config<
  Mode extends ConfigMode,
  ValueJSType extends TreeNodeValueJSType,
  ValueType = any
> = ValueJSType extends "object"
  ? ObjectConfig<Mode, ValueType>
  : ValueJSType extends "array"
  ? ArrayConfig<Mode, ValueType>
  : PropertyConfig<Mode, ValueType>

/** 取出一个 Config 中的 Mode */
export type ExtractConfigMode<TConfig> = TConfig extends
  | SyncPropertyConfig<any>
  | SyncArrayConfig<any>
  | SyncObjectConfig<any>
  ? "sync"
  : TConfig extends AsyncPropertyConfig<any> | AsyncArrayConfig<any> | AsyncObjectConfig<any>
  ? "async"
  : never
/** 取出一个 Config 中的 ValueJSType */
export type ExtractConfigValueJSType<TConfig> = TConfig extends AsyncObjectConfig<any> | SyncObjectConfig<any>
  ? "object"
  : TConfig extends AsyncArrayConfig<any> | SyncArrayConfig<any>
  ? "array"
  : TConfig extends AsyncPropertyConfig<any> | SyncPropertyConfig<any>
  ? "property"
  : never
/** 取出一个 Config 中的 ValueType */
export type ExtractConfigValueType<TConfig> = TConfig extends
  | SyncPropertyConfig<infer T>
  | AsyncPropertyConfig<infer T>
  | AsyncArrayConfig<infer T>
  | SyncArrayConfig<infer T>
  | AsyncObjectConfig<infer T>
  | SyncObjectConfig<infer T>
  ? T
  : never

export type ConfigType =
  | AsyncArrayConfig
  | SyncArrayConfig
  | AsyncObjectConfig
  | SyncObjectConfig
  | AsyncPropertyConfig
  | SyncPropertyConfig

/** 根据一个 Config 取出其 TS 类型声明
 * 如果该 Config 是 property 的 Config，返回该属性的合法取值的 TS 类型声明
 * 如果该 Config 是 array 的 Config，返回该数组元素的合法取值的 TS 类型声明
 * 如果该 Config 是 object 的 Config，返回该对象的合法取值的接口
 * 由于 TS 不支持 Type 循环嵌套，对于数组目前支持 10 层数组直接连续的嵌套，超出此层数后将不再有类型检查支持，而使用 any[]
 */
export type ExtractTSType<Config> = ExtractConfigValueJSType<Config> extends "property"
  ? ExtractConfigValueType<Config>[keyof ExtractConfigValueType<Config>]
  : ExtractConfigValueJSType<Config> extends "array"
  ? ExtractTSType2<ExtractConfigValueType<Config>>[]
  : ExtractTSTypeFromObjectConfig<Config>

type ExtractTSTypeFromObjectConfig<Config> = {
  [prop in keyof ExtractConfigValueType<Config>]: ExtractTSType<ExtractConfigValueType<Config>[prop]>
}

type ExtractTSType2<Config> = ExtractConfigValueJSType<Config> extends "property"
  ? ExtractConfigValueType<Config>[keyof ExtractConfigValueType<Config>]
  : ExtractConfigValueJSType<Config> extends "array"
  ? ExtractTSType3<ExtractConfigValueType<Config>>[]
  : { [prop in keyof ExtractConfigValueType<Config>]: ExtractTSType<ExtractConfigValueType<Config>[prop]> }

type ExtractTSType3<Config> = ExtractConfigValueJSType<Config> extends "property"
  ? ExtractConfigValueType<Config>[keyof ExtractConfigValueType<Config>]
  : ExtractConfigValueJSType<Config> extends "array"
  ? ExtractTSType4<ExtractConfigValueType<Config>>[]
  : { [prop in keyof ExtractConfigValueType<Config>]: ExtractTSType<ExtractConfigValueType<Config>[prop]> }

type ExtractTSType4<Config> = ExtractConfigValueJSType<Config> extends "property"
  ? ExtractConfigValueType<Config>[keyof ExtractConfigValueType<Config>]
  : ExtractConfigValueJSType<Config> extends "array"
  ? ExtractTSType5<ExtractConfigValueType<Config>>[]
  : { [prop in keyof ExtractConfigValueType<Config>]: ExtractTSType<ExtractConfigValueType<Config>[prop]> }

type ExtractTSType5<Config> = ExtractConfigValueJSType<Config> extends "property"
  ? ExtractConfigValueType<Config>[keyof ExtractConfigValueType<Config>]
  : ExtractConfigValueJSType<Config> extends "array"
  ? ExtractTSType6<ExtractConfigValueType<Config>>[]
  : { [prop in keyof ExtractConfigValueType<Config>]: ExtractTSType<ExtractConfigValueType<Config>[prop]> }

type ExtractTSType6<Config> = ExtractConfigValueJSType<Config> extends "property"
  ? ExtractConfigValueType<Config>[keyof ExtractConfigValueType<Config>]
  : ExtractConfigValueJSType<Config> extends "array"
  ? ExtractTSType7<ExtractConfigValueType<Config>>[]
  : { [prop in keyof ExtractConfigValueType<Config>]: ExtractTSType<ExtractConfigValueType<Config>[prop]> }

type ExtractTSType7<Config> = ExtractConfigValueJSType<Config> extends "property"
  ? ExtractConfigValueType<Config>[keyof ExtractConfigValueType<Config>]
  : ExtractConfigValueJSType<Config> extends "array"
  ? ExtractTSType8<ExtractConfigValueType<Config>>[]
  : { [prop in keyof ExtractConfigValueType<Config>]: ExtractTSType<ExtractConfigValueType<Config>[prop]> }

type ExtractTSType8<Config> = ExtractConfigValueJSType<Config> extends "property"
  ? ExtractConfigValueType<Config>[keyof ExtractConfigValueType<Config>]
  : ExtractConfigValueJSType<Config> extends "array"
  ? ExtractTSType9<ExtractConfigValueType<Config>>[]
  : { [prop in keyof ExtractConfigValueType<Config>]: ExtractTSType<ExtractConfigValueType<Config>[prop]> }

type ExtractTSType9<Config> = ExtractConfigValueJSType<Config> extends "property"
  ? ExtractConfigValueType<Config>[keyof ExtractConfigValueType<Config>]
  : ExtractConfigValueJSType<Config> extends "array"
  ? ExtractTSType10<ExtractConfigValueType<Config>>[]
  : { [prop in keyof ExtractConfigValueType<Config>]: ExtractTSType<ExtractConfigValueType<Config>[prop]> }

type ExtractTSType10<Config> = ExtractConfigValueJSType<Config> extends "property"
  ? ExtractConfigValueType<Config>[keyof ExtractConfigValueType<Config>]
  : ExtractConfigValueJSType<Config> extends "array"
  ? any[]
  : { [prop in keyof ExtractConfigValueType<Config>]: ExtractTSType<ExtractConfigValueType<Config>[prop]> }

/**
 * 根据一个 Config 取出其 TS 类型声明，如果该 Config 的 mode 是 async，则用 Promise 进行包裹
 * 如果该 Config 是 property 的 Config，返回该属性的合法取值的 TS 类型声明
 * 如果该 Config 是 array 的 Config，返回该数组元素的合法取值的 TS 类型声明
 * 如果该 Config 是 object 的 Config，返回该对象的合法取值的接口
 * 由于 TS 不支持 Type 循环嵌套，对于数组目前支持 10 层数组直接连续的嵌套，超出此层数后将不再有类型检查支持，而使用 any[]
 */
export type ExtractTSTypePromise<Config> = ExtractConfigValueJSType<Config> extends "property"
  ? PromiseWrapper<Config, ExtractConfigValueType<Config>[keyof ExtractConfigValueType<Config>]>
  : ExtractConfigValueJSType<Config> extends "array"
  ? PromiseWrapper<Config, ExtractTSTypePromise2<ExtractConfigValueType<Config>>[]>
  : PromiseWrapper<
      Config,
      { [prop in keyof ExtractConfigValueType<Config>]: ExtractTSTypePromise<ExtractConfigValueType<Config>[prop]> }
    >

export type ExtractTSTypePromise2<Config> = ExtractConfigValueJSType<Config> extends "property"
  ? PromiseWrapper<Config, ExtractConfigValueType<Config>[keyof ExtractConfigValueType<Config>]>
  : ExtractConfigValueJSType<Config> extends "array"
  ? PromiseWrapper<Config, ExtractTSTypePromise3<ExtractConfigValueType<Config>>[]>
  : PromiseWrapper<
      Config,
      { [prop in keyof ExtractConfigValueType<Config>]: ExtractTSTypePromise<ExtractConfigValueType<Config>[prop]> }
    >
export type ExtractTSTypePromise3<Config> = ExtractConfigValueJSType<Config> extends "property"
  ? PromiseWrapper<Config, ExtractConfigValueType<Config>[keyof ExtractConfigValueType<Config>]>
  : ExtractConfigValueJSType<Config> extends "array"
  ? PromiseWrapper<Config, ExtractTSTypePromise4<ExtractConfigValueType<Config>>[]>
  : PromiseWrapper<
      Config,
      { [prop in keyof ExtractConfigValueType<Config>]: ExtractTSTypePromise<ExtractConfigValueType<Config>[prop]> }
    >
export type ExtractTSTypePromise4<Config> = ExtractConfigValueJSType<Config> extends "property"
  ? PromiseWrapper<Config, ExtractConfigValueType<Config>[keyof ExtractConfigValueType<Config>]>
  : ExtractConfigValueJSType<Config> extends "array"
  ? PromiseWrapper<Config, ExtractTSTypePromise5<ExtractConfigValueType<Config>>[]>
  : PromiseWrapper<
      Config,
      { [prop in keyof ExtractConfigValueType<Config>]: ExtractTSTypePromise<ExtractConfigValueType<Config>[prop]> }
    >
export type ExtractTSTypePromise5<Config> = ExtractConfigValueJSType<Config> extends "property"
  ? PromiseWrapper<Config, ExtractConfigValueType<Config>[keyof ExtractConfigValueType<Config>]>
  : ExtractConfigValueJSType<Config> extends "array"
  ? PromiseWrapper<Config, ExtractTSTypePromise6<ExtractConfigValueType<Config>>[]>
  : PromiseWrapper<
      Config,
      { [prop in keyof ExtractConfigValueType<Config>]: ExtractTSTypePromise<ExtractConfigValueType<Config>[prop]> }
    >
export type ExtractTSTypePromise6<Config> = ExtractConfigValueJSType<Config> extends "property"
  ? PromiseWrapper<Config, ExtractConfigValueType<Config>[keyof ExtractConfigValueType<Config>]>
  : ExtractConfigValueJSType<Config> extends "array"
  ? PromiseWrapper<Config, ExtractTSTypePromise7<ExtractConfigValueType<Config>>[]>
  : PromiseWrapper<
      Config,
      { [prop in keyof ExtractConfigValueType<Config>]: ExtractTSTypePromise<ExtractConfigValueType<Config>[prop]> }
    >
export type ExtractTSTypePromise7<Config> = ExtractConfigValueJSType<Config> extends "property"
  ? PromiseWrapper<Config, ExtractConfigValueType<Config>[keyof ExtractConfigValueType<Config>]>
  : ExtractConfigValueJSType<Config> extends "array"
  ? PromiseWrapper<Config, ExtractTSTypePromise8<ExtractConfigValueType<Config>>[]>
  : PromiseWrapper<
      Config,
      { [prop in keyof ExtractConfigValueType<Config>]: ExtractTSTypePromise<ExtractConfigValueType<Config>[prop]> }
    >
export type ExtractTSTypePromise8<Config> = ExtractConfigValueJSType<Config> extends "property"
  ? PromiseWrapper<Config, ExtractConfigValueType<Config>[keyof ExtractConfigValueType<Config>]>
  : ExtractConfigValueJSType<Config> extends "array"
  ? PromiseWrapper<Config, ExtractTSTypePromise9<ExtractConfigValueType<Config>>[]>
  : PromiseWrapper<
      Config,
      { [prop in keyof ExtractConfigValueType<Config>]: ExtractTSTypePromise<ExtractConfigValueType<Config>[prop]> }
    >
export type ExtractTSTypePromise9<Config> = ExtractConfigValueJSType<Config> extends "property"
  ? PromiseWrapper<Config, ExtractConfigValueType<Config>[keyof ExtractConfigValueType<Config>]>
  : ExtractConfigValueJSType<Config> extends "array"
  ? PromiseWrapper<Config, ExtractTSTypePromise10<ExtractConfigValueType<Config>>[]>
  : PromiseWrapper<
      Config,
      { [prop in keyof ExtractConfigValueType<Config>]: ExtractTSTypePromise<ExtractConfigValueType<Config>[prop]> }
    >
export type ExtractTSTypePromise10<Config> = ExtractConfigValueJSType<Config> extends "property"
  ? PromiseWrapper<Config, ExtractConfigValueType<Config>[keyof ExtractConfigValueType<Config>]>
  : ExtractConfigValueJSType<Config> extends "array"
  ? PromiseWrapper<Config, any[]>
  : PromiseWrapper<
      Config,
      { [prop in keyof ExtractConfigValueType<Config>]: ExtractTSTypePromise<ExtractConfigValueType<Config>[prop]> }
    >
