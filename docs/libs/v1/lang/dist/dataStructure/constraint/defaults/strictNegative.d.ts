import { ConstraintDefinition, Constraint } from '../base';
import type * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
import * as DNumber from '../../../number';
export declare const strictNegativeConstraintKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/strict-negative-constraint", unknown>>;
export interface StrictNegativeConstraintDefinition extends ConstraintDefinition {
}
export interface StrictNegativeConstraint extends DCommon.Forward<Constraint<number, number & DNumber.StrictNegative, StrictNegativeConstraintDefinition> & DKind.Kind<typeof strictNegativeConstraintKind>> {
}
export declare const StrictNegativeConstraint: () => StrictNegativeConstraint;
