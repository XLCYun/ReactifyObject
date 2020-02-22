import ReactifyObjectTreeNode from "../ReactifyObjectTreeNode/ReactifyObjectTreeNode"
import { ExtractTSType } from "../../Config"
import { DefaultRevisionInfo, RevisionInfoFunction, Patch } from "./ExportType"
import { ValueView, TreeNodeValueJSType } from "../ReactifyObjectTreeNode/ExportType"

declare class revision<ROConfig, RevisionInfo = DefaultRevisionInfo> {
  constructor(
    tree: ReactifyObjectTreeNode<ROConfig>,
    generateRevisionInfoFunction: RevisionInfoFunction<ROConfig, RevisionInfo>
  )
  revisionInfoFunc: RevisionInfoFunction<ROConfig, RevisionInfo>
  base: undefined | ExtractTSType<ROConfig>
  baseSet: boolean
  tree: ReactifyObjectTreeNode<ROConfig>
  refreshBase(): void
  getRollbackPath(): Patch<RevisionInfo>
  applyPatch(patch: Patch<RevisionInfo>): void
}

export = revision
