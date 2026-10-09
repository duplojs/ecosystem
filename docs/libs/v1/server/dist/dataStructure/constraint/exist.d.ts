import type * as DCommon from "@duplojs-v1/lang/common";
import type * as DKind from "@duplojs-v1/lang/kind";
import * as DDataStructure from "@duplojs-v1/lang/dataStructure";
import type * as DSFile from '../../file';
export declare const existConstraintKind: DKind.Handler<DKind.Definition<"@DuplojsServerDataStructure/exist-constraint", unknown>>;
export interface ExistConstraintDefinition extends DDataStructure.ConstraintDefinition {
}
export interface ExistConstraint extends DCommon.UnionToIntersection<DDataStructure.Constraint<DSFile.FileInterface, DSFile.FileInterface, ExistConstraintDefinition> & DKind.Kind<typeof existConstraintKind>> {
}
export declare const ExistConstraint: () => ExistConstraint;
