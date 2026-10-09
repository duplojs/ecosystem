import { ConstraintDefinition, Constraint } from '../base';
import type * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
import * as DNumber from '../../../number';
export declare const positiveConstraintKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/positive-constraint", unknown>>;
export interface PositiveConstraintDefinition extends ConstraintDefinition {
}
export interface PositiveConstraint extends DCommon.Forward<Constraint<number, number & DNumber.Positive, PositiveConstraintDefinition> & DKind.Kind<typeof positiveConstraintKind>> {
}
export declare const PositiveConstraint: () => PositiveConstraint;
