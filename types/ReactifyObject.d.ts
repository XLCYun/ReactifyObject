import ReactifyObjectTreeNode from "./ReactifyObjectTree/ReactifyObjectTreeNode/ReactifyObjectTreeNode"
import NVS from "./ReactifyObjectTree/ReactifyObjectTreeNode/SetupValue/noValueSymbol"
import Clone from "./clone/clone"
import { ExtractTSType } from "./Config"
import { EntryProcessorCollection } from "./ReactifyObjectTree/entries/ExportedType"
import validate from "./validator/validator"
import Compare from "./compare/compare"

declare module "reactify-object" {
  class ReactifyObject {
    static entry: EntryProcessorCollection
    static validator: typeof validate
    static compare: typeof Compare
    static Tree: typeof ReactifyObjectTreeNode
    static noValueSymbol: typeof NVS
    static clone: typeof Clone
    static inject<ROConfig, ParentConfig = null, RootConfig = null, InjectedObjectType = {}>(
      object: ExtractTSType<ROConfig> | {} | undefined | symbol,
      config: ROConfig,
      name: string,
      parent: ReactifyObjectTreeNode<ParentConfig> | null,
      copyFrom?: ExtractTSType<ROConfig> | {} | undefined | symbol
    ): ReactifyObjectTreeNode<ROConfig, ParentConfig, RootConfig, InjectedObjectType>
  }
  export = ReactifyObject
}
