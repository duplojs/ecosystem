import type * as DCommon from "@duplojs/lang/common";
import type * as DKind from "@duplojs/lang/kind";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DSFile from '../../file';
export declare const folderExistConstraintKind: DKind.Handler<DKind.Definition<"@DuplojsServerDataStructure/folder-exist-constraint", unknown>>;
export interface FolderExistConstraintDefinition extends DDataStructure.ConstraintDefinition {
}
export interface FolderExistConstraint extends DCommon.UnionToIntersection<DDataStructure.Constraint<DSFile.FolderInterface, DSFile.FolderInterface, FolderExistConstraintDefinition> & DKind.Kind<typeof folderExistConstraintKind>> {
}
export declare const FolderExistConstraint: () => FolderExistConstraint;
