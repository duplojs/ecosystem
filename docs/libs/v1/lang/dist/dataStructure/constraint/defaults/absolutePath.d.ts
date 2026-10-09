import { ConstraintDefinition, Constraint } from '../base';
import type * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
import * as DPath from '../../../path';
export declare const absolutePathConstraintKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/absolute-path-constraint", unknown>>;
export interface AbsolutePathConstraintDefinition extends ConstraintDefinition {
}
export interface AbsolutePathConstraint extends DCommon.Forward<Constraint<string, string & DPath.Absolute, AbsolutePathConstraintDefinition> & DKind.Kind<typeof absolutePathConstraintKind>> {
}
export declare const AbsolutePathConstraint: () => AbsolutePathConstraint;
