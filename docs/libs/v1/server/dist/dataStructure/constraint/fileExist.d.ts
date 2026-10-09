import type * as DCommon from "@duplojs-v1/lang/common";
import type * as DKind from "@duplojs-v1/lang/kind";
import * as DDataStructure from "@duplojs-v1/lang/dataStructure";
import type * as DSFile from '../../file';
export declare const fileExistConstraintKind: DKind.Handler<DKind.Definition<"@DuplojsServerDataStructure/file-exist-constraint", unknown>>;
export interface FileExistConstraintDefinition extends DDataStructure.ConstraintDefinition {
}
export interface FileExistConstraint extends DCommon.UnionToIntersection<DDataStructure.Constraint<DSFile.FileInterface, DSFile.FileInterface, FileExistConstraintDefinition> & DKind.Kind<typeof fileExistConstraintKind>> {
}
export declare const FileExistConstraint: () => FileExistConstraint;
