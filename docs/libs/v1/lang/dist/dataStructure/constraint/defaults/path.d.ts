import { ConstraintDefinition, Constraint } from '../base';
import type * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
import * as DPath from '../../../path';
export declare const pathConstraintKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/path-constraint", unknown>>;
export interface PathConstraintDefinition extends ConstraintDefinition {
}
export interface PathConstraint extends DCommon.Forward<Constraint<string, string & DPath.Path, PathConstraintDefinition> & DKind.Kind<typeof pathConstraintKind>> {
}
export declare const PathConstraint: () => PathConstraint;
