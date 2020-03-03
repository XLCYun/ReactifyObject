import { ValueView } from "../ReactifyObjectTreeNode/ExportType"
import ReactifyObjectTreeNode = require("../ReactifyObjectTreeNode/ReactifyObjectTreeNode")

export interface DefaultRevisionInfo {
  create_date: Date
  name: string
  path: string
}
export type RevisionInfoFunction<ROConfig, RevisionInfo = DefaultRevisionInfo> = (
  this: ValueView<ROConfig, any, RevisionInfo>,
  value: ReactifyObjectTreeNode<ROConfig>
) => RevisionInfo

export type PatchItemOp = "add" | "remove"
export interface PatchItem<ValueType = any> {
  path: string
  value: ValueType
  op: PatchItemOp
}
export interface Patch<RevisionInfo = DefaultRevisionInfo> {
  revisionInfo: RevisionInfo
  patch: PatchItem[]
}
