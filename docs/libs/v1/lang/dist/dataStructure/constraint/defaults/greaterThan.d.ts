import { ConstraintDefinition, Constraint } from '../base';
import * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
import * as DNumber from '../../../number';
export declare const greaterThanConstraintKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/greater-than-constraint", unknown>>;
export interface GreaterThanConstraintDefinition<GenericThreshold extends number = number> extends ConstraintDefinition {
    readonly threshold: GenericThreshold;
}
export interface GreaterThanConstraint<GenericThreshold extends number = number> extends DCommon.Forward<Constraint<number, number & DNumber.GreaterThan<GenericThreshold>, GreaterThanConstraintDefinition<GenericThreshold>> & DKind.Kind<typeof greaterThanConstraintKind>> {
}
export declare const GreaterThanConstraint: <GenericThreshold extends number>(threshold: GenericThreshold) => GreaterThanConstraint<GenericThreshold>;
