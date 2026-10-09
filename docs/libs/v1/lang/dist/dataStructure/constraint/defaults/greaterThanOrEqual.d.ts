import { ConstraintDefinition, Constraint } from '../base';
import * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
import * as DNumber from '../../../number';
export declare const greaterThanOrEqualConstraintKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/greater-than-or-equal-constraint", unknown>>;
export interface GreaterThanOrEqualConstraintDefinition<GenericThreshold extends number = number> extends ConstraintDefinition {
    readonly threshold: GenericThreshold;
}
export interface GreaterThanOrEqualConstraint<GenericThreshold extends number = number> extends DCommon.Forward<Constraint<number, number & DNumber.GreaterThanOrEqual<GenericThreshold>, GreaterThanOrEqualConstraintDefinition<GenericThreshold>> & DKind.Kind<typeof greaterThanOrEqualConstraintKind>> {
}
export declare const GreaterThanOrEqualConstraint: <GenericThreshold extends number>(threshold: GenericThreshold) => GreaterThanOrEqualConstraint<GenericThreshold>;
