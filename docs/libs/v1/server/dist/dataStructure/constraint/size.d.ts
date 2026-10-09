import * as DCommon from "@duplojs-v1/lang/common";
import type * as DKind from "@duplojs-v1/lang/kind";
import * as DDataStructure from "@duplojs-v1/lang/dataStructure";
import type * as DSFile from '../../file';
export declare const sizeConstraintKind: DKind.Handler<DKind.Definition<"@DuplojsServerDataStructure/size-constraint", unknown>>;
export interface SizeConstraintDefinition extends DDataStructure.ConstraintDefinition {
    min?: number;
    max?: number;
}
export interface SizeConstraintParams {
    min?: number | DCommon.BytesInString;
    max?: number | DCommon.BytesInString;
}
export interface SizeConstraint extends DCommon.UnionToIntersection<DDataStructure.Constraint<DSFile.FileInterface, DSFile.FileInterface, SizeConstraintDefinition> & DKind.Kind<typeof sizeConstraintKind>> {
}
export declare const SizeConstraint: (params: SizeConstraintParams) => SizeConstraint;
