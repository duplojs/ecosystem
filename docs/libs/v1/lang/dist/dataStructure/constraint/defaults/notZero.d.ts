import { ConstraintDefinition, Constraint } from '../base';
import type * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
import * as DNumber from '../../../number';
export declare const notZeroConstraintKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/not-zero-constraint", unknown>>;
export interface NotZeroConstraintDefinition extends ConstraintDefinition {
}
export interface NotZeroConstraint extends DCommon.Forward<Constraint<number, number & DNumber.NotZero, NotZeroConstraintDefinition> & DKind.Kind<typeof notZeroConstraintKind>> {
}
export declare const NotZeroConstraint: () => NotZeroConstraint;
