import * as DCommon from "@duplojs-v1/lang/common";
import type * as DKind from "@duplojs-v1/lang/kind";
import * as DDataStructure from "@duplojs-v1/lang/dataStructure";
import type * as DSFile from '../../file';
export declare const mimeTypeConstraintKind: DKind.Handler<DKind.Definition<"@DuplojsServerDataStructure/mime-type-constraint", unknown>>;
export interface MimeTypeConstraintDefinition extends DDataStructure.ConstraintDefinition {
    regex: RegExp;
}
export interface MimeTypeConstraint extends DCommon.UnionToIntersection<DDataStructure.Constraint<DSFile.FileInterface, DSFile.FileInterface, MimeTypeConstraintDefinition> & DKind.Kind<typeof mimeTypeConstraintKind>> {
}
export declare const MimeTypeConstraint: (mimeType: Parameters<typeof DCommon.toRegExp>[0]) => MimeTypeConstraint;
