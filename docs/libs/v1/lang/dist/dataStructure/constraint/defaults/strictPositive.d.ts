import { ConstraintDefinition, Constraint } from '../base';
import type * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
import * as DNumber from '../../../number';
export declare const strictPositiveConstraintKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/strict-positive-constraint", unknown>>;
export interface StrictPositiveConstraintDefinition extends ConstraintDefinition {
}
export interface StrictPositiveConstraint extends DCommon.Forward<Constraint<number, number & DNumber.StrictPositive, StrictPositiveConstraintDefinition> & DKind.Kind<typeof strictPositiveConstraintKind>> {
}
export declare const StrictPositiveConstraint: () => StrictPositiveConstraint;
