import { ConstraintDefinition, Constraint } from '../base';
import type * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
import * as DNumber from '../../../number';
export declare const integerConstraintKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/integer-constraint", unknown>>;
export interface IntegerConstraintDefinition extends ConstraintDefinition {
}
export interface IntegerConstraint extends DCommon.Forward<Constraint<number, number & DNumber.Integer, IntegerConstraintDefinition> & DKind.Kind<typeof integerConstraintKind>> {
}
export declare const IntegerConstraint: () => IntegerConstraint;
