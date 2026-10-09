import { ConstraintDefinition, Constraint } from '../base';
import * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
import * as DNumber from '../../../number';
export declare const lessThanOrEqualConstraintKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/less-than-or-equal-constraint", unknown>>;
export interface LessThanOrEqualConstraintDefinition<GenericThreshold extends number = number> extends ConstraintDefinition {
    readonly threshold: GenericThreshold;
}
export interface LessThanOrEqualConstraint<GenericThreshold extends number = number> extends DCommon.Forward<Constraint<number, number & DNumber.LessThanOrEqual<GenericThreshold>, LessThanOrEqualConstraintDefinition<GenericThreshold>> & DKind.Kind<typeof lessThanOrEqualConstraintKind>> {
}
export declare const LessThanOrEqualConstraint: <GenericThreshold extends number>(threshold: GenericThreshold) => LessThanOrEqualConstraint<GenericThreshold>;
