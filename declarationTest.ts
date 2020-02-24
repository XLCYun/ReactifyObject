import {
  AsyncArrayConfig,
  SyncPropertyConfig,
  ExtractConfigValueType,
  Config,
  ExtractConfigValueJSType,
  AsyncPropertyConfig,
  SyncArrayConfig,
  ExtractTSType,
  SyncObjectConfig,
  ExtractTSTypePromise,
  PromiseWrapper,
  ExtractConfigMode
} from "./types/Config"
import { AsyncObjectConfig } from "./types/Config"
import {
  ROTreeNodeChildren,
  ObjectValueView_Injected,
  ObjectValueView,
  Injected
} from "./types/ReactifyObjectTree/ReactifyObjectTreeNode/ExportType"

import ReactifyObjectTreeNode = require("./types/ReactifyObjectTree/ReactifyObjectTreeNode/ReactifyObjectTreeNode")

/** 先建立最底层的属性的 ROConfig -> 传入的 ROConfig 应该能够推断出其 Children 的取值 */
let object = {
  GuangDong: {
    Shenzhen: "sz",
    Guangzhou: "gz"
  },
  Beijing: ["cy", "zgc"]
}

let SZConfig: Config<"sync", "property", { string: string }> = {
  bsonType: "string"
}

let GZConfig: Config<"async", "property", { string: string; number: number }> = {
  mode: "async",
  bsonType: ["string", "number"]
}

let GDConfig: Config<
  "sync",
  "object",
  {
    Shenzhen: Config<"sync", "property", { string: string }>
    Guangzhou: Config<"async", "property", { string: string }>
  }
> = {
  properties: { Shenzhen: {}, Guangzhou: { mode: "async" } },
  default: { Shenzhen: "4", Guangzhou: "6" }
}

type ObjectProperitesConfig = { TMP: AsyncPropertyConfig<{ string: string }> }
type defaultType = { [prop in keyof ObjectProperitesConfig]: ExtractTSType<ObjectProperitesConfig[prop]> }
type tmpType0 = ObjectProperitesConfig["TMP"]
type tmpType1 = ExtractTSType<tmpType0>
type tmpType2 = ExtractConfigValueJSType<tmpType0>
type tmpType3 = tmpType0[keyof tmpType0]

type tmpType4 = SyncObjectConfig<{
  TMP: AsyncPropertyConfig<{
    string: string
  }>
}>
let t4: tmpType4 = {
  properties: {
    TMP: {
      mode: "async",
      default: "4"
    }
  },
  default: {
    TMP: "4"
  }
}
type tmpType5 = SyncArrayConfig<
  SyncObjectConfig<{
    TMP: AsyncPropertyConfig<{
      string: string
    }>
  }>
>
let t5: tmpType5 = {
  items: {
    properties: {
      TMP: {
        mode: "async",
        default: "4"
      }
    }
  },
  default: [{ TMP: "4" }]
}
type tmpType5DefaultType = ExtractTSType<tmpType4>[]
let tmpType4JSType: ExtractConfigValueJSType<tmpType4> = "object"
let tmpType4TSType: { [prop in keyof tmpType4]: ExtractTSType<tmpType4[prop]> }

type BJConfigType = Config<
  "async",
  "array",
  Config<
    "async",
    "array",
    Config<
      "sync",
      "array",
      Config<"sync", "array", Config<"sync", "object", { TMP: Config<"async", "property", { string: string }> }>>
    >
  >
>
let BJConfig: BJConfigType = {
  mode: "async",
  bsonType: "array",
  items: {
    mode: "async",
    items: {
      items: {
        items: {
          properties: {
            TMP: {
              mode: "async"
            }
          }
        }
      }
    }
  },
  default: [[[[{ TMP: "4" }]]]]
}

/** ReactifyObjectTreeNode */
let ROTreeNodeBJ: ReactifyObjectTreeNode<BJConfigType, null, null, {}> = new ReactifyObjectTreeNode<
  BJConfigType,
  null,
  null,
  {}
>({}, BJConfig, "", null)
async function ROTreeNodeBJ_AsyncFunc() {
  // TODO 为 children 添加正确的类型声明, value???
  let RoTreeNodeBJ_Value = ROTreeNodeBJ.value
  let ROTreeNodeBJ_4 = (await RoTreeNodeBJ_Value)[4]
  let ROTreeNodeBJ_400 = (await ROTreeNodeBJ_4)[0][0]
  ROTreeNodeBJ_400.unshift({ TMP: "4" })
}
type RoTreeNodeBJ0 = ExtractTSType<
  ExtractConfigValueType<
    Config<
      "sync",
      "array",
      Config<"sync", "array", Config<"sync", "object", { TMP: Config<"async", "property", { string: string }> }>>
    >
  >
>

type ROTreeNodeConfigType = Config<
  "sync",
  "object",
  {
    a: SyncPropertyConfig<{ string: string }>
    b: SyncPropertyConfig<{ number: number }>
    c: AsyncPropertyConfig<{ string: string; number: number }>
    d: Config<"sync", "array", SyncPropertyConfig<{ null: null }>>
  }
>

let a: ROTreeNodeChildren<ROTreeNodeConfigType>
let ROTreeNodeConfig: ROTreeNodeConfigType = {
  properties: {
    a: { bsonType: "string" },
    b: { bsonType: "number" },
    c: { mode: "async", bsonType: ["string", "number"] },
    d: { bsonType: "array", items: { bsonType: "null" } }
  }
}
let ROTreeNode = new ReactifyObjectTreeNode<ROTreeNodeConfigType, null, null, {}>(undefined, ROTreeNodeConfig, "", null)
ROTreeNode.children.a.parent.children.a.parent.children.a.parent.children.a
ROTreeNode.value.d // FIXME 这种方式访问时，导致返回中的 d 的值是一个数组，而不是一个 ArrayValueClass 的实例

let b: ExtractConfigValueJSType<Config<"sync", "property", { string: string }>> = "property"

interface ItmpInterface0 {
  a: string
}
interface ItmpInterface1 {
  b: number
}

type tmpType6 = ItmpInterface0 & ItmpInterface1
let tmp6: tmpType6

/** ObjectValueView_Injected */
let OVVInjected: ObjectValueView_Injected<BJConfigType>
OVVInjected.$set(4, [[[{ TMP: "4" }]]])
OVVInjected.$object.$set(4, [[[{ TMP: "5" }]]])

let OVView: ObjectValueView<BJConfigType>
async function OVViewFunc() {
  let v1 = await OVView
  let v2 = v1[0]
  let v3 = await v2
  let v4 = v3[0][0][0].TMP
  let v5 = await v4
  v5.toLowerCase()
}

let roTree: ReactifyObjectTreeNode<ROTreeNodeConfigType>
roTree.setSequence({ a: "4" })
roTree.setSequence({ a: "4", b: 4 })
roTree.setSequence({ a: "4", b: 4, c: 4 })
roTree.setSequence({ a: "4", b: 4, c: "4" })
roTree.setSequence({ a: "4", b: 4, c: "4", d: [0, 5, null, null, null] })

class InjectedClass {
  injectClassProp: number = 4
}

let injectedRoTree: ReactifyObjectTreeNode<ROTreeNodeConfigType, null, null, InjectedClass>
injectedRoTree.$object.injectClassProp = 5

let InjectedObject = {
  injectObjectProp: 4
}

let injectedRoTreeInjectedToObject: ReactifyObjectTreeNode<ROTreeNodeConfigType, null, null, typeof InjectedObject>
injectedRoTreeInjectedToObject.$object.injectObjectProp = 5

type ROTreeNode_TestHook_ConfigType_a_Config = SyncPropertyConfig<{ string: string }>
type ROTreeNode_TestHook_ConfigType_d_Config = Config<"sync", "array", SyncPropertyConfig<{ null: null }>>
type ROTreeNode_TestHook_ConfigType = Config<
  "sync",
  "object",
  {
    a: ROTreeNode_TestHook_ConfigType_a_Config
    b: SyncPropertyConfig<{ number: number }>
    c: AsyncPropertyConfig<{ string: string; number: number }>
    d: ROTreeNode_TestHook_ConfigType_d_Config
  }
>

let ROTreeNode_TestHook_Config: ROTreeNode_TestHook_ConfigType = {
  bsonType: "object",
  afterGet: function(this: ReactifyObjectTreeNode<ROTreeNode_TestHook_ConfigType, null, null, InjectedClass>): void {
    this.$object.injectClassProp
  },
  properties: {
    a: {
      bsonType: "string",
      beforeGet: function(
        this: ReactifyObjectTreeNode<
          ROTreeNode_TestHook_ConfigType_a_Config,
          ROTreeNodeConfigType,
          ROTreeNodeConfigType,
          InjectedClass
        >
      ) {
        this.$object.injectClassProp
      }
    },
    b: { bsonType: "number" },
    c: { mode: "async", bsonType: ["string", "number"] },
    d: {
      bsonType: "array",
      beforeGet: function(
        this: ReactifyObjectTreeNode<
          ROTreeNode_TestHook_ConfigType_d_Config,
          ROTreeNode_TestHook_ConfigType,
          ROTreeNode_TestHook_ConfigType,
          InjectedClass
        >
      ) {
        this.$object.$set("a", "4")
      },
      items: {
        bsonType: "null"
      }
    }
  }
}

let ROTreeNode_TestHook = new ReactifyObjectTreeNode<ROTreeNode_TestHook_ConfigType, null, null, InjectedClass>(
  new InjectedClass(),
  ROTreeNode_TestHook_Config,
  "",
  null
)

ROTreeNode_TestHook.$object.injectClassProp = 4
ROTreeNode_TestHook.value.$roTree.children.b.setter = 4
ROTreeNode_TestHook.$object.b = 4

type tmpType8 = ExtractTSTypePromise<ROTreeNode_TestHook_ConfigType>
type tmpType9 = PromiseWrapper<
  ROTreeNode_TestHook_ConfigType,
  {
    [prop in keyof ExtractConfigValueType<ROTreeNode_TestHook_ConfigType>]: ExtractTSTypePromise<
      ExtractConfigValueType<ROTreeNode_TestHook_ConfigType>[prop]
    >
  }
>
// =>
type tmpType10 = {
  [prop in keyof ExtractConfigValueType<ROTreeNode_TestHook_ConfigType>]: ExtractTSTypePromise<
    ExtractConfigValueType<ROTreeNode_TestHook_ConfigType>[prop]
  >
}
type tmpType11 = ExtractTSTypePromise<ExtractConfigValueType<ROTreeNode_TestHook_ConfigType>["b"]>
type tmpType12 = ExtractConfigValueType<ROTreeNode_TestHook_ConfigType>["b"]
type tmpType13 = PromiseWrapper<tmpType12, ExtractConfigValueType<tmpType12>[keyof ExtractConfigValueType<tmpType12>]>
// 展开 PromiseWrapper
type tmpType14 = ExtractConfigMode<tmpType12> extends "async"
  ? Promise<ExtractConfigValueType<tmpType12>[keyof ExtractConfigValueType<tmpType12>]>
  : ExtractConfigValueType<tmpType12>[keyof ExtractConfigValueType<tmpType12>]
let tmp14: tmpType14 = 15

// 展开这埋在的 ExtractConfigMode
type tmpType14_1 = ExtractConfigMode<tmpType12>
let tmpType14_1: tmpType14_1 = "sync"

type tmpType15 = SyncPropertyConfig<{
  number: number
}> extends AsyncObjectConfig<any> | SyncObjectConfig<any>
  ? "object"
  : SyncPropertyConfig<{
      number: number
    }> extends AsyncArrayConfig<any> | SyncArrayConfig<any>
  ? "array"
  : SyncPropertyConfig<{
      number: number
    }> extends AsyncPropertyConfig<any> | SyncPropertyConfig<any>
  ? "property"
  : never
let tmp15: tmpType15 = "property"

type tmpType16 = SyncPropertyConfig<{
  number: number
}> extends AsyncObjectConfig<any> | SyncObjectConfig<any>
  ? "object"
  : "not object"
let tmp16: tmpType16 = "not object"

type tmpType17 = SyncPropertyConfig<{
  number: number
}> extends AsyncArrayConfig<any> | SyncArrayConfig<any>
  ? "array"
  : "not array"
let tmp17: tmpType17 = "not array"

type tmpType18 = SyncPropertyConfig<{
  number: number
}> extends AsyncPropertyConfig<any> | SyncPropertyConfig<any>
  ? "property"
  : "not property"
let tmp18: tmpType18 = "property"

/* ==================== 全为 async ==================== */

type AllAsyncConfigType = AsyncObjectConfig<{
  a: AsyncArrayConfig<AsyncPropertyConfig<{ string: string; number: number }>>
  b: AsyncPropertyConfig<{
    object: any
  }>
  c: AsyncArrayConfig<
    AsyncObjectConfig<{
      c1: AsyncPropertyConfig<{ string: string }>
      c2: AsyncPropertyConfig<{ number: number }>
    }>
  >
}>

let AllAsyncConfig: AllAsyncConfigType = {
  mode: "async",
  bsonType: "object",
  properties: {
    a: {
      mode: "async",
      items: {
        mode: "async",
        bsonType: ["string", "number"]
      }
    },
    b: {
      mode: "async",
      bsonType: "object"
    },
    c: {
      mode: "async",
      bsonType: "array",
      items: {
        bsonType: "object",
        mode: "async",
        properties: {
          c1: {
            mode: "async",
            bsonType: "string"
          },
          c2: {
            mode: "async",
            bsonType: "number"
          }
        }
      }
    }
  }
}

let allAsync = new ReactifyObjectTreeNode<AllAsyncConfigType, null, null, null>(AllAsyncConfig, null, null, null)
let injected: Injected<AllAsyncConfigType, { injectedClassPropa: number; injectedClassPropb: string }>
injected.injectedClassPropa = 5
injected.injectedClassPropb = "9"
async function allAsyncFunc() {
  let a = await allAsync.$root
  let aa = await a.a
  let aaValue = await aa
  let aaValueItem = await aaValue[0]
  let aaValueItem0 = aaValueItem
  let rootTNode = allAsync.root
  rootTNode.children.a.value
  ;(await (await injected).a).getTreeNodeByIndex(4)
}

/** default 可以是一个函数 */
type BJConfigType1 = Config<
  "async",
  "array",
  Config<
    "async",
    "array",
    Config<
      "sync",
      "array",
      Config<"sync", "array", Config<"sync", "object", { TMP: Config<"async", "property", { string: string }> }>>
    >
  >
>
let BJConfig1: BJConfigType = {
  mode: "async",
  bsonType: "array",
  default: () => {
    return []
  },
  items: {
    mode: "async",
    default: () => [],
    items: {
      default: () => [[{ TMP: "" }]],
      items: {
        items: {
          default: () => {
            return { TMP: "" }
          },
          properties: {
            TMP: {
              mode: "async",
              default: "4"
            }
          }
        }
      }
    }
  },
  default: [[[[{ TMP: "4" }]]]]
}
